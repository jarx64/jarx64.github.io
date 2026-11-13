import {
  type ComponentPropsWithoutRef,
  useEffect,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

type GridCell = {
  x: number;
  y: number;
};

type IdlePoint = GridCell & {
  targetX: number;
  targetY: number;
  lastCellX: number;
  lastCellY: number;
};

export type InteractiveGridBackgroundProps = ComponentPropsWithoutRef<"div"> & {
  gridSize?: number;
  mobileGridSize?: number;
  effectColor?: string;
  darkEffectColor?: string;
  trailLength?: number;
  idleSpeed?: number;
  idleRandomCount?: number;
  glow?: boolean;
  glowRadius?: number;
  showFade?: boolean;
  fadeIntensity?: number;
};

const IDLE_DELAY_MS = 2_000;
const MOBILE_BREAKPOINT = 640;

const InteractiveGridBackground = ({
  gridSize = 48,
  mobileGridSize = 36,
  effectColor = "#4f46e5",
  darkEffectColor = "#8b5cf6",
  trailLength = 6,
  idleSpeed = 0.85,
  idleRandomCount = 3,
  glow = true,
  glowRadius = 18,
  showFade = true,
  fadeIntensity = 34,
  className,
  ...props
}: InteractiveGridBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!container || !canvas || !context) return;

    let animationFrameId = 0;
    let isVisible = true;
    let isDocumentVisible = document.visibilityState === "visible";
    let isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cachedRect: DOMRect | null = null;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let cellSize = gridSize;
    let columns = 1;
    let rows = 1;
    let lastFrameTime = performance.now();
    let lastPointerTime = performance.now();
    let pointerIsActive = false;

    const trail: GridCell[] = [];
    let idlePoints: IdlePoint[] = [];

    const getRandomCell = () => ({
      x: Math.floor(Math.random() * columns),
      y: Math.floor(Math.random() * rows),
    });

    const createIdlePoints = () => {
      idlePoints = Array.from({ length: idleRandomCount }, () => {
        const start = getRandomCell();
        const target = getRandomCell();

        return {
          ...start,
          targetX: target.x,
          targetY: target.y,
          lastCellX: start.x,
          lastCellY: start.y,
        };
      });
    };

    const addToTrail = (cell: GridCell, maxLength: number) => {
      const latest = trail[0];

      if (latest?.x === cell.x && latest.y === cell.y) return;

      trail.unshift(cell);
      trail.length = Math.min(trail.length, Math.max(1, maxLength));
    };

    const resizeCanvas = () => {
      cachedRect = container.getBoundingClientRect();
      canvasWidth = Math.max(1, Math.round(cachedRect.width));
      canvasHeight = Math.max(1, Math.round(cachedRect.height));
      cellSize = canvasWidth < MOBILE_BREAKPOINT ? mobileGridSize : gridSize;
      columns = Math.max(1, Math.ceil(canvasWidth / cellSize));
      rows = Math.max(1, Math.ceil(canvasHeight / cellSize));

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvasWidth * pixelRatio);
      canvas.height = Math.round(canvasHeight * pixelRatio);
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      canvas.style.backgroundSize = `${cellSize}px ${cellSize}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      trail.length = 0;
      createIdlePoints();
    };

    const draw = (time: number) => {
      const elapsedSeconds = Math.min((time - lastFrameTime) / 1_000, 0.1);
      lastFrameTime = time;

      if (!isReducedMotion && time - lastPointerTime > IDLE_DELAY_MS) {
        pointerIsActive = false;
        const easing = 1 - Math.exp(-idleSpeed * elapsedSeconds);

        idlePoints.forEach((point) => {
          const distanceX = point.targetX - point.x;
          const distanceY = point.targetY - point.y;

          if (Math.abs(distanceX) < 0.05 && Math.abs(distanceY) < 0.05) {
            const target = getRandomCell();
            point.targetX = target.x;
            point.targetY = target.y;
          } else {
            point.x += distanceX * easing;
            point.y += distanceY * easing;
          }

          const nextX = Math.round(point.x);
          const nextY = Math.round(point.y);

          if (nextX !== point.lastCellX || nextY !== point.lastCellY) {
            point.lastCellX = nextX;
            point.lastCellY = nextY;
            addToTrail(
              { x: nextX, y: nextY },
              trailLength * Math.max(1, idleRandomCount),
            );
          }
        });
      }

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.fillStyle = document.documentElement.classList.contains("dark")
        ? darkEffectColor
        : effectColor;

      trail.forEach((cell, index) => {
        const progress = 1 - index / Math.max(trail.length, 1);
        context.globalAlpha = Math.max(0.08, progress * progress * 0.56);
        context.shadowColor = context.fillStyle;
        context.shadowBlur = glow ? glowRadius : 0;
        context.fillRect(
          cell.x * cellSize + 1,
          cell.y * cellSize + 1,
          cellSize - 1,
          cellSize - 1,
        );
      });

      context.globalAlpha = 1;
      context.shadowBlur = 0;

      if (isVisible && isDocumentVisible && !isReducedMotion) {
        animationFrameId = window.requestAnimationFrame(draw);
      } else {
        animationFrameId = 0;
      }
    };

    const startDrawing = () => {
      if (animationFrameId || !isVisible || !isDocumentVisible) return;

      lastFrameTime = performance.now();
      animationFrameId = window.requestAnimationFrame(draw);
    };

    const drawStillFrame = () => {
      if (isReducedMotion && isVisible && isDocumentVisible) {
        draw(performance.now());
      } else {
        startDrawing();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      cachedRect ??= container.getBoundingClientRect();
      const x = event.clientX - cachedRect.left;
      const y = event.clientY - cachedRect.top;

      if (x < 0 || y < 0 || x > cachedRect.width || y > cachedRect.height) return;

      const time = performance.now();

      if (!pointerIsActive && time - lastPointerTime > IDLE_DELAY_MS) {
        trail.length = 0;
      }

      pointerIsActive = true;
      lastPointerTime = time;
      addToTrail(
        { x: Math.floor(x / cellSize), y: Math.floor(y / cellSize) },
        trailLength,
      );
      drawStillFrame();
    };

    const handleScroll = () => {
      cachedRect = null;
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === "visible";

      if (isDocumentVisible) {
        startDrawing();
      } else if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      isReducedMotion = event.matches;

      if (isReducedMotion && animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
        draw(performance.now());
      } else {
        startDrawing();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      drawStillFrame();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible) {
          startDrawing();
        } else if (animationFrameId) {
          window.cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
      },
      { rootMargin: "150px" },
    );
    intersectionObserver.observe(container);

    const themeObserver = new MutationObserver(drawStillFrame);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resizeCanvas();
    startDrawing();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", handleMotionPreference);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener("change", handleMotionPreference);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [
    darkEffectColor,
    effectColor,
    glow,
    glowRadius,
    gridSize,
    idleRandomCount,
    idleSpeed,
    mobileGridSize,
    trailLength,
  ]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className,
      )}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full [background-image:linear-gradient(to_right,oklch(var(--border)/0.55)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.55)_1px,transparent_1px)]"
      />

      {showFade && (
        <div
          className="absolute inset-0 bg-background"
          style={{
            WebkitMaskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black 88%)`,
            maskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black 88%)`,
          }}
        />
      )}
    </div>
  );
};

export default InteractiveGridBackground;

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

type ActiveTouch = {
  cell: GridCell;
  lastPulseTime: number;
  pulseIndex: number;
};

export type InteractiveGridBackgroundProps = ComponentPropsWithoutRef<"div"> & {
  gridSize?: number;
  mobileGridSize?: number;
  effectColor?: string;
  darkEffectColor?: string;
  trailLength?: number;
  glow?: boolean;
  glowRadius?: number;
  showFade?: boolean;
  fadeIntensity?: number;
};

const MOBILE_BREAKPOINT = 640;
const TOUCH_IDENTIFIER_OFFSET = 1_000_000;
const HOLD_PULSE_INTERVAL_MS = 140;
const HOLD_PULSE_OFFSETS: GridCell[] = [
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
];

const InteractiveGridBackground = ({
  gridSize = 48,
  mobileGridSize = 36,
  effectColor = "#4f46e5",
  darkEffectColor = "#8b5cf6",
  trailLength = 8,
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

    let cachedRect: DOMRect | null = null;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let cellSize = gridSize;
    let columns = 1;
    let rows = 1;
    let holdAnimationFrameId = 0;

    const trail: GridCell[] = [];
    const lastCells = new Map<number, GridCell>();
    const activeTouches = new Map<number, ActiveTouch>();

    const addToTrail = (cell: GridCell) => {
      const latest = trail[0];

      if (latest?.x === cell.x && latest.y === cell.y) return;

      trail.unshift(cell);
      trail.length = Math.min(trail.length, Math.max(1, trailLength));
    };

    const draw = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.fillStyle = document.documentElement.classList.contains("dark")
        ? darkEffectColor
        : effectColor;

      trail.forEach((cell, index) => {
        const progress = 1 - index / Math.max(trail.length, 1);
        context.globalAlpha = Math.max(0.08, progress * progress * 0.56);
        context.shadowColor = context.fillStyle.toString();
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
    };

    const addLineToTrail = (from: GridCell | undefined, to: GridCell) => {
      if (!from) {
        addToTrail(to);
        return;
      }

      let x = from.x;
      let y = from.y;
      const distanceX = Math.abs(to.x - x);
      const distanceY = Math.abs(to.y - y);
      const stepX = x < to.x ? 1 : -1;
      const stepY = y < to.y ? 1 : -1;
      let error = distanceX - distanceY;

      while (x !== to.x || y !== to.y) {
        const doubledError = error * 2;

        if (doubledError > -distanceY) {
          error -= distanceY;
          x += stepX;
        }

        if (doubledError < distanceX) {
          error += distanceX;
          y += stepY;
        }

        addToTrail({ x, y });
      }
    };

    const resizeCanvas = () => {
      const containerRect = container.getBoundingClientRect();
      canvasWidth = Math.max(1, Math.round(containerRect.width));
      canvasHeight = Math.max(1, Math.round(containerRect.height));
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

      cachedRect = null;
      trail.length = 0;
      lastCells.clear();
      activeTouches.clear();
      window.cancelAnimationFrame(holdAnimationFrameId);
      holdAnimationFrameId = 0;
      draw();
    };

    const updateInteraction = (
      clientX: number,
      clientY: number,
      identifier: number,
    ) => {
      cachedRect ??= canvas.getBoundingClientRect();
      const x = clientX - cachedRect.left;
      const y = clientY - cachedRect.top;

      if (x < 0 || y < 0 || x >= cachedRect.width || y >= cachedRect.height) {
        lastCells.delete(identifier);
        return null;
      }

      const cell = { x: Math.floor(x / cellSize), y: Math.floor(y / cellSize) };
      addLineToTrail(lastCells.get(identifier), cell);
      lastCells.set(identifier, cell);
      draw();

      return cell;
    };

    const runHoldAnimation = (time: number) => {
      let shouldDraw = false;

      activeTouches.forEach((touch) => {
        if (time - touch.lastPulseTime < HOLD_PULSE_INTERVAL_MS) return;

        const offset = HOLD_PULSE_OFFSETS[touch.pulseIndex % HOLD_PULSE_OFFSETS.length];
        const pulseCell = {
          x: touch.cell.x + offset.x,
          y: touch.cell.y + offset.y,
        };

        if (
          pulseCell.x >= 0 &&
          pulseCell.x < columns &&
          pulseCell.y >= 0 &&
          pulseCell.y < rows
        ) {
          addToTrail(pulseCell);
        }

        // Keep the cell directly under the finger as the strongest trail cell.
        addToTrail(touch.cell);
        shouldDraw = true;

        touch.pulseIndex += 1;
        touch.lastPulseTime = time;
      });

      if (shouldDraw) draw();

      holdAnimationFrameId = activeTouches.size
        ? window.requestAnimationFrame(runHoldAnimation)
        : 0;
    };

    const startHoldFeedback = (identifier: number, cell: GridCell) => {
      activeTouches.set(identifier, {
        cell,
        lastPulseTime: performance.now() - HOLD_PULSE_INTERVAL_MS,
        pulseIndex: 0,
      });

      if (!holdAnimationFrameId) {
        holdAnimationFrameId = window.requestAnimationFrame(runHoldAnimation);
      }
    };

    const stopHoldFeedback = (identifier: number) => {
      activeTouches.delete(identifier);
      lastCells.delete(identifier);

      if (!activeTouches.size && holdAnimationFrameId) {
        window.cancelAnimationFrame(holdAnimationFrameId);
        holdAnimationFrameId = 0;
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const cell = updateInteraction(
        event.clientX,
        event.clientY,
        event.pointerId,
      );

      if (cell && event.pointerType === "pen") {
        startHoldFeedback(event.pointerId, cell);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const cell = updateInteraction(
        event.clientX,
        event.clientY,
        event.pointerId,
      );
      const activeTouch = activeTouches.get(event.pointerId);

      if (cell && activeTouch) activeTouch.cell = cell;
    };

    const handlePointerEnd = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") stopHoldFeedback(event.pointerId);
    };

    const handleTouchStart = (event: TouchEvent) => {
      Array.from(event.changedTouches).forEach((touch) => {
        const identifier = TOUCH_IDENTIFIER_OFFSET + touch.identifier;
        const cell = updateInteraction(
          touch.clientX,
          touch.clientY,
          identifier,
        );

        if (cell) startHoldFeedback(identifier, cell);
      });
    };

    const handleTouchMove = (event: TouchEvent) => {
      Array.from(event.changedTouches).forEach((touch) => {
        const identifier = TOUCH_IDENTIFIER_OFFSET + touch.identifier;
        const cell = updateInteraction(
          touch.clientX,
          touch.clientY,
          identifier,
        );
        const activeTouch = activeTouches.get(identifier);

        if (cell && activeTouch) activeTouch.cell = cell;
      });
    };

    const handleTouchEnd = (event: TouchEvent) => {
      Array.from(event.changedTouches).forEach((touch) => {
        stopHoldFeedback(TOUCH_IDENTIFIER_OFFSET + touch.identifier);
      });
    };

    const stopAllHoldFeedback = () => {
      activeTouches.clear();
      lastCells.clear();

      if (holdAnimationFrameId) {
        window.cancelAnimationFrame(holdAnimationFrameId);
        holdAnimationFrameId = 0;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopAllHoldFeedback();
    };

    const handleScroll = () => {
      cachedRect = null;
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    const themeObserver = new MutationObserver(draw);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resizeCanvas();
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerEnd, { passive: true });
    window.addEventListener("pointercancel", handlePointerEnd, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("blur", stopAllHoldFeedback);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(holdAnimationFrameId);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("blur", stopAllHoldFeedback);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [
    darkEffectColor,
    effectColor,
    glow,
    glowRadius,
    gridSize,
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
        className="absolute inset-0 block h-full w-full [background-image:linear-gradient(to_right,oklch(var(--border)/0.00)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.00)_1px,transparent_1px)]"
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

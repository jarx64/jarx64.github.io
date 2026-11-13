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

    const trail: GridCell[] = [];

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

    const resizeCanvas = () => {
      cachedRect = container.getBoundingClientRect();
      canvasWidth = Math.max(1, Math.round(cachedRect.width));
      canvasHeight = Math.max(1, Math.round(cachedRect.height));
      cellSize = canvasWidth < MOBILE_BREAKPOINT ? mobileGridSize : gridSize;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvasWidth * pixelRatio);
      canvas.height = Math.round(canvasHeight * pixelRatio);
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      canvas.style.backgroundSize = `${cellSize}px ${cellSize}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      trail.length = 0;
      draw();
    };

    const handlePointerInteraction = (event: PointerEvent) => {
      cachedRect ??= container.getBoundingClientRect();
      const x = event.clientX - cachedRect.left;
      const y = event.clientY - cachedRect.top;

      if (x < 0 || y < 0 || x > cachedRect.width || y > cachedRect.height) return;

      addToTrail({ x: Math.floor(x / cellSize), y: Math.floor(y / cellSize) });
      draw();
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
    window.addEventListener("pointerdown", handlePointerInteraction, { passive: true });
    window.addEventListener("pointermove", handlePointerInteraction, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerInteraction);
      window.removeEventListener("pointermove", handlePointerInteraction);
      window.removeEventListener("scroll", handleScroll);
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

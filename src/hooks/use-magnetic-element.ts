import { gsap } from "gsap";
import type { RefObject } from "react";
import { useEffect } from "react";

const INNER_PULL_X = 0.3;
const INNER_PULL_Y = 0.2;

export function useMagneticElement(
  targetRef: RefObject<HTMLElement>,
  innerRef: RefObject<HTMLElement>,
) {
  useEffect(() => {
    const target = targetRef.current;
    const inner = innerRef.current;

    if (!target || !inner) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const elasticStrength = gsap.utils.pipe(
      gsap.utils.clamp(10, 170),
      gsap.utils.mapRange(10, 170, 0.8, 1.75),
    );
    let bounds = target.getBoundingClientRect();

    const canAnimate = () => !reducedMotionQuery.matches && finePointerQuery.matches;
    const magnetize = (offset: number, size: number) => {
      if (!size) return 0;

      const progress = gsap.utils.clamp(
        0,
        1,
        gsap.utils.normalize(0, size, Math.abs(offset)),
      );

      return gsap.utils.interpolate([1, 0.4, 0], progress);
    };
    const reset = (event?: PointerEvent, immediate = false) => {
      gsap.killTweensOf([target, inner]);

      if (immediate) {
        gsap.set([target, inner], { x: 0, y: 0 });
        return;
      }

      const distance = event
        ? Math.hypot(
            event.clientX - bounds.left - bounds.width / 2,
            event.clientY - bounds.top - bounds.height / 2,
          )
        : 80;

      gsap.to([target, inner], {
        x: 0,
        y: 0,
        duration: 1,
        ease: `elastic.out(${elasticStrength(distance)}, 0.5)`,
        overwrite: true,
      });
    };
    const handlePointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !canAnimate()) return;
      bounds = target.getBoundingClientRect();
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !canAnimate()) return;

      const relativeX = event.clientX - bounds.left - bounds.width / 2;
      const relativeY = event.clientY - bounds.top - bounds.height / 2;
      const moveX = magnetize(relativeX, bounds.width) * relativeX;
      const moveY = magnetize(relativeY, bounds.height) * relativeY;

      gsap.to(target, {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(inner, {
        x: moveX * INNER_PULL_X,
        y: moveY * INNER_PULL_Y,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      reset(event, !canAnimate());
    };
    const handleMediaChange = () => {
      if (!canAnimate()) reset(undefined, true);
    };

    const context = gsap.context(() => {
      target.addEventListener("pointerenter", handlePointerEnter);
      target.addEventListener("pointermove", handlePointerMove);
      target.addEventListener("pointerleave", handlePointerLeave);
      reducedMotionQuery.addEventListener("change", handleMediaChange);
      finePointerQuery.addEventListener("change", handleMediaChange);
    }, target);

    return () => {
      target.removeEventListener("pointerenter", handlePointerEnter);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerleave", handlePointerLeave);
      reducedMotionQuery.removeEventListener("change", handleMediaChange);
      finePointerQuery.removeEventListener("change", handleMediaChange);
      gsap.killTweensOf([target, inner]);
      context.revert();
      gsap.set([target, inner], { clearProps: "transform" });
    };
  }, [innerRef, targetRef]);
}

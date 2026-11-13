import anime from "animejs";
import { gsap } from "gsap";
import { Facebook, FileText, Github, Linkedin, Mail } from "lucide-react";
import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useMagneticElement } from "@/hooks/use-magnetic-element";

type AppConfig = {
  resumePdf: string;
};

const getResumeDownloadFilename = (resumePdf: string) => {
  const sourceFilename = resumePdf.split(/[?#]/, 1)[0].split("/").pop() ?? "";
  const date = sourceFilename.match(/(?:^|_)(\d{4}-\d{2}-\d{2})(?:_|\.|$)/)?.[1];

  return date
    ? `Jahangir_Alam__Resume__${date}.pdf`
    : "Jahangir_Alam__Resume.pdf";
};

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/jahangir1x/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/jarx64", label: "GitHub" },
  { icon: Mail, href: "mailto:jahangir64r@gmail.com", label: "Email" },
  { icon: Facebook, href: "https://www.facebook.com/jarx64", label: "Facebook" },
];

const SocialLink = ({ icon: Icon, href, label }: (typeof socialLinks)[number]) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const labelClipRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const borderRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    const icon = iconRef.current;
    const labelClip = labelClipRef.current;
    const labelText = labelRef.current;
    const border = borderRef.current;

    if (!link || !icon || !labelClip || !labelText || !border) return;

    const media = gsap.matchMedia();

    media.add(
      {
        reducedMotion: "(prefers-reduced-motion: reduce)",
        motionAllowed: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const reduceMotion = context.conditions?.reducedMotion ?? false;
        const labelWidth = labelText.scrollWidth;
        let isHovered = false;
        let isFocused = false;

        gsap.set(border, { autoAlpha: 0, scaleX: 0.88 });
        gsap.set(labelClip, { autoAlpha: 0, width: 0, x: -5 });
        gsap.set(icon, { scale: 1, rotation: 0 });

        const timeline = gsap
          .timeline({ paused: true })
          .to(
            border,
            {
              autoAlpha: 1,
              scaleX: 1,
              duration: reduceMotion ? 0 : 0.28,
              ease: "power2.out",
            },
            0,
          )
          .to(
            labelClip,
            {
              autoAlpha: 1,
              width: labelWidth,
              x: 0,
              duration: reduceMotion ? 0 : 0.36,
              ease: "power3.out",
            },
            0.02,
          )
          .to(
            icon,
            {
              scale: 1.08,
              rotation: -4,
              duration: reduceMotion ? 0 : 0.34,
              ease: "back.out(2)",
            },
            0,
          )
          .to(
            link,
            {
              color: "oklch(var(--primary))",
              duration: reduceMotion ? 0 : 0.24,
              ease: "power2.out",
            },
            0,
          );

        const updateState = () => {
          if (isHovered || isFocused) {
            timeline.play();
          } else {
            timeline.reverse();
          }
        };
        const handlePointerEnter = () => {
          isHovered = true;
          updateState();
        };
        const handlePointerLeave = () => {
          isHovered = false;
          updateState();
        };
        const handleFocus = () => {
          isFocused = true;
          updateState();
        };
        const handleBlur = () => {
          isFocused = false;
          updateState();
        };

        link.addEventListener("pointerenter", handlePointerEnter);
        link.addEventListener("pointerleave", handlePointerLeave);
        link.addEventListener("focus", handleFocus);
        link.addEventListener("blur", handleBlur);

        return () => {
          link.removeEventListener("pointerenter", handlePointerEnter);
          link.removeEventListener("pointerleave", handlePointerLeave);
          link.removeEventListener("focus", handleFocus);
          link.removeEventListener("blur", handleBlur);
        };
      },
    );

    return () => media.revert();
  }, []);

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-flex min-h-10 items-center justify-center rounded-full bg-background px-2.5 text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={label}
    >
      <span
        ref={borderRef}
        className="pointer-events-none absolute inset-0 origin-center rounded-full border border-primary/50 bg-primary/[0.06] opacity-0 shadow-[0_8px_30px_-16px_oklch(var(--primary))]"
        aria-hidden="true"
      />
      <Icon ref={iconRef} className="relative z-10 h-5 w-5 shrink-0" aria-hidden="true" />
      <span
        ref={labelClipRef}
        className="relative z-10 block w-0 overflow-hidden whitespace-nowrap opacity-0"
        aria-hidden="true"
      >
        <span ref={labelRef} className="inline-block pl-2 font-mono text-sm">
          {label}
        </span>
      </span>
    </a>
  );
};

const tooltipNameCollapseFrames = [
  "Jahangir Alam Rocky",
  "Jahangi Alam Rocky",
  "Jahang Alam Rocky",
  "Jahan Alam Rocky",
  "Jaha Alam Rock",
  "Jah Ala Roc",
  "Ja Al Ro",
  "J A R",
  "j A R",
  "j a R",
  "j a r",
  "ja r",
  "jar",
];

type HandleTooltipProps = {
  buttonRef: RefObject<HTMLButtonElement>;
  buttonLabelRef: RefObject<HTMLSpanElement>;
};

const HandleTooltip = ({ buttonRef, buttonLabelRef }: HandleTooltipProps) => {
  const rootRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const handleTextRef = useRef<HTMLSpanElement>(null);
  const suffixRef = useRef<HTMLSpanElement>(null);
  const atRef = useRef<HTMLSpanElement>(null);
  const jokeRef = useRef<HTMLSpanElement>(null);
  const runRef = useRef(0);
  const isTooltipOpenRef = useRef(false);
  const timelineRef = useRef<ReturnType<typeof anime.timeline> | null>(null);

  useMagneticElement(buttonRef, buttonLabelRef);

  const resetTooltip = useCallback(() => {
    if (handleTextRef.current) {
      handleTextRef.current.textContent = tooltipNameCollapseFrames[0];
    }

    anime.set(tooltipRef.current, {
      opacity: 0,
      translateY: 10,
      scale: 0.82,
    });
    anime.set([suffixRef.current, atRef.current], {
      opacity: 0,
      translateY: 7,
      scale: 0.6,
    });
    anime.set(jokeRef.current, {
      opacity: 0,
      translateY: 8,
    });
  }, []);

  useEffect(() => {
    const tooltip = tooltipRef.current;
    const suffix = suffixRef.current;
    const at = atRef.current;
    const joke = jokeRef.current;

    resetTooltip();

    return () => {
      runRef.current += 1;
      timelineRef.current?.pause();
      anime.remove([tooltip, suffix, at, joke]);
    };
  }, [resetTooltip]);

  const showTooltip = useCallback(() => {
    if (isTooltipOpenRef.current) return;

    const run = ++runRef.current;
    const tooltip = tooltipRef.current;
    const handleText = handleTextRef.current;

    if (!tooltip || !handleText) return;
    isTooltipOpenRef.current = true;

    timelineRef.current?.pause();
    anime.remove([tooltip, suffixRef.current, atRef.current, jokeRef.current]);
    resetTooltip();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      handleText.textContent = "jar";
      anime.set(tooltip, { opacity: 1, translateY: 0, scale: 1 });
      anime.set([suffixRef.current, atRef.current, jokeRef.current], {
        opacity: 1,
        translateY: 0,
        scale: 1,
      });
      return;
    }

    const frameState = { frame: 0 };

    timelineRef.current = anime
      .timeline({
        complete: () => {
          timelineRef.current = null;
        },
      })
      .add({
        targets: tooltip,
        opacity: [0, 1],
        translateY: [10, 0],
        scale: [0.82, 1],
        duration: 650,
        easing: "easeOutElastic(1, .55)",
      })
      .add(
        {
          targets: frameState,
          frame: tooltipNameCollapseFrames.length - 1,
          duration: 900,
          easing: "linear",
          update: () => {
            if (run !== runRef.current) return;
            handleText.textContent =
              tooltipNameCollapseFrames[
                Math.min(
                  Math.round(frameState.frame),
                  tooltipNameCollapseFrames.length - 1,
                )
              ];
          },
          complete: () => {
            if (run === runRef.current) handleText.textContent = "jar";
          },
        },
        "+=120",
      )
      .add({
        targets: suffixRef.current,
        opacity: [0, 1],
        translateY: [7, 0],
        scale: [0.6, 1],
        duration: 420,
        easing: "easeOutElastic(1, .45)",
      })
      .add({
        targets: atRef.current,
        opacity: [0, 1],
        translateY: [7, 0],
        scale: [0.6, 1],
        duration: 420,
        easing: "easeOutElastic(1, .45)",
      })
      .add({
        targets: jokeRef.current,
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 380,
        easing: "easeOutBack",
      });
  }, [resetTooltip]);

  const hideTooltip = useCallback(() => {
    if (!isTooltipOpenRef.current) return;
    isTooltipOpenRef.current = false;

    const run = ++runRef.current;
    const targets = [tooltipRef.current, suffixRef.current, atRef.current, jokeRef.current];

    timelineRef.current?.pause();
    timelineRef.current = null;
    anime.remove(targets);
    anime({
      targets: tooltipRef.current,
      opacity: 0,
      translateY: 7,
      scale: 0.96,
      duration: 220,
      easing: "easeOutQuad",
      complete: () => {
        if (run === runRef.current) resetTooltip();
      },
    });
  }, [resetTooltip]);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (
        !isTooltipOpenRef.current ||
        rootRef.current?.contains(event.target as Node)
      ) {
        return;
      }

      hideTooltip();
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);

    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [hideTooltip]);

  const handlePointerEnter = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "touch") showTooltip();
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "touch") hideTooltip();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "touch") return;

    if (isTooltipOpenRef.current) {
      hideTooltip();
    } else {
      showTooltip();
    }
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "touch") hideTooltip();
  };

  return (
    <span
      ref={rootRef}
      className="relative inline-flex"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerCancel={handlePointerCancel}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <button
        ref={buttonRef}
        type="button"
        className="invisible inline-flex cursor-help rounded-full border border-primary/30 bg-background px-5 py-2 font-mono text-xl font-semibold tracking-tight text-primary opacity-0 shadow-[0_0_32px_-12px_oklch(var(--primary))] outline-none transition-colors hover:border-primary/60 hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-2xl"
        aria-describedby="handle-tooltip"
      >
        <span ref={buttonLabelRef}>@jarx64</span>
      </button>

      <span className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-30 -translate-x-1/2">
        <span
          ref={tooltipRef}
          id="handle-tooltip"
          role="tooltip"
          aria-live="polite"
          className="handle-tooltip-glass relative block w-[min(22rem,calc(100vw-2rem))] origin-bottom rounded-xl border-2 border-primary px-5 py-4 text-card-foreground opacity-0 shadow-[0_24px_80px_-14px_rgba(0,0,0,0.9)] ring-4 ring-background"
        >
          <span
            className="absolute left-2 right-2 top-0 h-1 rounded-b-full bg-gradient-to-r from-primary via-accent to-primary"
            aria-hidden="true"
          />
          <span
            className="handle-tooltip-arrow absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-primary"
            aria-hidden="true"
          />
          <span className="relative flex min-h-7 items-baseline justify-center whitespace-nowrap font-mono text-base font-semibold sm:text-lg">
            <span ref={atRef} className="text-primary">
              @
            </span>
            <span ref={handleTextRef}>Jahangir Alam Rocky</span>
            <span ref={suffixRef} className="text-accent">
              x64
            </span>
          </span>
          <span
            ref={jokeRef}
            className="relative mt-2 block border-t border-dashed border-border pt-2 font-sans text-xs font-medium italic leading-relaxed text-muted-foreground sm:text-sm"
          >
            Not to be confused with Java™ Archive (JAR) files!
          </span>
        </span>
      </span>
    </span>
  );
};

let hasPlayedHeroIntro = false;

const HeroSection = () => {
  const [resumePdf, setResumePdf] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const introHeadingRef = useRef<HTMLHeadingElement>(null);
  const introAtRef = useRef<HTMLSpanElement>(null);
  const introNameRef = useRef<HTMLSpanElement>(null);
  const introSuffixRef = useRef<HTMLSpanElement>(null);
  const handleRowRef = useRef<HTMLDivElement>(null);
  const handleButtonRef = useRef<HTMLButtonElement>(null);
  const handleButtonLabelRef = useRef<HTMLSpanElement>(null);
  const resumeButtonRef = useRef<HTMLSpanElement>(null);
  const resumeButtonContentRef = useRef<HTMLSpanElement>(null);
  const resumeDownloadFilename = resumePdf
    ? getResumeDownloadFilename(resumePdf)
    : undefined;

  useMagneticElement(resumeButtonRef, resumeButtonContentRef);

  useEffect(() => {
    const controller = new AbortController();

    const loadConfig = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}config.json`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.status}`);
        }

        const config = (await response.json()) as AppConfig;

        if (typeof config.resumePdf !== "string" || !config.resumePdf.trim()) {
          throw new Error("config.json must contain a non-empty resumePdf path");
        }

        setResumePdf(config.resumePdf);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Unable to load resume path from config.json", error);
        }
      }
    };

    loadConfig();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const heading = introHeadingRef.current;
    const at = introAtRef.current;
    const name = introNameRef.current;
    const suffix = introSuffixRef.current;
    const handleRow = handleRowRef.current;
    const handleButton = handleButtonRef.current;
    const handleButtonLabel = handleButtonLabelRef.current;

    if (
      !hero ||
      !heading ||
      !at ||
      !name ||
      !suffix ||
      !handleRow ||
      !handleButton ||
      !handleButtonLabel
    ) {
      return;
    }

    const supportingElements = hero.querySelectorAll<HTMLElement>(
      ".hero-support-element",
    );
    const introInitials = Array.from(
      name.querySelectorAll<HTMLElement>("[data-intro-initial]"),
    );
    const introNameFragments = Array.from(
      name.querySelectorAll<HTMLElement>("[data-intro-fragment]"),
    );
    const introCollapsibleParts = Array.from(
      name.querySelectorAll<HTMLElement>("[data-intro-collapsible]"),
    );
    const uppercaseInitials = ["J", "A", "R"];
    const lowercaseInitials = ["j", "a", "r"];
    const media = gsap.matchMedia();

    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        motionAllowed: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const shouldSkip =
          hasPlayedHeroIntro || (context.conditions?.reduceMotion ?? false);

        const resetIntroName = () => {
          introInitials.forEach((letter, index) => {
            letter.textContent = uppercaseInitials[index];
          });
          gsap.set(introCollapsibleParts, { display: "inline-block" });
          gsap.set(introNameFragments, { autoAlpha: 1 });
          gsap.set(introInitials, { x: 0, y: 0, scale: 1 });
        };

        const showCompletedHero = () => {
          resetIntroName();
          gsap.set([at, suffix], { autoAlpha: 0, display: "none" });
          gsap.set(heading, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            clearProps: "transform",
          });
          gsap.set([handleRow, handleButton, ...supportingElements], {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
          });
        };

        if (shouldSkip) {
          showCompletedHero();
          return;
        }

        hasPlayedHeroIntro = true;
        resetIntroName();

        gsap.set(heading, {
          autoAlpha: 0,
          y: 20,
          scale: 1,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        });
        gsap.set([at, suffix], { autoAlpha: 0, display: "none", y: 8, scale: 0.65 });
        gsap.set(introInitials, { willChange: "transform" });
        gsap.set(introNameFragments, { willChange: "opacity" });
        gsap.set(handleRow, { autoAlpha: 1 });
        gsap.set(handleButton, { autoAlpha: 0, scale: 0.92 });
        gsap.set(supportingElements, { autoAlpha: 0, y: 16 });

        let collapsedInitialX: number[] = [];
        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            gsap.set(heading, { clearProps: "willChange" });
            gsap.set([...introInitials, ...introNameFragments], {
              clearProps: "willChange",
            });
          },
        });

        timeline
          .to(heading, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.15)
          .to(
            supportingElements,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.09,
              ease: "power3.out",
            },
            0.3,
          )
          .addLabel("collapse", 1.75);

        timeline
          .to(
            introNameFragments,
            {
              autoAlpha: 0,
              duration: 0.42,
              stagger: 0.04,
              ease: "power2.out",
            },
            "collapse",
          )
          .call(
            () => {
              const nameRect = name.getBoundingClientRect();
              const letterRects = introInitials.map((initial) =>
                initial.getBoundingClientRect(),
              );
              const jarWidth = letterRects.reduce(
                (total, rect) => total + rect.width,
                0,
              );
              const jarLeft = nameRect.left + (nameRect.width - jarWidth) / 2;
              let precedingWidth = 0;

              collapsedInitialX = letterRects.map((rect) => {
                const offset = jarLeft + precedingWidth - rect.left;
                precedingWidth += rect.width;
                return offset;
              });
            },
            [],
            ">+=0.1",
          )
          .to(
            introInitials,
            {
              x: (index) => collapsedInitialX[index] ?? 0,
              duration: 0.62,
              ease: "power3.inOut",
            },
            ">",
          )
          .set(introCollapsibleParts, { display: "none" })
          .set(introInitials, { x: 0 })
          .addLabel("lowercase", ">+=0.12");

        introInitials.forEach((letter, index) => {
          const lowercaseAt = `lowercase+=${index * 0.1}`;

          timeline
            .to(
              letter,
              {
                y: 2,
                scale: 0.78,
                duration: 0.1,
                ease: "power2.in",
              },
              lowercaseAt,
            )
            .call(
              () => {
                letter.textContent = lowercaseInitials[index];
              },
              [],
              `${lowercaseAt}+=0.1`,
            )
            .to(
              letter,
              {
                y: 0,
                scale: 1,
                duration: 0.18,
                ease: "back.out(2)",
              },
              `${lowercaseAt}+=0.1`,
            );
        });

        timeline
          .set(suffix, { display: "inline-block" })
          .to(suffix, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            ease: "back.out(2)",
          })
          .set(at, { display: "inline-block" })
          .to(at, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            ease: "back.out(2)",
          })
          .addLabel("moveToHandle", ">+=0.2")
          .to(
            heading,
            {
              x: () => {
                const source = heading.getBoundingClientRect();
                const target = handleButtonLabel.getBoundingClientRect();
                return target.left + target.width / 2 - (source.left + source.width / 2);
              },
              y: () => {
                const source = heading.getBoundingClientRect();
                const target = handleButtonLabel.getBoundingClientRect();
                return target.top + target.height / 2 - (source.top + source.height / 2);
              },
              scale: () => {
                const source = heading.getBoundingClientRect();
                const target = handleButtonLabel.getBoundingClientRect();
                return Math.min(target.width / source.width, target.height / source.height);
              },
              duration: 0.95,
              ease: "power3.inOut",
            },
            "moveToHandle",
          )
          .to(heading, { autoAlpha: 0, duration: 0.16 })
          .to(handleButton, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.42,
            ease: "back.out(1.7)",
          })
          .call(() => {
            resetIntroName();
          })
          .set([at, suffix], { autoAlpha: 0, display: "none" })
          .set(heading, { x: 0, y: 0, scale: 1 })
          .to(heading, { autoAlpha: 1, duration: 0.7, ease: "power2.out" });

        return () => timeline.kill();
      },
      hero,
    );

    return () => media.revert();
  }, []);

  return (
    <section ref={heroRef} id="about" className="flex min-h-[90vh] items-center overflow-hidden pb-12 pt-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-12">
          
          <div className="space-y-10 w-full">
            {/* Intro */}
            <div className="flex flex-col items-center">
              <h1
                ref={introHeadingRef}
                aria-label="Jahangir Alam Rocky"
                className="invisible whitespace-nowrap text-[clamp(1.75rem,8.5vw,3rem)] font-bold leading-[0.92] tracking-tighter text-foreground opacity-0 sm:text-6xl md:text-8xl"
              >
                <span ref={introAtRef} aria-hidden="true" className="invisible hidden text-primary">
                  @
                </span>
                <span ref={introNameRef} aria-hidden="true" className="inline-block">
                  <span data-intro-initial className="inline-block">J</span>
                  <span data-intro-fragment data-intro-collapsible className="inline-block">
                    ahangir
                  </span>
                  <span data-intro-collapsible className="inline-block">
                    &nbsp;
                  </span>
                  <span data-intro-initial className="inline-block">A</span>
                  <span data-intro-fragment data-intro-collapsible className="inline-block">
                    lam
                  </span>
                  <span data-intro-collapsible className="inline-block">
                    &nbsp;
                  </span>
                  <span data-intro-initial className="inline-block">R</span>
                  <span data-intro-fragment data-intro-collapsible className="inline-block">
                    ocky
                  </span>
                </span>
                <span ref={introSuffixRef} aria-hidden="true" className="invisible hidden text-accent">
                  x64
                </span>
              </h1>

              <div
                ref={handleRowRef}
                className="invisible mt-6 flex w-full max-w-xl items-center gap-4 opacity-0 sm:gap-6"
                aria-label="Online handle: jarx64"
              >
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/50" aria-hidden="true" />
                <HandleTooltip
                  buttonRef={handleButtonRef}
                  buttonLabelRef={handleButtonLabelRef}
                />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/50" aria-hidden="true" />
              </div>

              <p className="hero-support-element invisible mt-5 font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground opacity-0 sm:text-sm">
                Software Engineer
              </p>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto space-y-5">
              <p className="hero-support-element invisible text-balance text-xl font-light leading-snug text-muted-foreground opacity-0 sm:text-2xl md:text-3xl">
                Crafting scalable systems in <span className="text-foreground font-medium">.NET</span> and <span className="text-foreground font-medium">Go</span>.
              </p>
              
              {/* <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-mono text-muted-foreground/80 hero-text-element opacity-0">
                <span>Dhaka, Bangladesh</span>
              </div> */}
            </div>

            {/* Focus tags - Minimal */}
            {/* <div className="flex flex-wrap justify-center gap-2 pt-2 hero-text-element opacity-0">
              {[".NET", "Go", "Node.js", "OSS"].map((tech) => (
                <span key={tech} className="skill-tag translate-y-0 text-primary/80 border-primary/20">
                  {tech}
                </span>
              ))}
            </div> */}

            {/* Resume Button */}
            <div className="hero-support-element invisible flex justify-center pt-2 opacity-0">
              <span ref={resumeButtonRef} className="inline-flex">
                <a
                  href={resumePdf ?? undefined}
                  download={resumeDownloadFilename}
                  aria-disabled={!resumePdf}
                  onClick={(event) => {
                    if (!resumePdf) event.preventDefault();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground border border-transparent rounded-full font-mono text-sm font-medium hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-300 transform aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
                >
                  <span ref={resumeButtonContentRef} className="inline-flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Download Resume
                  </span>
                </a>
              </span>
            </div>

            {/* Social Links */}
            <div className="hero-support-element invisible flex flex-wrap justify-center gap-3 pt-2 opacity-0 sm:gap-5">
              {socialLinks.map((socialLink) => (
                <SocialLink key={socialLink.label} {...socialLink} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

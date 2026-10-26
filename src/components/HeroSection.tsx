import anime from "animejs";
import { Facebook, FileText, Github, Linkedin, Mail } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import resumePdf from "../assets/Md_Jahangir_Alam__2026-10-25.pdf";

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/jahangir1x/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/jarx64", label: "GitHub" },
  { icon: Mail, href: "mailto:jahangir64r@gmail.com", label: "Email" },
  { icon: Facebook, href: "https://www.facebook.com/jarx64", label: "Facebook" },
];

const nameCollapseFrames = [
  "Jahangir Alam Rocky",
  "Jahangi Alam Rocky",
  "Jahang Alam Rocky",
  "Jahan Alam Rocky",
  "Jaha Alam Rocky",
  "Jah Alam Rocky",
  "Ja Alam Rocky",
  "J Alam Rocky",
  "j Alam Rocky",
  "j Ala Rocky",
  "j Al Rocky",
  "j A Rocky",
  "j a Rocky",
  "j a Rock",
  "j a Roc",
  "j a Ro",
  "j a R",
  "j a r",
  "jar",
];

const HandleTooltip = () => {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const handleTextRef = useRef<HTMLSpanElement>(null);
  const suffixRef = useRef<HTMLSpanElement>(null);
  const atRef = useRef<HTMLSpanElement>(null);
  const jokeRef = useRef<HTMLSpanElement>(null);
  const runRef = useRef(0);
  const timelineRef = useRef<ReturnType<typeof anime.timeline> | null>(null);

  const resetTooltip = useCallback(() => {
    if (handleTextRef.current) {
      handleTextRef.current.textContent = nameCollapseFrames[0];
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
    resetTooltip();

    return () => {
      runRef.current += 1;
      timelineRef.current?.pause();
      anime.remove([
        tooltipRef.current,
        suffixRef.current,
        atRef.current,
        jokeRef.current,
      ]);
    };
  }, [resetTooltip]);

  const showTooltip = () => {
    const run = ++runRef.current;
    const tooltip = tooltipRef.current;
    const handleText = handleTextRef.current;

    if (!tooltip || !handleText) return;

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
          frame: nameCollapseFrames.length - 1,
          duration: 900,
          easing: "linear",
          update: () => {
            if (run !== runRef.current) return;
            handleText.textContent =
              nameCollapseFrames[Math.min(Math.round(frameState.frame), nameCollapseFrames.length - 1)];
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
  };

  const hideTooltip = () => {
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
  };

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={showTooltip}
      onPointerLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <span
        className="cursor-help rounded-full border border-primary/30 bg-primary/10 px-5 py-2 font-mono text-xl font-semibold tracking-tight text-primary shadow-[0_0_32px_-12px_oklch(var(--primary))] outline-none transition-colors hover:border-primary/60 hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-2xl"
        tabIndex={0}
        aria-describedby="handle-tooltip"
      >
        @jarx64
      </span>

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
            Not to be confused with Java Archive (JAR) files!
          </span>
        </span>
      </span>
    </span>
  );
};

const HeroSection = () => {
  useEffect(() => {
    const heroElements = '.hero-text-element';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      anime.set(heroElements, { opacity: 1, translateY: 0 });
      return;
    }

    // Text Reveal Animation
    anime({
      targets: heroElements,
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutExpo',
      delay: anime.stagger(100, { start: 200 })
    });
  }, []);

  return (
    <section id="about" className="min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-12">
          
          <div className="space-y-10 w-full">
            {/* Intro */}
            <div className="flex flex-col items-center">
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.92] tracking-tighter text-balance text-foreground hero-text-element opacity-0">
                Jahangir Alam Rocky
              </h1>

              <div className="mt-6 flex w-full max-w-xl items-center gap-4 sm:gap-6 hero-text-element opacity-0" aria-label="Online handle: jarx64">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/50" aria-hidden="true" />
                <HandleTooltip />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/50" aria-hidden="true" />
              </div>

              <p className="mt-5 font-mono text-xs sm:text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground hero-text-element opacity-0">
                Software Engineer
              </p>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto space-y-5">
              <p className="text-xl sm:text-2xl md:text-3xl font-light text-muted-foreground leading-snug text-balance hero-text-element opacity-0">
                Crafting scalable systems in <span className="text-foreground font-medium">.NET</span> and <span className="text-foreground font-medium">Go</span>.
              </p>
              
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-mono text-muted-foreground/80 hero-text-element opacity-0">
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Focus tags - Minimal */}
            <div className="flex flex-wrap justify-center gap-2 pt-2 hero-text-element opacity-0">
              {[".NET", "Go", "Node.js", "OSS"].map((tech) => (
                <span key={tech} className="skill-tag translate-y-0 text-primary/80 border-primary/20">
                  {tech}
                </span>
              ))}
            </div>

            {/* Resume Button */}
            <div className="flex justify-center pt-2 hero-text-element opacity-0">
              <a 
                href={resumePdf}
                download="Jahangir_Alam_Resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground border border-transparent rounded-full font-mono text-sm font-medium hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-300 transform"
              >
                <FileText className="w-4 h-4" />
                Download Resume
              </a>
            </div>

            {/* Social Links - Minimal text/icon mix */}
            <div className="flex justify-center gap-10 pt-2 hero-text-element opacity-0">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center text-muted-foreground hover:text-primary transition duration-700"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 transition duration-700 group-hover:scale-110" />
                  <span className="hidden md:block font-mono text-sm whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:ml-2 group-hover:opacity-100 transition-all duration-700 ease-out">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

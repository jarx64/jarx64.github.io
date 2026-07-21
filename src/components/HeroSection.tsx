import anime from "animejs";
import { Facebook, FileText, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import resumePdf from "../assets/Jahangir-Alam.pdf";

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/jahangir1x/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/jarx64", label: "GitHub" },
  { icon: Mail, href: "mailto:hello@jarx64.com", label: "Email" },
  { icon: Facebook, href: "https://www.facebook.com/rocky10x", label: "Facebook" },
];

const HeroSection = () => {
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Text Reveal Animation
    anime({
      targets: '.hero-text-element',
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
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-12">
          
          <div className="space-y-8 w-full">
            {/* Intro */}
            <div className="space-y-6 flex flex-col items-center">
              <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter text-foreground hero-text-element opacity-0">
                Jahangir Alam Rocky
              </h1>
              <div className="h-1 w-full bg-primary hero-text-element opacity-0"></div>
            </div>

            {/* Role & Description */}
            <div className="max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl font-light text-muted-foreground leading-relaxed text-balance hero-text-element opacity-0">
                Backend Application Developer<br />
                Crafting scalable systems in <span className="text-foreground font-medium">.NET</span> and <span className="text-foreground font-medium">Go</span>.
              </p>
              
              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-mono text-muted-foreground/80 hero-text-element opacity-0">
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

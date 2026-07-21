import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/blog", label: "~/blog" },

  { href: "#experience", label: "./experience" },
  { href: "#projects", label: "./projects" },
  { href: "#skills", label: "./skills" },
  { href: "#education", label: "./education" },
  { href: "#contact", label: "./contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-2" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          {/* Logo & Blog */}
          <div className="flex items-center gap-8">
            <a href="#" className="font-mono font-bold text-xl tracking-tighter text-primary hover:text-primary/80 transition-colors">
              ~/
            </a>
            <a 
              href="/blog" 
              className="hidden md:inline-flex items-center justify-center px-4 py-1.5 text-xs font-mono font-medium text-primary-foreground bg-primary border border-transparent rounded-full hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-300 transform"
            >
              ~/blog
            </a>
          </div>

          {/* Desktop Nav & Utilities */}
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.filter(link => link.href !== "/blog").map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-link text-xs"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            
            <div className="hidden md:block w-px h-4 bg-border"></div>

            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border absolute w-full left-0 top-full p-6 animate-fade-in-up">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-lg text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

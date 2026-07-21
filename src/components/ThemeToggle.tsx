import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDark);
  };

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full bg-secondary border border-primary transition-all duration-300 hover:shadow-[0_0_10px_rgba(var(--primary),0.3)] focus:outline-none focus:ring-2 focus:ring-primary/20"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute top-[1px] left-[1px] w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-all duration-300 ${
          isDark ? "translate-x-7 bg-primary" : "translate-x-0 bg-primary"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-white fill-white" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-white fill-white" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;

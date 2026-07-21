const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear}{" "}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Jahangir Alam Rocky
            </a>
          </p>
          
          <p className="text-sm text-muted-foreground font-mono">
            <span className="text-primary">git commit</span> -m "Built with ❤️"
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

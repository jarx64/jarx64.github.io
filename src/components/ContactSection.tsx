import { Linkedin, Mail } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title justify-center">
            {/* <span className="font-mono text-primary text-xl">git push</span>{" "} */}
            Contact
          </h2>

          <p className="text-muted-foreground mb-8">
            Feel free to reach out if you want to collaborate on a project, have a question, or just want to connect!
          </p>

          {/* Contact methods */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href="mailto:jahangir64r@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
            >
              <Mail className="w-5 h-5" />
              Send Email
            </a>
            <a
              href="https://www.linkedin.com/in/jahangir1x/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
            >
              <Linkedin className="w-5 h-5" />
              Connect
            </a>
          </div>

          {/* Social links */}
          {/* <div className="flex justify-center gap-4">
            <a
              href="https://github.com/jahangir1x"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-card border border-border hover:border-primary transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/jalamrocky"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-card border border-border hover:border-primary transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

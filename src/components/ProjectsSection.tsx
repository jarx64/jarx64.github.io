import { Github, Play } from "lucide-react";

const projects = [
  {
    id: "proj-1",
    title: "Workspaces+ Extension",
    description: "Firefox extension for managing browser workspaces efficiently.",
    image: "https://addons.mozilla.org/user-media/previews/full/289/289939.png?modified=1701981204",
    tags: ["JavaScript", "HTML", "CSS"],
    links: {
      source: "https://github.com/jarx64/workspaces-plus",
    },
  },
  {
    id: "proj-2",
    title: "Salvation Game",
    description: "2D platformer demo game with unique mechanics.",
    image: "https://img.itch.zone/aW1hZ2UvMTMzMjkwNC83NzYwODExLnBuZw==/original/zsBVw5.png",
    tags: ["Unity", "C#"],
    links: {
      demo: "https://www.youtube.com/watch?v=np9XtK6q-5I",
      source: "https://github.com/jarx64/Bad_is_Good",
    },
  },
  {
    id: "proj-3",
    title: "WW3 Game",
    description: "2D top-down demo game built with SFML and C++.",
    image: "https://github.com/jarx64/WW3/raw/main/res/WW3_demo.png",
    tags: ["SFML", "C++"],
    links: {
      source: "https://github.com/jarx64/WW3",
    },
  },
  {
    id: "proj-4",
    title: "Calculator MVC",
    description: "Calculator with MVC design pattern using Java Swing.",
    image: "https://github.com/jarx64/Calculator/raw/main/repo_res/overview.gif",
    tags: ["Java", "Swing"],
    links: {
      source: "https://github.com/jarx64/Calculator",
    },
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">
            <span className="font-mono text-primary text-xl">git branch</span>{" "}
            Projects
          </h2>

          {/* Git branch visualization header */}
          <div className="relative mb-12 pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-branch-main opacity-60" />
            <div className="absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-branch-main bg-background" />
            <p className="text-muted-foreground font-mono text-sm pl-4">
              * Branches merged into main
            </p>
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="relative group opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Branch line connecting to card */}
                <div className="absolute -left-4 top-8 w-4 h-0.5 bg-branch-develop opacity-60 hidden md:block" />
                <div className="absolute -left-6 top-6 w-4 h-4 rounded-full border-2 border-branch-develop bg-background hidden md:block" />

                <div className="bg-card rounded-lg border border-border overflow-hidden card-hover h-full flex flex-col">
                  {/* Project image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-3">
                      {project.links.source && (
                        <a
                          href={project.links.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline font-mono"
                        >
                          <Github className="w-4 h-4" /> Source
                        </a>
                      )}
                      {project.links.demo && (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline font-mono"
                        >
                          <Play className="w-4 h-4" /> Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

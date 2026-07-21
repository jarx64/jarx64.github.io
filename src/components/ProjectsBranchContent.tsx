import { motion } from "framer-motion";
import { Github } from "lucide-react";

const projects = [
  {
    id: "proj-1",
    title: "DeltaShare",
    description:
      "Cross-platform multi-user file sharing software for seamless file exchange between Android and Windows. Features offline pooling through local network with real-time multi-user support using MVVM architecture.",
    tags: [".NET MAUI", "C#", "XAML", "Cross-Platform"],
    github: "https://github.com/Learnathon-By-Geeky-Solutions/dotcube",
    demo: null,
  },
  {
    id: "proj-2",
    title: "Workspaces+",
    description:
      "Firefox extension to organize tabs into workspaces. Features workspace cloning, dark theme, keyboard shortcuts (Ctrl+E), tab search, and consistent UI with current workspace indicator.",
    tags: ["JavaScript", "Firefox Extension", "Browser API"],
    github: "https://github.com/jarx64/workspaces-plus",
    demo: "https://github.com/user-attachments/assets/cc8c078c-6d2a-4087-862e-f76e06871a09",
  },
  {
    id: "proj-3",
    title: "OS-Pulse",
    description:
      "Real-time system monitoring platform with web dashboard for security research. Features Frida-based dynamic instrumentation, network traffic analysis, and multi-agent architecture with Go/GORM backend.",
    tags: ["Go", "React", "Frida", "PostgreSQL", "TypeScript"],
    github: "https://github.com/jarx64/os-pulse",
    demo: null,
  },
  {
    id: "proj-4",
    title: "AR Here",
    description:
      "AR application to view 3D concept models in augmented reality. Supports plane detection with ARCore/ARKit, model manipulation (rotate, scale, move), and multiple 3D models in same scene.",
    tags: ["Flutter", "ARCore", "ARKit", "Dart"],
    github: "https://github.com/jarx64/ar-here",
    demo: "https://github.com/user-attachments/assets/bf5a5a17-d7d5-475a-a370-bada98a66102",
  },
  {
    id: "proj-5",
    title: "Disruption",
    description:
      "First-person game built with Unity featuring custom hand rigging and player-sensing enemy AI. A story-driven experience with immersive gameplay mechanics.",
    tags: ["Unity", "C#", "Game Dev", "AI"],
    github: "https://github.com/jarx64/disruption-unity",
    demo: "https://github.com/user-attachments/assets/a6a6819d-b4f4-4ec1-a12c-0042bd306fa0",
  },
  {
    id: "proj-6",
    title: "WW3",
    description:
      "Fast-paced 2D aircraft shooter game with story-driven experience. Features varied enemy types, attractive UI, brain-teasing puzzles, and emotional narrative about war and persistence.",
    tags: ["C++", "SFML", "Game Dev"],
    github: "https://github.com/jarx64/WW3-sfml-windows",
    demo: null,
  },
];

const branchColorClasses = {
  main: {
    node: "border-branch-main bg-branch-main",
    line: "bg-branch-main",
  },
  feature: {
    node: "border-branch-feature bg-branch-feature",
    line: "bg-branch-feature",
  },
};

interface ProjectsBranchContentProps {
  branchColor?: "feature" | "develop" | "hotfix" | "main";
}

const ProjectsBranchContent = ({ branchColor = "main" }: ProjectsBranchContentProps) => {
  const colors = branchColorClasses[branchColor];


  return (
    <div className="relative pl-3 md:pl-3">
      {/* Vertical line connecting commits */}


      {projects.map((project, index) => (
        <div
          key={project.id}
          className="relative mb-6 last:mb-0 opacity-0 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Vertical line segment */}
          {index !== projects.length - 1 && (
            <motion.div className={`absolute -left-[1.5rem] md:-left-[1.625rem] top-4 -bottom-10 w-2 ${colors.line} opacity-50`}
                          initial={{ scaleY: 0, originY: 0 }}
              whileInView={{ scaleY: 1, originY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "linear", delay: 0.5 }}
            />
          )}

          {/* Commit node */}
          <div className={`absolute -left-[1.75rem] md:-left-8 top-[0.6rem] md:top-2 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 ${colors.node} transition-all duration-300 hover:scale-150 z-10`} />

          {/* Connector to content */}
          <div
            className={`absolute -left-5 top-[14px] w-[1.2rem] h-2 md:w-[1.2rem] md:h-2 ${colors.line} opacity-60`}
          />

          <div className="bg-card rounded-lg border border-border p-4 card-hover group">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h4>
              <div className="flex gap-2 shrink-0">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="View on GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed mb-3">
              {project.description}
            </p>

            {/* Embedded Demo Video */}
            {project.demo && (
              <div className="mb-3">
                <div className="rounded-md overflow-hidden border border-border bg-black/50">
                  <video
                    src={project.demo}
                    controls
                    className="w-full max-h-64 object-contain"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsBranchContent;

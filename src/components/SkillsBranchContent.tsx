import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Languages",
    skills: ["C#", "Go", "TypeScript", "JavaScript", "C++", "Dart", "SQL"],
  },
  {
    title: "Backend & Cloud",
    skills: ["ASP.NET Core", "Node.js", "CQRS", "MediatR", "REST APIs", "GraphQL"],
  },
  {
    title: "Frameworks & Libraries",
    skills: ["React", "Angular", ".NET MAUI", "Flutter", "Echo", "Gin", "GORM"],
  },
  {
    title: "Databases",
    skills: ["MSSQL", "PostgreSQL", "MongoDB"],
  },
  {
    title: "Game Dev",
    skills: ["Unity", "SFML", "Game Physics"],
  },
  {
    title: "Tools & DevOps",
    skills: ["Git", "Docker", "Linux", "Frida", "VS Code"],
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

interface SkillsBranchContentProps {
  branchColor?: "feature" | "develop" | "hotfix" | "main";
}

const SkillsBranchContent = ({ branchColor = "hotfix" }: SkillsBranchContentProps) => {
  const colors = branchColorClasses[branchColor];

  return (
    <div className="relative pl-3 md:pl-3">
      {/* Vertical line connecting commits */}


      {skillCategories.map((category, catIndex) => (
        <div
          key={category.title}
          className="relative mb-6 last:mb-0 opacity-0 animate-fade-in"
          style={{ animationDelay: `${catIndex * 0.1}s` }}
        >
          {/* Vertical line segment */}
          {catIndex !== skillCategories.length - 1 && (
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

          <div className="bg-card rounded-lg border border-border p-4 card-hover">
            <h4 className="text-base font-semibold text-foreground mb-3 font-mono">
              {category.title}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {category.skills.map((skill, skillIndex) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border transition-all duration-200 hover:border-primary hover:text-primary opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${catIndex * 0.1 + skillIndex * 0.03}s`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsBranchContent;

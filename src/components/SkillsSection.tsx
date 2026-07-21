const skillCategories = [
  {
    title: "Languages",
    skills: ["Go", "JavaScript", "TypeScript", "C++", "C#", "Java", "Python"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "REST APIs", "GraphQL", "PostgreSQL", "MongoDB"],
  },
  {
    title: "Game Dev",
    skills: ["Unity", "SFML", "Game Physics", "2D Graphics"],
  },
  {
    title: "Tools & Others",
    skills: ["Git", "Docker", "Linux", "VS Code", "Firebase"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">
            <span className="font-mono text-primary text-xl">git status</span>{" "}
            Skills
          </h2>

          {/* Branch visualization */}
          <div className="relative pl-12 md:pl-16">
            <div className="absolute left-5 md:left-6 top-0 bottom-0 w-0.5 bg-branch-hotfix opacity-60" />

            {skillCategories.map((category, catIndex) => (
              <div
                key={category.title}
                className="relative mb-8 last:mb-0 opacity-0 animate-fade-in"
                style={{ animationDelay: `${catIndex * 0.1}s` }}
              >
                {/* Commit node */}
                <div className="absolute left-[-28px] md:left-[-40px] top-1 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-branch-hotfix bg-branch-hotfix transition-all duration-300 hover:scale-125 z-10" />
                
                {/* Branch connector */}
                <div className="absolute left-[-12px] md:left-[-16px] top-[10px] md:top-[12px] w-4 md:w-6 h-0.5 bg-branch-hotfix opacity-60" />

                <div className="bg-card rounded-lg border border-border p-5 card-hover">
                  <h3 className="text-lg font-semibold text-foreground mb-4 font-mono">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skill}
                        className="skill-tag opacity-0 animate-slide-in-left"
                        style={{ animationDelay: `${catIndex * 0.1 + skillIndex * 0.05}s` }}
                      >
                        {skill}
                      </span>
                    ))}
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

export default SkillsSection;

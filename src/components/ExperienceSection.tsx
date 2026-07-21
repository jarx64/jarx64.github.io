import GitBranchTimeline from "./GitBranchTimeline";

const experiences = [
  {
    id: "exp-1",
    date: "2023 - Present",
    title: "Backend Developer",
    subtitle: "Open Source Contributor",
    description: "Contributing to various open-source projects, focusing on backend development with Go and Node.js. Building scalable APIs and microservices.",
    tags: ["Go", "Node.js", "REST APIs", "Docker"],
  },
  {
    id: "exp-2",
    date: "2022 - 2023",
    title: "Game Developer",
    subtitle: "Unity & C#",
    description: "Developed 2D platformer and top-down games using Unity and C#. Created game mechanics, physics systems, and visual effects.",
    tags: ["Unity", "C#", "Game Design", "SFML"],
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">
            <span className="font-mono text-primary text-xl">git checkout</span>{" "}
            Experience
          </h2>
          
          <GitBranchTimeline items={experiences} branchColor="feature" />
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;

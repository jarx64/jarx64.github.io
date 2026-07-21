import GitBranchTimeline from "./GitBranchTimeline";

const education = [
  {
    id: "edu-1",
    date: "2020 - Present",
    title: "University of Rajshahi",
    subtitle: "B.Sc. in Computer Science and Engineering",
    description: "Pursuing undergraduate degree with focus on software engineering, algorithms, and system design.",
    tags: ["Data Structures", "Algorithms", "OOP", "Databases"],
  },
  {
    id: "edu-2",
    date: "2018 - 2020",
    title: "Higher Secondary Certificate",
    subtitle: "Science Group",
    description: "Completed HSC with focus on Physics, Chemistry, and Mathematics.",
    tags: ["Physics", "Mathematics", "Chemistry"],
  },
];

const EducationSection = () => {
  return (
    <section id="education" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">
            <span className="font-mono text-primary text-xl">git log</span>{" "}
            Education
          </h2>
          
          <GitBranchTimeline items={education} branchColor="develop" />
        </div>
      </div>
    </section>
  );
};

export default EducationSection;

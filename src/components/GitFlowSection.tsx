import BranchContent from "./BranchContent";
import GitGraphLayout from "./GitGraphLayout";
import ProjectsBranchContent from "./ProjectsBranchContent";
import SkillsBranchContent from "./SkillsBranchContent";

const experiences = [
  {
    id: "exp-1",
    date: "Nov 2025 - Present",
    title: "Software Engineer",
    subtitle: "Inument · Full-time · On-site",
    description:
      "Working with CQRS, MediatR, Clean Architecture, and MSSQL in a financial domain. Analyzed SQL Server execution plans and designed appropriate indexing strategies to improve query performance by >95%. Built a scheduled background reporting system to generate and distribute sales reports automatically.",
    tags: ["ASP.NET Core", "CQRS", "MediatR", "MSSQL", "Clean Architecture"],
    link: { url: "https://inument.com/", label: "inument.com" },
  },
  {
    id: "exp-2",
    date: "Aug 2025 - Oct 2025",
    title: "Software Engineer",
    subtitle: "Inument · Part-time · Remote",
    description:
      "Developed and maintained scalable web applications using ASP.NET Core and Angular. Designed and implemented RESTful APIs and integrated them with front-end components.",
    tags: ["ASP.NET Core", "Angular", "REST APIs"],
    link: { url: "https://inument.com/", label: "inument.com" },
  },
  {
    id: "exp-3",
    date: "Oct 2023 - Mar 2024",
    title: "Backend Developer Intern",
    subtitle: "Vivasoft Limited · Internship · Rajshahi, Bangladesh",
    description:
      "Completed Weekdemy 1.0 backend development program. Worked with Go frameworks (Echo, Gin, GORM). Developed a stress-testing program using Resty framework and built a CSV data import tool for mass user data loading.",
    tags: ["Go", "Echo", "Gin", "GORM", "Git"],
    link: { url: "https://vivasoftltd.com/", label: "vivasoftltd.com" },
  },
];

const education = [
  {
    id: "edu-1",
    date: "Jan 2020 - Nov 2025",
    title: "University of Rajshahi",
    subtitle: "B.Sc. in Computer Science and Engineering",
    description:
      "Graduated with a Bachelor of Science degree in Computer Science and Engineering. Focused on software engineering, algorithms, and system design.",
    tags: ["Data Structures", "Algorithms", "OOP", "Databases"],
  },
  {
    id: "edu-2",
    date: "2017 - 2019",
    title: "Govt. City College Rangpur",
    subtitle: "Higher Secondary Certificate",
    tags: ["Physics", "Mathematics", "Chemistry", "Biology"],
  },
];

const GitFlowSection = () => {
  const sections = [
    {
      id: "experience",
      branchName: "feature/experience",
      branchColor: "feature" as const,
      content: <BranchContent items={experiences} branchColor="feature" />,
    },
    {
      id: "projects",
      branchName: "feature/projects",
      branchColor: "feature" as const,
      content: <ProjectsBranchContent branchColor="feature" />,
    },
    {
      id: "skills",
      branchName: "feature/skills",
      branchColor: "feature" as const,
      content: <SkillsBranchContent branchColor="feature" />,
    },
    {
      id: "education",
      branchName: "feature/education",
      branchColor: "feature" as const,
      content: <BranchContent items={education} branchColor="feature" />,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="mb-16 md:mb-24">
            <h2 className="section-title">
              Journey Log
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm border-l-2 border-primary/20 pl-4">
               <span>git log --graph --oneline --all</span>
            </div>
          </div>

          <GitGraphLayout sections={sections} />
        </div>
      </div>
    </section>
  );
};

export default GitFlowSection;

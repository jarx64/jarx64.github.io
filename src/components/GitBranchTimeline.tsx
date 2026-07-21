import { ReactNode } from "react";

interface TimelineItem {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  link?: { url: string; label: string };
  isMerge?: boolean;
}

interface GitBranchTimelineProps {
  items: TimelineItem[];
  branchColor?: "main" | "feature" | "develop" | "hotfix";
}

const branchColors = {
  main: "border-branch-main bg-branch-main",
  feature: "border-branch-feature bg-branch-feature",
  develop: "border-branch-develop bg-branch-develop",
  hotfix: "border-branch-hotfix bg-branch-hotfix",
};

const lineColors = {
  main: "bg-branch-main",
  feature: "bg-branch-feature",
  develop: "bg-branch-develop",
  hotfix: "bg-branch-hotfix",
};

const GitBranchTimeline = ({ items, branchColor = "main" }: GitBranchTimelineProps) => {
  return (
    <div className="relative pl-12 md:pl-16">
      {/* Main branch line */}
      <div className={`absolute left-5 md:left-6 top-0 bottom-0 w-0.5 ${lineColors[branchColor]} opacity-60`} />

      {items.map((item, index) => (
        <div
          key={item.id}
          className="relative mb-8 last:mb-0 opacity-0 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Commit node */}
          <div
            className={`absolute left-[-28px] md:left-[-40px] top-1 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 ${branchColors[branchColor]} bg-background transition-all duration-300 hover:scale-125 z-10`}
          />

          {/* Branch connector line */}
          <div
            className={`absolute left-[-12px] md:left-[-16px] top-[10px] md:top-[12px] w-4 md:w-6 h-0.5 ${lineColors[branchColor]} opacity-60`}
          />

          {/* Content card */}
          <div className="bg-card rounded-lg border border-border p-4 md:p-5 card-hover">
            {/* Date badge */}
            <span className="inline-block text-xs font-mono text-muted-foreground mb-2 bg-muted px-2 py-0.5 rounded">
              {item.date}
            </span>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {item.title}
            </h3>

            {/* Subtitle */}
            {item.subtitle && (
              <p className="text-sm text-primary font-medium mb-2">
                {item.subtitle}
              </p>
            )}

            {/* Description */}
            {item.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {item.description}
              </p>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map((tag) => (
                  <span key={tag} className="skill-tag text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Link */}
            {item.link && (
              <a
                href={item.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-mono"
              >
                {item.link.label} →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GitBranchTimeline;

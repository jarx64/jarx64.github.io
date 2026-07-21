import { motion } from "framer-motion";

interface ContentItem {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  link?: { url: string; label: string };
}

interface BranchContentProps {
  items: ContentItem[];
  branchColor: "feature" | "develop" | "hotfix" | "main";
}

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

const BranchContent = ({ items, branchColor }: BranchContentProps) => {
  const colors = branchColorClasses[branchColor];

  return (
    <div className="relative pl-3 md:pl-3">
      {/* Vertical line connecting commits */}


      {items.map((item, index) => (
        <div
          key={item.id}
          className="relative mb-6 last:mb-0 opacity-0 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Vertical line segment */}
          {index !== items.length - 1 && (
            <motion.div
              className={`absolute -left-[1.5rem] md:-left-[1.625rem] top-4 -bottom-10 w-2 ${colors.line} opacity-50`}
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

          {/* Content card */}
          <div className="bg-card rounded-lg border border-border p-4 card-hover">
            {/* Date badge */}
            <span className="inline-block text-xs font-mono text-muted-foreground mb-2 bg-muted px-2 py-0.5 rounded">
              {item.date}
            </span>

            {/* Title */}
            <h4 className="text-base font-semibold text-foreground mb-1">
              {item.title}
            </h4>

            {/* Subtitle */}
            {item.subtitle && (
              <p className="text-sm text-primary font-medium mb-2">
                {item.subtitle}
              </p>
            )}

            {/* Description */}
            {item.description && (
              <p className="text-base text-muted-foreground leading-relaxed mb-3">
                {item.description}
              </p>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                  >
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

export default BranchContent;

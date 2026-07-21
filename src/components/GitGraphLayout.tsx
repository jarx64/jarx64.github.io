import { Easing, motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface BranchSection {
  id: string;
  branchName: string;
  branchColor: "feature" | "develop" | "hotfix" | "main";
  content: ReactNode;
}

interface GitGraphLayoutProps {
  sections: BranchSection[];
}

const branchColorClasses = {
  main: {
    line: "bg-branch-main",
    node: "border-branch-main",
    nodeFill: "bg-branch-main",
    text: "text-branch-main",
  },
  feature: {
    line: "bg-branch-feature",
    node: "border-branch-feature",
    nodeFill: "bg-branch-feature",
    text: "text-branch-feature",
  },
  develop: {
    line: "bg-branch-develop",
    node: "border-branch-develop",
    nodeFill: "bg-branch-develop",
    text: "text-branch-develop",
  },
  hotfix: {
    line: "bg-branch-hotfix",
    node: "border-branch-hotfix",
    nodeFill: "bg-branch-hotfix",
    text: "text-branch-hotfix",
  },
};

const easeOut: Easing = [0.25, 0.46, 0.45, 0.94];
const easeInOut: Easing = [0.42, 0, 0.58, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const branchVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -50,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

const mergeNodeVariants: Variants = {
  hidden: { 
    scale: 0,
    opacity: 0,
  },
  visible: { 
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const pathVariants: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0,
  },
  visible: { 
    pathLength: 1,
    opacity: 0.8,
    transition: {
      duration: 0.8,
      ease: easeInOut,
    },
  },
};

const contentVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

const GitGraphLayout = ({ sections }: GitGraphLayoutProps) => {
  return (
    <motion.div 
      className="relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Main branch line - runs through entire layout */}
      <motion.div 
        className="absolute -left-1 md:left-9 top-8 bottom-0 w-2 bg-primary rounded-full"
        initial={{ scaleY: 0, originY: 0 }}
        whileInView={{ scaleY: 1, originY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 3, ease: "linear", delay: 0.8 }}
      />

      {/* Merge point at the top */}
      <motion.div 
        className="relative pl-4 md:pl-20"
        variants={branchVariants}
      >
        <motion.div 
          className="absolute -left-3 md:left-6 top-3 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/30 z-20 hover:scale-125"
          variants={mergeNodeVariants}
              whileHover={{ scale: 1.25 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
        />
        <div className="flex items-center gap-2 py-4">
          <span className="font-mono text-xs md:text-sm text-muted-foreground">
            main
          </span>
        </div>
      </motion.div>

      {/* Branch sections */}
      {sections.map((section, index) => {
        const colors = branchColorClasses[section.branchColor];
        const isLast = index === sections.length - 1;

        return (
          <motion.div 
            key={section.id}
            id={section.id}
            className="relative scroll-mt-28"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={branchVariants}
            custom={index}
          >
            {/* Merge commit on main line */}
            <motion.div
              className={`absolute -left-3 md:left-6 top-2 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-background ${colors.nodeFill} z-20`}
              variants={mergeNodeVariants}
              whileHover={{ scale: 1.25 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />

            {/* Branch content area */}
            <div className="relative ml-7 md:ml-24 pt-4 pb-12">
              {/* Branch label */}
              <motion.div 
                className="flex items-center gap-2 mb-6"
                variants={contentVariants}
              >
                <span
                  className={`font-mono -ml-2 md:ml-0 -mt-1 md:mt-0 text-sm font-semibold ${colors.text}`}
                >
                  {section.branchName}
                </span>
              </motion.div>

              {/* Curve connecting branch label to first item */}
              <svg
                className="absolute -left-[1.8rem] md:-left-[3.5rem] top-[1.3rem] md:top-[1.8rem] w-6 md:w-6 h-8 md:h-8 overflow-visible z-10 pointer-events-none"
                viewBox="0 0 24 32"
                fill="none"
              >
                <path
                  d="M 0 0 L 48 50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className={`hidden md:block opacity-50 ${branchColorClasses[section.branchColor].text}`}
                />
                <path
                  d="M 0 0 L 22 55"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className={`block md:hidden opacity-50 ${branchColorClasses[section.branchColor].text}`}
                />
              </svg>

              {/* Section content */}
              <motion.div 
                className="relative"
                variants={contentVariants}
              >
                {section.content}
              </motion.div>

              {/* Branch end / merge back indicator */}
              {!isLast && (
                <motion.svg
                  className="absolute -left-10 md:-left-12 -bottom-6 w-12 md:w-12 h-12 overflow-visible z-10"
                  viewBox="0 0 48 48"
                  fill="none"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.path
                    d={`M 44 4 Q 44 24, 24 24 L 4 24 Q 4 44, 4 44`}
                    stroke={`hsl(var(--branch-${section.branchColor}))`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.4 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  />
                </motion.svg>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default GitGraphLayout;
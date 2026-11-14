---
title: 'The 10x productivity with AI is a myth'
date: 2026-08-09T11:24:16+06:00
tags: ["ai", "productivity", "software-engineering", "hype"]
draft: false
description: "AI is not a magic bullet for software engineering productivity. The hype around 10x or 100x productivity gains is misleading and often performative."
cover:
    relative: false
    hidden: true
---

Every day, another post hits the timeline boasting about a 10x or 100x boost in software engineering productivity thanks to AI. Engineering managers celebrate it, team leads parrot it, and the hype cycle keeps spinning. 

Then you try it yourself. You feed the AI a prompt, and it generates code. You run it, and it runs.

The code fails edge cases, introduces subtle runtime bugs, misses crucial business logic, and looks nothing like how an experienced engineer would structure it. When you point this out to the believers, the response is always predictable: *"You’re just not using the right MCP/LOOPS/GRAPHS. You need to feed it 101 `skills.md` files."*

We have arrived at a bizarre cultural moment in tech: engineers are writing hundreds of lines of constraints, prompts, and context rules just to generate ten lines of mediocre code. We are doing everything imaginable to avoid coding-and in the process, doing more work than if we had just built it ourselves in the first place.

---

## The Illusion of the "Helpful" AI

When you first use AI outside your core domain, it feels like magic. If you are a backend engineer writing a quick shell script or setting up a basic CSS layout, the generated output looks great because you don't know enough to spot the subtle flaws. 

This is a modern variation of the Gell-Mann Amnesia effect:
1. **In your domain of expertise:** You see the AI's output for what it is-fragile, prone to runtime crashes, and ignorant of domain-specific constraints.
2. **Outside your domain:** You assume the AI is generating gold because you lack the depth to spot the anti-patterns.
3. **As your knowledge grows:** The illusion collapses. You realize the AI was giving mediocre answers all along because it lacks the mental map of context and edge cases that you carry in your head.

AI isn't magically better at other fields; you just haven't learned enough yet to see where it's failing.

---

## Performative Productivity: Pretending It Works

If the generated code is so unreliable in production, why is everyone boasting about massive efficiency gains?

For a while, it seemed like proponents simply weren't competent enough to spot the bugs. But the reality is often more systemic: **productivity has become performative.**

Engineers and leads quickly realize that claiming a "10x boost" pleases management and aligns with current executive expectations. To admit that generating, reviewing, tweaking, re-prompting, and fixing AI code takes just as long (or longer) than writing clean code manually sounds like pushing back against "progress." So, people pretend. They ship fragile code, fix the resulting bugs later, and claim victory on generation speed.

---

## The Blind Spot: How Do You Detect What You Don't Know?

This creates a dangerous loop: **How do you catch a flaw in generated code if you don't know the flaw exists?**

If a developer doesn't understand a paradigm, they can't effectively review the code AI generates for it. Instead, they feed the broken code back into the AI and ask, *"Is this correct?"*

The AI, designed to be agreeable and context-seeking, tells them exactly what they want to hear. The code gets stamped with approval, merged, and deployed-right up until it breaks in production under real load.

---

## Trained on Bad Code: The Quality Bottleneck

There is a fundamental issue with how these models operate. The web is full of incredible open-source architecture, well-documented frameworks, and brilliant engineering patterns. But it is equally packed with insecure scripts, outdated paradigms, and questionable code written years ago (including code many of us wrote when we were first starting out).

AI models train on all of it indiscriminately.

How does a probabilistic model decide between an elegant, maintainable pattern and a hacky workaround that happens to exist in thousands of public repositories? Without explicit, granular context for every micro-decision, the model defaults to the average of its training data. And the average of all code on the internet is not production-grade quality.


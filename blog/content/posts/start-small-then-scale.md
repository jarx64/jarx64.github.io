---
title: "Start Small, Measure Everything, Then Scale"
description: "Why early-stage products should begin with a VPS, a monolith, and boring infrastructure—not a cloud architecture diagram."
date: 2026-11-14
tags: ["architecture", "startups", "cloud", "monoliths", "engineering"]
---

Cloud providers are excellent. AWS, GCP, and Azure provide mature infrastructure, global reach, managed databases, queues, observability, identity products, and far more.

That is not an argument for adopting their entire catalog on day one.

For a small business, the first engineering objective is to deliver a useful product quickly, understand whether people want it, and keep operating costs predictable. A simple VPS, a monolith, and one database are often the correct starting point. Scale when production evidence requires it—not when an architecture diagram makes it look inevitable.

## Managed does not mean simple

Managed cloud services remove particular operational tasks. They do not remove ownership, architecture, or complexity.

Choosing managed services does not eliminate the need to understand:

- IAM policies, networking, secret management, backups, and disaster recovery.
- Service limits, billing models, observability, upgrades, and incident response.
- Cross-service failure modes, retries, timeouts, permissions, and data ownership.
- The skills needed to debug an outage at 2 AM.

A managed queue still needs message contracts, idempotency, dead-letter handling, and monitoring. A managed database still needs schema design, indexes, migrations, backups, and query analysis. A managed Kubernetes or container platform still needs deployment, networking, health checks, logs, and security decisions.

You may avoid hiring a dedicated infrastructure team initially. You do not avoid infrastructure work. You move it into application engineering and accept provider-specific constraints while doing it.

## Start with the smallest architecture that can safely deliver value

For many early products, this is enough:

- One VPS or single cloud VM.
- One deployable monolith.
- One relational database.
- One frontend application.
- Automated backups, HTTPS, logs, metrics, error tracking, and alerts.

This setup is not amateurish. It is intentionally low-complexity. It has fewer components to deploy, secure, monitor, version, and debug. It also makes local development and production failures easier to reason about.

The baseline should be boring, reproducible, and documented. Use containers if they improve deployment consistency. Use a reverse proxy, TLS, database backups, environment-based configuration, and a CI/CD pipeline. None of this requires a distributed architecture.

## Do not buy complexity before demand

Early-stage teams routinely adopt solutions for problems they do not yet have.

| You probably do not need yet | Start with |
| --- | --- |
| 30 microservices | A modular monolith with clear internal boundaries |
| ECS/Kubernetes auto-scaling | One correctly sized instance with resource monitoring |
| A load balancer | A simple reverse-proxy setup on one instance |
| Eventual consistency | One transactional relational database |
| Microfrontends | One frontend application and one design system |
| A managed identity vendor | Keycloak or another open-source identity solution, when self-hosting is appropriate |

This does not mean these tools are bad. They are valuable when the corresponding problem is real.

Microservices become reasonable when independently deployable components, separate scaling characteristics, clear team ownership, or reliability isolation justify their operational cost. Load balancers and autoscaling become reasonable when one instance is demonstrably insufficient. Eventual consistency becomes reasonable when synchronous transactions cannot support the required workflow or scale.

The keyword is **demonstrably**. Measure first.

## A monolith is a delivery strategy, not a design failure

A monolith does not mean an unstructured codebase. It should still have modules, explicit boundaries, tests, migrations, versioned APIs, and dependency rules.

The benefit is that all business logic is deployed and observed together. A feature can cross modules without introducing network calls, distributed tracing, service discovery, contract drift, and partial failure handling. Transactional consistency remains straightforward.

Design modules so that extraction remains possible later. Do not extract them simply because an online diagram says successful companies use microservices. Those companies generally earned that architecture after acquiring scale, teams, and operational demands that a new business does not have.

## Vendor lock-in is a business cost

Cloud lock-in is not automatically wrong. It can be a deliberate trade-off for speed. The mistake is pretending it is free or reversible.

Every provider-specific database, queue, identity system, function runtime, deployment format, and policy language increases migration cost. The more deeply those capabilities leak into application code, the harder the exit becomes.

Keep practical escape hatches:

- Prefer standard protocols and portable data formats.
- Keep database schema and migrations under your control.
- Wrap provider SDKs behind small application interfaces.
- Export backups and verify restoration.
- Document the dependencies that would be expensive to replace.
- Avoid integrating a managed service merely because it exists in the console.

This is not a demand to reject cloud platforms. A VPS can live at a cloud provider. It is a demand to make dependency choices intentionally, with their future cost visible.

## The practices you need from day one

Starting small must not mean operating blindly.

### Analytics and monitoring

You need to know what users do, where they abandon a flow, which requests fail, how long critical operations take, and when capacity is becoming constrained.

At minimum, collect:

- Product analytics for meaningful user journeys and conversion points.
- Structured application logs with request or trace identifiers.
- Error tracking with actionable context.
- Metrics for latency, error rate, throughput, CPU, memory, database health, and disk usage.
- Alerts for outages, sustained failures, backup failures, and resource exhaustion.

Without this evidence, “it is time to scale” is speculation. Monitoring tells you whether a single instance is actually struggling, whether the database is slow, and whether users are encountering failures before they report them.

### Generated frontend API clients

Do not hand-maintain every API request shape in the frontend. Generate typed clients from your API contract using tools such as NSwag or Orval. They reduce contract drift, remove repetitive code, and catch many mistakes during compilation instead of after deployment.

Client generation is part of a broader discipline: use types and contracts to reduce runtime uncertainty. See [Reduce Runtime Errors in Client-Side Rendering]({{< ref "/posts/api-client-gen-to-reduce-errors.md" >}}).

### APIs that follow proven conventions

If your product exposes an external API, learn from mature public APIs such as Stripe and Shopify. Their conventions around authentication, pagination, idempotency, errors, versioning, webhooks, and documentation exist because external integrations fail in predictable ways.

Do not copy an API blindly. Adopt the parts that make your API consistent, predictable, and safe for integrators. An external API is a long-term product commitment; inconsistent naming and undocumented edge cases become someone else’s production incident.

### LLMs as assistants, not architects of record

LLMs are useful for generating alternatives, explaining unfamiliar systems, reviewing drafts, and accelerating implementation. They are not a substitute for technical judgment.

An LLM can generate a plausible architecture with hidden security flaws, incorrect assumptions, unnecessary services, or code that fails under load. If you do not understand the category of flaw, you are unlikely to detect it merely by reading confident output.

Use LLM output as input to your decision-making process. Validate it against official documentation, tests, threat models, measurements, and engineers who understand the trade-offs. See [AI Hype]({{< ref "/posts/ai-productivity-myth.md" >}}).

## Scale from signals, not anxiety

Move from a VPS to cloud-native managed services when a measured constraint justifies it. Common signals include:

- Sustained CPU, memory, disk, or network pressure that vertical scaling cannot reasonably solve.
- A single instance becoming an availability risk the business can no longer accept.
- Database contention, storage, or recovery requirements exceeding the simple setup.
- Distinct workloads requiring independent deployment or scaling.
- Compliance, geographic, security, or availability requirements that demand managed capabilities.
- A team large enough that platform standardization reduces more cost than it creates.

Each migration should solve a specific, observed problem. State the problem, define the expected improvement, measure the result, and retain a rollback plan.

## The principle

Start with the simplest production-grade system that can serve customers safely. Keep it observable. Keep its boundaries clean. Keep data portable enough to preserve choices.

Then let user demand, production metrics, and business requirements tell you what to build next.

You do not need thirty microservices to validate a business. You do not need autoscaling before you have steady load. You do not need distributed consistency before a straightforward transactional database reaches its limits.

You need a product that works, a team that can ship it efficiently, and enough visibility to know exactly when simplicity stops being enough.

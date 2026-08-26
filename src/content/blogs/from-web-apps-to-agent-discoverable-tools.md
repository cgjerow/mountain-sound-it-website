---
title: From Web Apps to Agent-Discoverable Tools
description: The center of gravity for web developers is moving from screens and dashboards to tool surfaces agents can find, call, and compose—while user interfaces and reports are generated on demand.
pubDate: 2026-08-31
---

For twenty years, "web developer" meant building applications: login flows, navigation shells, Create, Read, Update, Delete (CRUD) screens, admin dashboards, report pages wired up in advance. That work is not vanishing, but it is no longer the default shape of the job.

The emerging default looks simpler: expose **agent-discoverable tools**, typed interfaces that agentic models can find and invoke. But in many ways it's harder to predict how end users will use those tools.

Then again, why do we need to try?

Roadmaps built on mockups, debates about how a search field should behave, and other clairvoyant product analysis lose footing when **ad-hoc user interfaces (UIs), reports, and workflows** are generated on request, not shipped as product features.

## Embracing "Chaos"

I remember a conversation with a colleague years ago about standardizing platform errors. Our system would not let application teams attach structured data to error responses. I was building a feature with multiple failure modes and client-side handling implications, and asked for a generic structured-data slot teams could use as needed.

He pushed back hard. "An unregulated error payload would be the *Wild West*—absolute chaos. No control over how teams use this structure."

I pointed out that teams were already encoding handling logic into string error messages, an obviously worse situation, but he was not swayed.

I still believe what I argued that day. But part of me wanted to reply: *Then let there be chaos.* Flexibility is software's most valuable trait. A little chaos surfaces pictures no one saw at **design time**—the phase where we spend hours, weeks, or (sadly) months on mockups, filter placement, error-state wireframes, and whether a search box should fuzzy-match or exact-match before a single user touches the thing.

So what does this have to do with AI and agent-driven software? It comes back to the same two words: **design time**.

What happens to design when every user can request a custom, real-time view of their system—and that chaos is the norm, not the exception? Not next year. Yesterday.

## UX: What Happens When Design Time is Real-Time

That question lands hardest on UX. Design time is where this profession lives, and as a dedicated position or practice it is still the new kid on the block. Design systems, dedicated UX orgs, and the Figma-to-engineering pipeline are mostly a post-2010 phenomenon. Of course, User-centric thinking is as old as software, but the direction that UX has evolved is less trodden and seemingly ripe for disruption.

Traditional apps ask users to navigate a map someone else drew—menu trees, dashboards, wizards, onboarding. Product and UX front-load every turn: which screens exist, which filters land on the report page, which affordances get permanent pixels. That was always a bottleneck. One opinion, frozen in the UI, workable for a subset of users and friction for others—because UX is at its core opinionated.

Agents invert that. The user states intent ("overdue invoices by region for Q2, grouped by rep, flag anything over 60 days"). The agent discovers tools, calls them, renders a one-off view—table, chart, email, portable document format (PDF)—without a `/reports/overdue-invoices` route or a wireframe for that filter combination.

```
User intent
    │
    ▼
Agent  →  discover tools  →  plan + call  →  compose result
    │         (Model Context Protocol (MCP), OpenAPI,
    │          function schemas)          (structured data +
    │                                       generated UI / report)
    ▼
Ephemeral surface (not a shipped page)
```

Most complex engineering concerns carry forward: authentication, data modeling, service boundaries, validation. Perhaps there is a new integration surface, but that is always to be expected. UX faces the sharper question: if the UI is generated per request, what happens to wireframing and testing *specific* screens?

Accessibility hits the same wall. Web Content Accessibility Guidelines (WCAG) assumed fixed screens you audit before ship; generated UI may never look the same twice. The counterweight: users can ask for the presentation they need in the moment—plain text instead of a chart, larger type, high contrast, a walkthrough instead of a dense table. That beats baking one org's accessibility opinion into permanent pixels, but only if tools return structured data and the agent renders real semantics—not div soup.

The durable artifact is not the React page or the Figma file. It is the **tool contract**: what the capability does, what the agent needs to work on behalf of the user. Pre-drawn navigation and static report pages were never going to fit every user anyway. Trust, error recovery, and inspectability matter more when the surface changes every session.

## Why tools beat pages

Most business software is not consumed for its UX. People open it to answer a question, change a record, or trigger a process. They tolerate the dashboards they use because the alternative is decentralized solutions like email and spreadsheets.

Agents change the economics:

- **Discovery over navigation.** Users describe outcomes while the agent navigates its available toolset to best serve that goal.
- **Composition over feature flags.** A report that took a sprint becomes a prompt that the end user requests from an agent directly, without engineering or any other team needing be involved or at all aware.
- **Fewer permanent screens.** Settings pages and export buttons shrink when the agent calls `list_accounts` or `generate_csv` and shows only what the moment needs.

UI becomes **generated, contextual, and disposable**—a rendering layer on tool output, not the product surface.

## What's Left to Build

Request payloads move behind tools—not behind pages.


| Old default                       | New default                                                 |
| --------------------------------- | ----------------------------------------------------------- |
| Page routes and layout components | Tool registries with schemas and auth scopes                |
| Form validation in the browser    | Input validation at the tool boundary                       |
| Dashboard widgets                 | Structured tool responses (`structuredContent`, typed JSON) |
| "Reports" as SQL + a template     | Query tools + agent-generated presentation                  |
| Onboarding tours                  | Tool descriptions written for models                        |
| Client-side state machines        | Idempotent, composable server capabilities                  |


You still need authentication, observability, rate limits, and (most importantly) **domain knowledge**! You focus more into the core application logic and models without the need to rebuild, retest, and redeploy new frontends each step of the way.

Deliverables:

1. **Read tools** — search, fetch, aggregate. Read-only; return data the agent can slice.
2. **Write tools** — create, update, approve. Narrow scopes, explicit confirmation, destructive hints where it matters.
3. **Meta tools** — resolve IDs, explain enums, fetch schema. Cut bad calls and guesswork.
4. **Presentation hints** — optional. Structured data first; let the agent pick chart vs table vs prose.

[Model Context Protocol (MCP) over Hypertext Transfer Protocol (HTTP) on Lambda](/blogs/running-mcp-over-http-on-aws-lambda) is one transport. OpenAPI function calling and vendor agent platforms are others. The transport varies, but the discoverable, documented API capability does not.

## Ad-hoc UI in production

Generated interfaces get dismissed as demos. Production needs constraints:

- **Ground UI in tool output.** Charts bind to structured fields the tools returned—not numbers the model invented.
- **Keep write paths explicit.** A generated form maps to a known write tool with the same validation the application programming interface (API) enforces.
- **Layout is cheap; trust is expensive.** A sortable table is easy. Row-level security lives in the tools, not the renderer.

Done well, ad-hoc UI is business intelligence (BI) without a BI backlog: the agent writes the report; you make the data callable and safe.

## One Caveat on UI

This doesn't even discuss the updates to the MCP protocol that allows tools to surface UI widgets (sometimes referred to as UI applications) through their tools.

It's hard to say where exactly those will fit in when real-time UIs are already so powerful, but it can certainly help move some of those tools that seem to require a well defined structured UI into the agent harness. And that move is happening fast.

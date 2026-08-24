---
title: From Web Apps to Agent-Discoverable Tools
description: The center of gravity for web developers is moving from screens and dashboards to tool surfaces agents can find, call, and compose—while user interfaces and reports are generated on demand.
pubDate: 2026-08-31
---

For twenty years, "web developer" meant building applications: login flows, navigation shells, Create, Read, Update, Delete (CRUD) screens, admin dashboards, report pages wired up in advance. That work is not vanishing, but it is no longer the default shape of the job.

The emerging default looks simpler—expose **agent-discoverable tools**, typed endpoints agentic models can find and invoke—but in many ways it's harder to predict how end users will use those tools.

Then again, why do we need to try?

Roadmaps built on mockups, debates about how a search field should behave, and other clairvoyant product analysis lose footing when **ad-hoc user interfaces (UIs), reports, and workflows** are generated on request, not shipped as product features.

## A shift to chaos

I remember a conversation I had with a colleague years ago about standardizing platform errors. Our system would not let application teams attach structured data to error responses. I was building a feature with multiple failure modes and client-side handling implications, and asked for a generic structured-data slot teams could reuse.

He pushed back hard. An unstructured error payload would be the *Wild West*—absolute chaos.

Teams were already encoding their handling logic into string error messages, I said—which seemed worse on every axis, but he was not to be swayed.

I still believe what I argued that day. But part of me wanted to reply: *Then let there be chaos.* Flexibility is software's most valuable trait. A little chaos surfaces pictures no one saw at **design time**—the phase where we spend hours, week, or (sadly) months on mockups, filter placement, error-state wireframes, and whether a search box should fuzzy-match or exact-match before a single user touches the thing.

So what does this have to do with AI and agent-driven software? Those two words: design time.

My question is what will design look like when the chaos of every user requesting a custom real-time generated view of their system becomes the norm...yesterday.

## User experience (UX): the discipline most exposed

Design time is where UX lives—and as a named profession, UX is the new kid on the block. Design systems, dedicated UX orgs, and the Figma-to-engineering pipeline are mostly a post-2010 story. User-centric thinking is as old as software; user interface and user experience (UI/UX) as a standalone practice, at macro scale, is still in its infancy.

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

Engineering mostly carries forward—auth, data modeling, service boundaries, validation—with a new interface. UX faces the sharper question: if the UI is generated per request, what happens to wireframing and testing *specific* screens?

Accessibility hits the same wall. Web Content Accessibility Guidelines (WCAG) assumed fixed screens you audit before ship; generated UI may never look the same twice. The counterweight: users can ask for the presentation they need in the moment—plain text instead of a chart, larger type, high contrast, a walkthrough instead of a dense table. That beats baking one org's accessibility opinion into permanent pixels, but only if tools return structured data and the agent renders real semantics—not div soup.

The durable artifact is not the React page or the Figma file. It is the **tool contract**: what the capability does, what the agent needs to work on behalf of the user. Pre-drawn navigation and static report pages were never going to fit every user anyway. Trust, error recovery, and inspectability matter more when the surface changes every session.

## Why tools beat pages

Most business software is not consumed for its UX. People open it to answer a question, change a record, or trigger a process. They tolerate mediocre dashboards because the alternative is email and spreadsheets.

Agents change the economics:

- **Discovery over navigation.** Users describe outcomes; tools with clear names, descriptions, and schemas are what the agent searches.
- **Composition over feature flags.** A report that took a sprint becomes a prompt plus three tool calls.
- **Fewer permanent screens.** Settings pages and export buttons shrink when the agent calls `list_accounts` or `generate_csv` and shows only what the moment needs.

UI becomes **generated, contextual, and disposable**—a rendering layer on tool output, not the product surface.

## What you build instead

Structured Query Language (SQL) reports and JavaScript Object Notation (JSON) payloads move behind tools—not behind pages.


| Old default                       | New default                                                 |
| --------------------------------- | ----------------------------------------------------------- |
| Page routes and layout components | Tool registries with schemas and auth scopes                |
| Form validation in the browser    | Input validation at the tool boundary                       |
| Dashboard widgets                 | Structured tool responses (`structuredContent`, typed JSON) |
| "Reports" as SQL + a template     | Query tools + agent-generated presentation                  |
| Onboarding tours                  | Tool descriptions written for models                        |
| Client-side state machines        | Idempotent, composable server capabilities                  |


You still need auth, observability, rate limits, and domain knowledge. You ship less of the long tail of screens that exist only because a human had to click through them.

Deliverables:

1. **Read tools** — search, fetch, aggregate. Read-only; return data the agent can slice.
2. **Write tools** — create, update, approve. Narrow scopes, explicit confirmation, destructive hints where it matters.
3. **Meta tools** — resolve IDs, explain enums, fetch schema. Cut bad calls and guesswork.
4. **Presentation hints** — optional. Structured data first; let the agent pick chart vs table vs prose.

[Model Context Protocol (MCP) over Hypertext Transfer Protocol (HTTP) on Lambda](/blogs/running-mcp-over-http-on-aws-lambda) is one transport. OpenAPI function calling and vendor agent platforms are others. The transport varies; the design unit—a discoverable, documented capability—does not.

## Ad-hoc UI in production

Generated interfaces get dismissed as demos. Production needs constraints:

- **Ground UI in tool output.** Charts bind to structured fields the tools returned—not numbers the model invented.
- **Keep write paths explicit.** A generated form maps to a known write tool with the same validation the application programming interface (API) enforces.
- **Prefer inspectable artifacts.** Users should see what was queried, replay it, or save the prompt.
- **Layout is cheap; trust is expensive.** A sortable table is easy. Row-level security lives in the tools, not the renderer.

Done well, ad-hoc UI is business intelligence (BI) without a BI backlog: the agent writes the report; you make the data callable and safe.

## What stays, what moves

Marketing sites, checkout, creative tools, games—anything where tactile UX *is* the product—still warrant intentional UI. Regulated customer flows too, though internal ops often moves to agents first.

The shift is many-to-most internal and business-to-business (B2B) software, not everything everywhere at once.

## If you are hiring or refactoring

- **Invest in tool quality** like you once invested in component libraries—descriptions, error messages, pagination, idempotency keys.
- **Collapse duplicate surfaces.** If a screen only exposes an API operation, expose the operation as a tool and drop the screen. Keep thin admin UI where human override is required.
- **Design auth for agents**—scoped tokens, per-tool identity and access management (IAM), audit logs—not just session cookies.
- **Measure differently.** Fewer page views can mean success. Track tool success rates, auth denials, repeated failed calls.
- **Change the product contract.** Acceptance criteria for capabilities ("list open tickets by assignee with service level agreement (SLA) breach flag"), not mockups for every filter combo.

Migration is incremental: inventory the questions your dashboards answer (each is a tool candidate), wrap existing services without forking logic, ship a small tool set to a trusted audience and fix what agents get wrong, retire screens only when logging is compliance-ready. Presentation comes last—stable IDs and structured responses before pretty charts.

## The output changes; the title might not

"We build web applications" becomes "we build capabilities agents and people can invoke." HyperText Markup Language (HTML) and Cascading Style Sheets (CSS) do not vanish—they are session outputs, not where product intent lives.

That is not less engineering. It is engineering for a different primary client: agents first, browsers when it still makes sense.
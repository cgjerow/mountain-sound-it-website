---
title: How to Describe Your Tools: Agent Onboarding
description: Writing tool descriptions is less like API documentation and more like onboarding a new hire — give them the context, constraints, and judgment rules they need to succeed.
pubDate: 2026-01-01
---

When a new person joins your team, you don't hand them a REST API spec and expect them to figure out what to do. You sit them down, walk them through the tools they'll use, explain the unwritten rules, and give them enough context to make good decisions.

The same is true for agentic models.

Tool descriptions are your agent's onboarding document. They're not API references — they're the thing you'd say on day one: "Here's what this does, here's when you'd use it, and here's what to watch out for."

## What a Tool Description Actually Is

A well-described tool tells an agent three things:

1. **What it does** — the capability, in plain language
2. **When to use it** — the triggers, conditions, and alternatives
3. **What to watch out for** — constraints, edge cases, error signals

Most tool schemas give you the first one, maybe. The rest is left to the model to infer — and inference is where things go wrong.

## The New Hire Analogy

Think about what you tell a new hire on their first week:

- "If the client asks about billing, use `lookup_invoice` — but only if they've already been authenticated."
- "Don't call `send_email` without checking the recipient list first; we had issues with duplicates last quarter."
- "If the data looks stale, try `refresh_data` before you try to query it."

These aren't in the API docs. They're judgment calls. And that's exactly what your tool descriptions should capture.

## Writing Descriptions That Actually Help

A tool description that helps an agent is one that answers the questions a competent but uninformed person would ask:

- What problem does this solve?
- What inputs does it need, and what do they mean?
- What does it return, and how should the result be interpreted?
- What are the common pitfalls or gotchas?
- What other tools should I consider before or after using this one?

When you write descriptions with this level of context, the agent doesn't just know *how* to call the tool — it knows *why* and *when*, and it can make better decisions about composition, fallbacks, and error handling.

## Practical Tips

- **Lead with intent.** "Finds overdue invoices by region" is better than "Returns a list of invoice objects matching filter criteria."
- **Include constraints.** "Only works for accounts in the same tenant" or "Returns at most 100 results — paginate if you need more."
- **Mention alternatives.** "Use `search_contacts` for free-text lookups; use `get_contact_by_id` when you already have the ID."
- **Describe the shape of the output.** "Returns an array of objects with `id`, `name`, and `status` fields — `status` is one of `active`, `inactive`, or `pending`."

## The Bigger Picture

Good tool descriptions don't just make agents more reliable — they surface gaps in your tooling. When you can't write a clear description, it's often a signal that the tool itself needs refinement.

And like onboarding a new hire, the effort you put into descriptions pays off repeatedly. Every agent call benefits from clear documentation. The investment compounds.

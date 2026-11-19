# Matt Pocock Skills

A collection of agent skills (slash commands and behaviors) loaded by Claude Code. Skills are organized into buckets and consumed by per-repo configuration emitted by `/setup-matt-pocock-skills`.

## Language

**Issue tracker**:
The tool that hosts a repo's issues: GitHub Issues, Linear, a local `.scratch/` markdown convention, or similar. Skills like `to-tickets`, `to-spec`, and `triage` read from and write to it.
_Avoid_: backlog manager, backlog backend, issue host

**Issue**:
A single tracked unit of work inside an **Issue tracker**: a bug, task, spec, or slice produced by `to-tickets`.
_Avoid_: ticket (use only when quoting external systems that call them tickets, or for a **Decision ticket**, see below)

**Decision ticket**:
A `wayfinder` unit: a child **Issue** of a `wayfinder:map` holding a _question_ whose resolution is a decision, not a slice of a build to execute. The **decision** qualifier is what keeps it distinct from an implementation ticket; `wayfinder` introduces the term, then uses "ticket".

**Triage role**:
A canonical state-machine label applied to an **Issue** during triage (e.g. `needs-triage`, `ready-for-afk`). Each role maps to a real label string in the **Issue tracker** via `docs/agents/triage-labels.md`.

**Design Intelligence Database**:
The offline collection of CSV datasets (`styles.csv`, `colors.csv`, `typography.csv`, `ux-guidelines.csv`, `stacks/`) and BM25 search scripts (`search.py`) vendored into `pro-max-design-system` from `nextlevelbuilder/ui-ux-pro-max-skill`.

**Verification tier**:
How much proof a change owes: `tier 1 (runtime-only)`, `tier 2 (regression)`, or `tier 3 (seam)`. It sets the **Test budget**.
_Avoid_: test level, verify mode

**Test budget**:
The maximum number of new unit or integration tests a **Verification tier** allows: 0, 1, or 1 to 3. **Journeys** do not count against it.

**Feature map**:
An app's directory of user-facing features (`e2e/features/`), one markdown file per feature. Each entry states how a user reaches the feature, how to drive it with Playwright, and what observable end state proves it works.

**Journey**:
A Playwright script (`e2e/<feature>.spec.ts`) that drives one **Feature map** entry through the real UI, asserts zero console and page errors, and captures screenshot proof in `e2e/.evidence/`. It is the only accepted proof that work is done.
_Avoid_: verification check, smoke test, e2e test

**Guardrail baseline**:
The shared ESLint rules in `skills/custom/setup-guardrails` copied into each app. Every rule's error message names the fix.

## Relationships

- An **Issue tracker** holds many **Issues**
- An **Issue** carries one **Triage role** at a time
- A **Decision ticket** is an **Issue** (a child of a `wayfinder:map`)
- Each **Feature map** entry has one **Journey**
- A ticket's `Verify:` line names one **Verification tier** and one **Journey**

## Flagged ambiguities

- "backlog" was previously used to mean both the _tool_ hosting issues and the _body of work_ inside it. Resolved: the tool is the **Issue tracker**; "backlog" is no longer used as a domain term.
- "backlog backend" / "backlog manager". Resolved: collapsed into **Issue tracker**.

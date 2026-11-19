---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

If the user passes a ticket reference, fetch it from the issue tracker and state its title before starting. If the reference is ambiguous, ask.

Call the Skill tool with "verification-tiers" to read the ticket's `Verify:` line (or confirm a 2-line verification plan with the user when no `Verify:` line exists).

For `tier 2 (regression)` and `tier 3 (seam)`, call the Skill tool with "tdd" using the ticket's `seam:` as pre-agreed, and stop once the tier's test budget is reached. For `tier 1 (runtime-only)`, skip `tdd`.

Run typechecking and lint regularly, single test files regularly, and the full test suite once at the end.

Call the Skill tool with "verify-web-app" to run the feature's Playwright Journey and capture screenshot proof in `e2e/.evidence/`.

Once done, call the Skill tool with "code-review" to review the work.

Commit your work to the current branch.

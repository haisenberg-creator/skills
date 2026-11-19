---
name: verification-tiers
description: Select a verification tier and enforce the test budget (0, 1, or 1 to 3 tests) plus a Playwright journey proof before writing tests or code. Use when fixing a bug, implementing a feature or UI change, planning tickets, or deciding what tests a change needs.
---

# Verification Tiers

Every change owes runtime proof, not an unbounded pile of unit tests. Separate **Tests** (unit and integration tests, capped by the **Test budget**) from **Journeys** (Playwright scripts that drive a **Feature map** entry in the real browser, updated in place and never counted against the test budget).

## The Three Tiers

Pick the lowest tier that proves the change works:

| Tier   | Label                   | When to use                                                                           | Test budget                                                                                                                                                                            | Runtime proof                                              |
| ------ | ----------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Tier 1 | `tier 1 (runtime-only)` | Visual, layout, copy, styling, or simple wiring with no branching domain logic        | **0 new tests**                                                                                                                                                                        | Typecheck + lint + existing tests + Playwright **Journey** |
| Tier 2 | `tier 2 (regression)`   | Bug fix in logic, state, API boundary, or edge case                                   | **1 failing regression test** at the public behavior seam (red before green), or **0** with the reason documented in the completion report when no testable seam can reproduce the bug | Typecheck + lint + existing tests + Playwright **Journey** |
| Tier 3 | `tier 3 (seam)`         | Feature with real branching logic, state machine, auth, data mutation, or calculation | **1 to 3 behavior tests** at the highest public seam                                                                                                                                   | Typecheck + lint + existing tests + Playwright **Journey** |

## The `Verify:` Line

Tickets and verification plans declare the contract on one line:

- **Tier 1:**
  `**Verify:** tier 1 (runtime-only) · journey: <feature> · proof: <observable end state>`
- **Tier 2 and Tier 3:**
  `**Verify:** tier <2|3> (<regression|seam>) · seam: <public interface under test> · journey: <feature> · proof: <observable end state>`

When a ticket declares `seam:`, treat that seam as pre-agreed with the user for `tdd`. Do not pause to re-confirm it.

## When No `Verify:` Line Exists

- **Interactive session** (direct user request or `/implement` without a ticket): before writing any test or production code, output a 2-line **Verification Plan** (the `Verify:` line plus one sentence on why that tier fits) and wait for the user's confirmation.
- **Unattended run** (`execute-tickets` or `implement-spec` on a ticket missing `Verify:`): pick the lowest tier that proves the ticket's acceptance criteria, record the chosen `Verify:` line in your completion report, and proceed without blocking.

## Hard Guardrails

- **Stop at the budget.** Once the tier's test budget (0, 1, or 1 to 3) is reached, write no more unit or integration tests. Never write tests per touched file.
- **Test behavior at the seam.** Assert observable outputs at the named public interface using independent expected values. Do not mock internal collaborators or write tautological assertions that mirror the implementation.
- **Every tier runs the Journey.** Unit tests never substitute for running the feature's Playwright **Journey** via `verify-web-app`.

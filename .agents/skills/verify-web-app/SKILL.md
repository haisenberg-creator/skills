---
name: verify-web-app
description: Prove a web app change works in a real browser by running or bootstrapping its Feature map and Playwright Journey (`e2e/features/` and `e2e/<feature>.spec.ts`), checking for zero console and page errors, and saving screenshot proof to `e2e/.evidence/`. Use after implementing any ticket or fix, or when setting up browser verification for a React, Vite, or Next.js app.
---

# Verify Web App

Prove user-facing behavior by driving the running app through Playwright and capturing evidence. Chrome DevTools MCP is welcome for interactive debugging and inspection, but **only a passing Playwright Journey counts as completion proof**.

## 1. Check for the Feature Map

Look for `e2e/features/README.md` in the target app.

- If it exists, go to **Step 3 (Run and Prove)**.
- If it does not exist, run **Step 2 (First-Run Bootstrap)** first.

## 2. First-Run Bootstrap

Interview the repo before asking the user:

1. **Inspect startup**: read `package.json`, `.env*`, and framework configs (`vite.config.*`, `next.config.*`) to identify the dev server command, port, and required seed/auth setup.
2. **Install Playwright**: if `@playwright/test` is not in `package.json`, install it as a devDependency and ensure Chromium is available (`npx playwright install chromium`).
3. **Configure Playwright**: create or update `playwright.config.ts` at the app root with:
   - `testDir: './e2e'`
   - `use.baseURL` set to the local dev URL
   - `webServer` set to the app's dev command, `url` set to the local dev URL, and `reuseExistingServer: !process.env.CI`
4. **Ignore evidence artifacts**: add `e2e/.evidence/` to `.gitignore`.
5. **Seed the Feature map**: create `e2e/features/README.md` indexing the app's top 3 to 5 user-facing features (discovered from routes, navigation, and pages), plus one `e2e/features/<feature>.md` file per feature. Every feature file uses these four H2 sections:
   - `## Sub-features`
   - `## How to get to it (user POV)`
   - `## Driving it with Playwright`
   - `## Gotchas`
6. **Add a context pointer**: add one line to the app's `AGENTS.md`:
   `Runtime verification: see e2e/features/README.md for the feature map and run npx playwright test e2e/<feature>.spec.ts to verify changes.`
7. **Prove the harness**: write and execute at least one Playwright **Journey** (`e2e/<feature>.spec.ts`) end to end, and confirm the screenshot exists in `e2e/.evidence/` after the run completes. A bootstrap that was never executed is a draft, not a deliverable.

## 3. Run and Prove

For the feature named in the ticket's `journey:` (or the affected feature in `e2e/features/`):

1. **Read the feature entry**: open `e2e/features/<feature>.md` to see the user flow, selectors, and gotchas.
2. **Update the Journey in place**:
   - Each feature map entry corresponds to one Journey file: `e2e/<feature>.spec.ts`.
   - Update `e2e/<feature>.spec.ts` (and `e2e/features/<feature>.md`) only when the change alters or adds to the observable user flow or `proof:`. For a `tier 1 (runtime-only)` change whose end-state proof is unchanged, run the existing Journey as-is.
3. **Enforce Proof Standards in the Journey**:
   - **Zero runtime errors**: attach listeners for `page.on('console', ...)` (collect `msg.type() === 'error'`) and `page.on('pageerror', ...)`, and assert both arrays are empty at the end of the test.
   - **Real user path**: drive the UI via stable handles (`getByRole`, `getByLabel`, `getByText`, `getByTestId`, and route URLs), never internal state setters.
   - **Action and resulting state**: assert the observable outcome required by `proof:` (DOM state, URL, persisted data after reload, or network response).
   - **Evidence capture**: save a screenshot of the verified end state to `e2e/.evidence/<feature>.png` using `await page.screenshot({ path: 'e2e/.evidence/<feature>.png', fullPage: true })`.
   - **Never weaken a Journey to pass**: if missing seed data or a broken precondition blocks the flow, record the cause under `## Gotchas` in `e2e/features/<feature>.md` and report the failure.
4. **Execute and verify**:
   - Run `npx playwright test e2e/<feature>.spec.ts`.
   - Confirm the test passes and `e2e/.evidence/<feature>.png` exists on disk.
   - Report the command run, the zero-error assertion status, and the `e2e/.evidence/<feature>.png` path.

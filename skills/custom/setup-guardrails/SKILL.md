---
name: setup-guardrails
description: Install the shared ESLint Guardrail baseline, Husky pre-commit hook (lint-staged + typecheck), and AGENTS.md rule table in a React, Vite, or Next.js TypeScript project. Use when setting up agent guardrails, adding lint rules with actionable fix messages, or wiring pre-commit checks.
---

# Setup Guardrails

Install mechanical guardrails that prevent recurring agent mistakes in React, Vite, and Next.js TypeScript projects. Every lint error message states the fix so an agent can self-correct from terminal output alone.

## Steps

### 1. Inspect the Target App

Check the app root for:

- Package manager (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`)
- ESLint configuration (`eslint.config.*` or legacy `.eslintrc.*`) and installed ESLint version
- TypeScript config (`tsconfig.json`) and existing `lint` / `typecheck` scripts in `package.json`

### 2. Install Required Dev Dependencies

Ensure these packages are installed as devDependencies:

- `eslint` and `typescript-eslint`
- `eslint-plugin-react-hooks`
- `@eslint-community/eslint-plugin-eslint-comments`
- `husky` and `lint-staged`

### 3. Append the Guardrail Baseline to ESLint

1. Copy [`eslint.guardrails.mjs`](./eslint.guardrails.mjs) from this skill folder into the target project root (or a config directory) and append `...guardrailConfigs` to the end of the project's `eslint.config.*` array so it layers on top of Vite or Next.js defaults without replacing them.
   - If the project uses legacy `.eslintrc.*` and cannot migrate to flat config immediately, port the same rules and `no-restricted-syntax` selectors into `.eslintrc.*` and add an `overrides` block for the non-hook `useEffect` restriction.
2. **Speed check for large repos**: run `npx eslint` on a single representative `.tsx` file and measure wall-clock time.
   - If linting staged files finishes in under 10 seconds, keep `parserOptions.projectService: true` enabled in pre-commit.
   - If type-aware linting exceeds 10 seconds on a large codebase, split `@typescript-eslint/no-floating-promises`, `@typescript-eslint/no-misused-promises`, and `projectService: true` into a separate `lint:types` script (wired to `pre-push` or CI) and keep pre-commit to the fast syntax rules.

### 4. Wire Pre-Commit Hook (Husky + lint-staged)

1. Ensure `package.json` defines:
   - `"typecheck": "tsc --noEmit"` (or the framework's typecheck command)
   - `"lint": "eslint --max-warnings 0"`
2. Configure `lint-staged` in `package.json` (or `.lintstagedrc`) to run `eslint --max-warnings 0` on staged `*.{ts,tsx}` files.
3. Initialize Husky (`npx husky init`) and set `.husky/pre-commit` to run both `npx lint-staged` and the project's `typecheck` script.

### 5. Add the Rule Table to `AGENTS.md`

Create or append this table to the app's `AGENTS.md` (and `CLAUDE.md` if separate) so every rule pairs with what enforces it:

```markdown
## Guardrails

| Rule                                                                                                                                                     | Enforced by                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| No explicit `any`                                                                                                                                        | ESLint `@typescript-eslint/no-explicit-any`                             |
| No `@ts-ignore` or `@ts-nocheck`; `@ts-expect-error` requires a 10+ char description                                                                     | ESLint `@typescript-eslint/ban-ts-comment`                              |
| No unawaited or misused promises                                                                                                                         | ESLint `@typescript-eslint/no-floating-promises`, `no-misused-promises` |
| Valid Hook calls and exhaustive dependencies                                                                                                             | ESLint `react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`      |
| No zero or tiny-delay (`<=50ms`) `setTimeout` workarounds; fix the ordering root cause                                                                   | ESLint `no-restricted-syntax`                                           |
| No direct `useEffect` in components; derive during render, use an event handler, or extract a `use*.ts(x)` hook                                          | ESLint `no-restricted-syntax`                                           |
| No blanket `eslint-disable` or disable without a description                                                                                             | ESLint `@eslint-community/eslint-comments/*`                            |
| No excuse comments explaining a hack or unencoded `do not remove` comments; fix the root cause or encode the constraint in types, a lint rule, or a test | `code-review` (Standards)                                               |
```

### 6. Prove the Guardrails Fire

Before reporting completion:

1. Introduce a temporary violation in a scratch or existing `.tsx` file (for example, a `setTimeout(() => {}, 0)` or a bare `useEffect` in a component) and run `npx eslint` on that file.
2. Confirm ESLint exits non-zero and prints the custom fix message.
3. Revert the temporary violation and confirm `npx eslint` on that file passes cleanly.

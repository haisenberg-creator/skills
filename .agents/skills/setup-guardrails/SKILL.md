---
name: setup-guardrails
description: Install the shared ESLint Guardrail baseline, Husky pre-commit hook (lint-staged + typecheck), and AGENTS.md rule table in a React, Vite, or Next.js TypeScript project. Use when setting up agent guardrails, adding lint rules with actionable fix messages, or wiring pre-commit checks.
---

# Setup Guardrails

Install mechanical guardrails that prevent recurring agent mistakes in React, Vite, and Next.js TypeScript projects. Every lint error message states the fix so an agent can self-correct from terminal output alone.

## Steps

### 1. Inspect the Target App

Check both the repo root and any frontend workspace folders (for example, `frontend/`, `apps/web/`) for:

- Package manager (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`)
- `package.json` and existing `lint` / `typecheck` scripts
- `tsconfig.json`
- ESLint configuration (`eslint.config.*` or legacy `.eslintrc.*`) and installed ESLint version
- Existing `.lintstagedrc*` files and `.husky/` hooks

### 2. Install Required Dev Dependencies

Ensure these packages are installed as devDependencies:

- `eslint` and `typescript-eslint`
- `eslint-plugin-react-hooks`
- `@eslint-community/eslint-plugin-eslint-comments`
- `husky` and `lint-staged`

### 3. Append the Guardrail Baseline to ESLint

1. Copy [`eslint.guardrails.mjs`](./eslint.guardrails.mjs) from this skill folder into the target project (or frontend workspace folder).
   - If no `eslint.config.*` exists, create `eslint.config.mjs` exporting `guardrailConfigs`; otherwise append `...guardrailConfigs` to the end of the existing `eslint.config.*` array so it layers on top of Vite or Next.js defaults without replacing them.
   - If the project uses legacy `.eslintrc.*` and cannot migrate to flat config immediately, port the same rules and `no-restricted-syntax` selectors into `.eslintrc.*` and add an `overrides` block for the non-hook `useEffect` restriction.
   - `guardrails/base` enables `allowDefaultProject` for `playwright.config.ts`, `playwright.config.mts`, and `e2e/*.ts` so Playwright files outside `tsconfig.json` still lint cleanly with `no-floating-promises`. If `e2e/` grows beyond 8 `.ts` files, or if another root `.ts` config file is outside `tsconfig.json`, add `e2e` to `tsconfig.json` (or `tsconfig.e2e.json`) instead of expanding `allowDefaultProject`.
2. **Speed check for large repos**: measure wall-clock time by running `npx eslint` on a single representative `.tsx` file (the size of a typical commit) rather than the full repo.
   - If linting a staged file finishes in under 10 seconds, keep `parserOptions.projectService` enabled in pre-commit.
   - If type-aware linting exceeds 10 seconds on a large codebase, split `@typescript-eslint/no-floating-promises`, `@typescript-eslint/no-misused-promises`, and `projectService` into a separate `lint:types` script (wired to `pre-push` or CI) and keep pre-commit to the fast syntax rules.

### 4. Wire Pre-Commit Hook (Husky + lint-staged)

1. Ensure `package.json` (in root or the frontend workspace) defines:
   - `"typecheck": "tsc --noEmit"` (or the framework's typecheck command)
   - `"lint": "eslint --max-warnings 0"`
2. Configure `lint-staged` in `package.json` or an existing `.lintstagedrc*` file (preserving existing entries rather than overwriting them):
   - Run `eslint --max-warnings 0` on staged `*.{ts,tsx}` files. Enforcing `eslint --max-warnings 0` on staged files via `lint-staged` in brownfield repos ensures pre-existing violations in untouched files do not block unrelated commits while every touched file must be clean.
   - When ESLint lives in a subfolder like `frontend/`, invoke it from root `.lintstagedrc*` via `npm --prefix frontend exec -- eslint --max-warnings 0` on `frontend/**/*.{ts,tsx}`, and exclude that glob from any catch-all `"*"` Prettier entry (`"!(frontend/**/*.{ts,tsx})"`) to prevent parallel file-write races.
3. Wire `.husky/pre-commit`:
   - If `.husky/pre-commit` already exists, preserve existing checks (`oxlint`, `lint:boundaries`, tests) and add `npx lint-staged` and the project's `typecheck` script instead of overwriting it with `npx husky init`.
   - Only run `npx husky init` when `.husky/` does not yet exist.

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

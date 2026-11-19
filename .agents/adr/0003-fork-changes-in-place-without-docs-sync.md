# Edit upstream skills in place with compact pointers and skip upstream docs sync for fork changes

This repository (`haisenberg-creator/skills`) is a personal fork of `mattpocock/skills` that regularly merges from `upstream/main` while adding custom skills under `skills/custom/` and `skills/design/` and adapting core workflow skills (`to-tickets`, `to-spec`, `implement`, `implement-spec`, `execute-tickets`, `grilling`, `code-review`, `retro`).

We needed to choose between creating wrapper skills around Matt's skills or editing Matt's skills in place, and whether fork-only changes must follow upstream's `CLAUDE.md` rule requiring synchronized updates to `docs/<bucket>/<skill-name>.md`, `README.md`, `.claude-plugin/plugin.json`, and `ask-matt`.

## Decision

1. **Substantial fork logic lives in `skills/custom/`** (such as `verification-tiers`, `verify-web-app`, and `setup-guardrails`).
2. **Upstream skills receive compact, surgical in-place edits** (a few lines calling the custom skills or adding a ticket template field) rather than wrapper skills, because orchestrators (`execute-tickets`, `implement-spec`) invoke `implement`, `tdd`, and `code-review` directly by name.
3. **Fork-only changes are exempt from upstream docs and manifest syncing**: skills in `skills/custom/` and `skills/design/`, and fork-only edits to skills in `engineering/` or `productivity/`, skip updating `docs/`, `README.md`, `.claude-plugin/plugin.json`, and `ask-matt`. This keeps the diff against `upstream/main` narrow and avoids merge conflicts across four extra files per tweak.

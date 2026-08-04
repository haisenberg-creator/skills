# 1. Vendor UI/UX Pro Max Design Intelligence Dataset and Search Engine

Date: 2026-08-04

## Status

Accepted

## Context

The `pro-max-design-system` skill previously relied purely on LLM prompt-level recommendations for Search/Auto Mode without access to curated UI/UX domain knowledge. Meanwhile, `nextlevelbuilder/ui-ux-pro-max-skill` provides a comprehensive offline dataset (50+ UI styles, 160+ color palettes, 50+ font pairings, stack guidelines) powered by a BM25 Python search engine.

We needed to decide whether to maintain custom datasets, rewrite search capabilities from scratch, or vendor the upstream dataset directly into `mp-skills`.

## Decision

We will vendor the dataset CSV files and Python search scripts from `nextlevelbuilder/ui-ux-pro-max-skill` directly into `skills/engineering/pro-max-design-system/`:

1. **Dataset Location**: `skills/engineering/pro-max-design-system/data/` (containing `styles.csv`, `colors.csv`, `typography.csv`, `ux-guidelines.csv`, `stacks/`).
2. **Search Engine**: `skills/engineering/pro-max-design-system/scripts/` (containing `search.py`, `core.py`, `design_system.py`).
3. **Execution**: Primary search uses `python3 scripts/search.py`, with native agent tool fallbacks (`grep_search` / `view_file`) on the CSV dataset when Python is not available.
4. **Maintenance**: Upstream updates will be synchronized using `scripts/sync-pro-max-dataset.ps1`.

## Consequences

- **Pros**:
  - `pro-max-design-system` gains rich, deterministic multi-domain design search.
  - Backwards compatibility with the existing 4-step Pro Max pipeline is preserved.
  - Easy dataset updates via the PowerShell sync script.
- **Cons**:
  - Adds ~1-2 MB of offline CSV database files and Python scripts to the repository repository footprint.

Quickstart:

```bash
npx skills add mattpocock/skills --skill=commit-and-push
```

```bash
npx skills update commit-and-push
```

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/commit-and-push)

## What it does

`commit-and-push` audits local changes, pulls the latest remote updates, composes a descriptive commit message with rationale and scope, and pushes to remote.

It ensures atomic, deliberate commits by filtering out sensitive files and temporary scratch artifacts before syncing clean state with the remote tracking branch.

## When to reach for it

Type `/commit-and-push`, or the agent reaches for it automatically when a task fits.

Reach for this when you want to package local changes into descriptive commits and publish your work to remote. If you are mid-merge or dealing with conflict markers, use [resolving-merge-conflicts](https://aihero.dev/skills-resolving-merge-conflicts) first.

## It's working if

- Local changes are audited and verified against credentials, secrets, or temporary files.
- Remote updates are fetched and pulled before staging.
- The commit message includes an imperative header and a body explaining why and what changed.
- The remote branch is up to date and `git status` reports a clean working tree.

## Where it fits

A reach-for-it-anytime standalone: invoke it whenever you finish a unit of work and want to safely publish commits to the remote repository. When you're unsure which skill fits, [ask-matt](https://aihero.dev/skills-ask-matt) routes you.

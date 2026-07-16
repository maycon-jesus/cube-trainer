---
name: commit-message
description: Generate a Conventional Commits message in English from the staged (or working-tree) changes. Use when the user asks to write/generate a commit message, or to commit their changes. Produces a `type(scope): subject` message in English following the Conventional Commits spec.
---

# Commit Message (Conventional Commits, English)

Generate a commit message in **English** following the [Conventional Commits](https://www.conventionalcommits.org/) spec, then (optionally) create the commit.

## Steps

1. **Inspect the changes.** Run in parallel:
   - `git status --short` — to see which files changed and whether anything is staged.
   - `git diff --staged` if there are staged changes; otherwise `git diff` for the working tree.
   - `git log --format='%s' -15` — to match the existing scope naming in this repo.
2. **Decide the scope of the commit.** Only describe what is actually in the diff. If staged changes exist, describe *those*; don't mix in unstaged files.
3. **Write the message** using the format below.
4. **Present the message to the user.** Do not commit unless the user asked you to commit (e.g. "commit", "commit isso"). If they only asked for a message, just output it. When you do commit, use the exact message you presented.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **type** (required) — one of:
  - `feat` — a new feature
  - `fix` — a bug fix
  - `docs` — documentation only
  - `style` — formatting, no code-behavior change
  - `refactor` — code change that neither fixes a bug nor adds a feature
  - `perf` — performance improvement
  - `test` — adding or fixing tests
  - `build` — build system or dependencies (e.g. `pnpm`, Vite, Nuxt config)
  - `ci` — CI configuration
  - `chore` — maintenance, no src/test change (e.g. version bump)
  - `revert` — reverts a previous commit
- **scope** (optional but preferred here) — a noun for the affected area. Reuse the scopes already in this repo when they fit: `cube`, `i18n`, `timer`, `stats`, `settings`, `db`, `pwa`, `theme`. Otherwise pick a short area name (a directory or feature). Omit if the change is truly global.
- **subject** (required) — imperative mood, lowercase first letter, no trailing period, ≤ ~72 chars. e.g. "add OLL algorithm training set", not "added" / "adds".
- **body** (optional) — include only when the *why* isn't obvious from the subject. Wrap at ~72 cols. Explain motivation and contrast with previous behavior, not the mechanics the diff already shows.
- **footer** (optional) — `BREAKING CHANGE: <description>` for breaking changes; `Refs #123` / `Closes #123` to reference issues.

## Rules

- **English only**, even though this repo's history is in Portuguese — the user explicitly wants English messages.
- One logical change per commit. If the diff spans unrelated concerns, say so and suggest splitting; don't paper over it with a vague subject.
- Breaking changes: add `!` after the type/scope (`feat(db)!: ...`) **and** a `BREAKING CHANGE:` footer.
- Keep it truthful to the diff — never describe changes that aren't there.

## Examples

```
feat(cube): add OLL algorithms and case images

fix(timer): reset hold phase when Space is released early

refactor(cube): simplify scramble generation and drop obsolete training sets

docs: document the i18n workflow in CLAUDE.md

build: bump version to 0.14.1

feat(db)!: change Solve schema to store penalty as enum

BREAKING CHANGE: existing solves must be migrated; `plus2` boolean
is replaced by a `penalty` field ('none' | '+2' | 'dnf').
```

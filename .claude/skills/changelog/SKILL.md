---
name: changelog
description: Generate release notes (changelog) for a version from the git commit history, formatted with .github/RELEASE_TEMPLATE.md and returned as markdown. Use when the user asks to generate a changelog, release notes, or "notas de versão" for a release/tag.
---

# Changelog / Release notes generator

Produce the GitHub release body for a version by mapping the commit history onto
[.github/RELEASE_TEMPLATE.md](../../../.github/RELEASE_TEMPLATE.md), and return it
to the user **as markdown** (do not create a GitHub release unless asked).

Follow the repo's own rules in [.github/RELEASING.md](../../../.github/RELEASING.md) —
the type/scope → section mapping and the "write for a user, not a diff reader" guidance
below come from there.

## Steps

1. **Read the template** at `.github/RELEASE_TEMPLATE.md` — it defines the exact
   sections, order, emoji and headings to emit. Never hardcode the sections here;
   read them fresh each run in case the template changed.

2. **Determine the version range.** Run in parallel:
   - `git tag --sort=-creatordate` — list existing release tags (`v<version>`).
   - `git describe --tags --abbrev=0` — the latest tag, if any.
   - The target version = `v` + `version` from `package.json` (read it).

   Pick the range:
   - If the user named a range (e.g. "since v0.16.0" or "v0.16.0..v0.17.0"), use it.
   - Else, from the **latest existing tag to `HEAD`**: `git log <latest-tag>..HEAD`.
   - If there are **no tags yet**, use the whole history: `git log` (all commits).
   State which range you used in your reply.

3. **Get the commits:**
   `git log <range> --no-merges --pretty=format:'%s%n%b---'`
   (subjects + bodies; `--no-merges` drops PR merge commits). Include bodies so you
   catch `BREAKING CHANGE:` footers.

4. **Map commits onto the template sections** using Conventional Commit type/scope:

   | Commit                          | Template section        |
   | ------------------------------- | ----------------------- |
   | `feat(cube):` / `fix(cube):`    | 🧩 Puzzles & algorithms |
   | other `feat:`                   | ✨ Features             |
   | other `fix:`                    | 🐛 Fixes                |
   | theme / UI / layout changes     | 🎨 Appearance           |
   | `feat(i18n):` / locale changes  | 🌐 Translations         |
   | `chore:` / `refactor:` / `build:` / `ci:` / `docs:` / `perf:` | 🧰 Internal |
   | `!` in type or `BREAKING CHANGE:` footer | ⚠️ Breaking changes |

5. **Write the notes** (this is the important part — not a mechanical dump):
   - One bullet **per user-visible change**, written for a user of the app, not a
     reader of the diff: "OLL cases are now trainable individually", not
     "add OLL I training cases to cubesDefinition".
   - **Collapse** many related commits into one bullet (twelve `feat(cube): add OLL … cases`
     commits → one line about OLL training).
   - **Skip** commits with no user-visible effect (unless worth flagging: dependency
     bumps, tooling, CI).
   - Notes are in **English**, matching the commit history.
   - Fill **Highlights** only for a release worth a summary (drop it for small patch
     releases — the template says so).

6. **Emit only the sections that have content.** Delete empty sections and all the
   HTML `<!-- comment -->` guidance from the template — empty sections must not ship.
   Keep the `---` rules and the final **Full changelog** line, filling the compare
   link with `<previous-tag>...<target-tag>` (use the real prev tag; if none, link
   the repo's commits page or note it's the first release).

7. **Return the finished markdown** in a fenced block so the user can copy it into
   the GitHub release body. Do not run `gh release` or push anything unless the user
   explicitly asks.

## Notes

- The compare URL base is `https://github.com/maycon-jesus/cube-trainer/compare/`.
- If `package.json` version still equals the latest tag, tell the user the version
  hasn't been bumped yet and generate against `HEAD` anyway (they may be previewing).

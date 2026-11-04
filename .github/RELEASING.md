# Releasing

## Tag convention

Tags are `v<version>`, matching `version` in `package.json` exactly — `v0.16.0`, not `0.16.0` or `release-0.16.0`. Tags are annotated, so `git push --follow-tags` pushes them.

Versioning follows [SemVer](https://semver.org/). The project is pre-1.0, so:

| Bump  | When                                                                              | Example          |
| ----- | --------------------------------------------------------------------------------- | ---------------- |
| minor | New features: training sets, puzzles, themes, pages                               | `0.16.0 → 0.17.0` |
| patch | Fixes, translations, internal work only                                           | `0.16.0 → 0.16.1` |
| major | Reserved for the 1.0 release                                                       | `0.x.y → 1.0.0`   |

Anything that breaks locally stored data (IndexedDB schema, backup file format) gets a **minor** bump while pre-1.0, but must be called out in the release notes — see the breaking-changes section of [RELEASE_TEMPLATE.md](RELEASE_TEMPLATE.md).

## Cutting a release

1. Make sure `main` is up to date and green: `pnpm install && pnpm lint && pnpm build`.
2. Bump the version with the release script. It bumps `package.json`, commits `chore: bump version to X`, and creates the annotated tag `vX`. It does not push, and it refuses to run on a dirty working tree, on a tag that already exists, or on a version that is not greater than the current one:

   ```bash
   pnpm release minor --dry-run   # preview: branch, version, commit message, tag
   pnpm release minor             # or: patch, major, or an explicit x.y.z
   ```

   Pass `--allow-dirty` only if you know the uncommitted changes must not be in the release commit.

3. Push the commit and the tag. The script prints this command at the end:

   ```bash
   git push origin main --follow-tags
   ```

4. Get the list of changes to write from the previous tag to the new one (replace the placeholders):

   ```bash
   git log <previous-tag>..<new-tag> --oneline --no-merges
   ```

   Commits follow [Conventional Commits](https://www.conventionalcommits.org/), so the type and scope map onto the template sections. This table is the single source of truth; the `changelog` skill points here instead of repeating it. Rows are checked top to bottom, and the first match wins:

   | Commit                                                        | Template section                |
   | ------------------------------------------------------------- | ------------------------------- |
   | `feat(cube):`, `fix(cube):`, `feat(patterns):`                | Puzzles, algorithms & patterns  |
   | `feat:`, `fix:` that add or change training cases, puzzles or patterns (e.g. `feat: 8 new f2l cases`) | Puzzles, algorithms & patterns |
   | `feat(i18n):`                                                 | Translations                    |
   | `feat(ui):`, `style:` (visual)                                | Appearance                      |
   | `feat:` (other)                                               | Features                        |
   | `fix:` (any other scope, e.g. `fix(vuetify):`)                | Fixes                           |
   | `chore:`, `refactor:`, `build:`, `ci:`, `docs:`, `perf:`      | Internal                        |
   | `!` in the type or a `BREAKING CHANGE:` footer                | Breaking changes                |

   A commit that matches none of the rows goes to Internal, and you should check it by hand. Commits without scope are fine: decide by what the user sees, not by the scope alone.

   To draft the notes, you can run the `changelog` skill (`.claude/skills/changelog`), which builds them from the same history and uses this template.

5. Check for breaking changes before writing the notes. The repo does not use `!` or `BREAKING CHANGE:` footers, so look at the diff between the two tags instead:
   - `version` in `app/stores/db/*.ts` (IndexedDB schema bumps)
   - `lib/db/database.ts` and `app/stores/migration.ts` (backup format and restore)

   If anything shows up there, fill in the **Breaking changes** section. A schema change is breaking for stored data even though it gets a minor bump.

6. Create the release from the tag, using the template body. Its first part is instructions, so extract only the content below the `---` line:

   ```bash
   sed -n '/^## Highlights/,$p' .github/RELEASE_TEMPLATE.md > /tmp/release-notes.md
   # edit /tmp/release-notes.md, then:
   gh release create v0.17.0 --verify-tag --title "v0.17.0" --notes-file /tmp/release-notes.md --draft
   ```

   `--verify-tag` makes `gh` fail if the tag is not on the remote, so push the tag (step 3) before this step. Or paste the body into the GitHub UI. Either way, fill it in, delete the unused sections, and remove the HTML comments before publishing.

7. Publish. Update the `Full changelog` compare link at the bottom to span the previous tag and this one.

## Writing the notes

- Write for a user of the app, not a reader of the diff: "OLL cases are now trainable individually", not "add OLL I training cases to cubesDefinition".
- One bullet per user-visible change. Several commits often collapse into one bullet — the twelve `feat(cube): add OLL … cases` commits are one line about OLL training, not twelve.
- Skip commits with no user-visible effect unless they're worth flagging (dependency bumps, tooling).
- Notes are written in English, matching the commit history.

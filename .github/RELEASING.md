# Releasing

## Tag convention

Tags are `v<version>`, matching `version` in `package.json` exactly — `v0.16.0`, not `0.16.0` or `release-0.16.0`.

Versioning follows [SemVer](https://semver.org/). The project is pre-1.0, so:

| Bump  | When                                                                              | Example          |
| ----- | --------------------------------------------------------------------------------- | ---------------- |
| minor | New features: training sets, puzzles, themes, pages                               | `0.16.0 → 0.17.0` |
| patch | Fixes, translations, internal work only                                           | `0.16.0 → 0.16.1` |
| major | Reserved for the 1.0 release                                                       | `0.x.y → 1.0.0`   |

Anything that breaks locally stored data (IndexedDB schema, backup file format) gets a **minor** bump while pre-1.0, but must be called out in the release notes — see the breaking-changes section of [RELEASE_TEMPLATE.md](RELEASE_TEMPLATE.md).

## Cutting a release

1. Make sure `main` is up to date and green: `pnpm install && pnpm lint && pnpm build`.
2. Bump `version` in `package.json` and commit it: `chore: bump version to 0.17.0`.
3. Tag the bump commit and push:

   ```bash
   git tag -a v0.17.0 -m "v0.17.0"
   git push origin main --follow-tags
   ```

4. Draft the release from the tag, using [RELEASE_TEMPLATE.md](RELEASE_TEMPLATE.md) as the body:

   ```bash
   gh release create v0.17.0 --title "v0.17.0" --notes-file .github/RELEASE_TEMPLATE.md --draft
   ```

   Or paste the template into the GitHub UI. Either way, fill it in and delete the unused sections before publishing.
5. Get the list of changes to write from:

   ```bash
   git log v0.16.0..v0.17.0 --oneline --no-merges
   ```

   Commits follow [Conventional Commits](https://www.conventionalcommits.org/), so the type and scope map onto the template sections: `feat:` → Features, `feat(cube):` → Puzzles & algorithms, `fix:` → Fixes, `feat(i18n):` → Translations, `chore:`/`refactor:` → Internal.
6. Publish. Update the `Full changelog` compare link at the bottom to span the previous tag and this one.

## Writing the notes

- Write for a user of the app, not a reader of the diff: "OLL cases are now trainable individually", not "add OLL I training cases to cubesDefinition".
- One bullet per user-visible change. Several commits often collapse into one bullet — the twelve `feat(cube): add OLL … cases` commits are one line about OLL training, not twelve.
- Skip commits with no user-visible effect unless they're worth flagging (dependency bumps, tooling).
- Notes are written in English, matching the commit history.

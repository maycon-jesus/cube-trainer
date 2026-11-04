<!--
  Copy everything below the line into the GitHub release body, then:
  - delete the sections you don't need (empty sections should not ship)
  - delete these HTML comments
  See RELEASING.md for the tag convention and the full process.
  The "## Highlights" heading is the start marker for the sed command in
  RELEASING.md (step 6), so keep its name.
-->

---

## Highlights

<!-- 1-3 sentences on what this release is about, for someone who won't read the list below. Drop this section for small patch releases. -->

## ✨ Features

<!-- New user-facing capabilities. Maps to `feat:` commits without puzzle or i18n content. -->

- ...

## 🧩 Puzzles, algorithms & patterns

<!-- New training sets/cases, scramble generators, cube engine moves, algorithm images, pattern pages. Maps to `feat(cube):`, `fix(cube):`, `feat(patterns):`, and to `feat:`/`fix:` commits that add or change training cases, puzzles or patterns (e.g. "feat: 8 new f2l cases"). Full mapping in RELEASING.md. -->

- ...

## 🐛 Fixes

<!-- Maps to `fix:` commits, whatever the scope (unless the fix is for puzzle content, see above). Describe the symptom the user saw, not the code that changed. -->

- ...

## 🎨 Appearance

<!-- New themes, layout and UI polish. Maps to `feat(ui):` and visual `style:` commits. -->

- ...

## 🌐 Translations

<!-- Maps to `feat(i18n):`. Say which locales got the change (en / pt / es / zh), e.g. "pt and es", or "en only, other locales fall back to en". -->

- ...

## 🧰 Internal

<!-- Refactors, dependency bumps, tooling, CI, docs, performance. Keep it short — most users skip this. -->

- ...

## ⚠️ Breaking changes

<!--
  Delete unless something actually breaks. This app stores everything in the
  browser (IndexedDB), so call out anything that touches saved data:
  schema changes, data migrations, backup files from older versions no longer
  importing. Tell the user what to do (e.g. "export a backup before updating").
  Schema changes get a minor bump while pre-1.0, but still belong here.
  Where to check: step 5 of RELEASING.md.
-->

- ...

---

**Full changelog**: https://github.com/maycon-jesus/cube-trainer/compare/vX.Y.Z...vA.B.C

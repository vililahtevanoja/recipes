# Agent Notes (personal-recipes)

This repo is a SvelteKit (Svelte 5) static site for browsing/searching a personal recipe collection and deploying it to GitHub Pages.

## Key Commands

- Install: `corepack enable && corepack install && pnpm install`
- Dev: `pnpm dev`
- Typecheck: `pnpm check`
- Lint: `pnpm lint`
- Tests: `pnpm test`
- Format: `pnpm format` (CI checks `pnpm format-check`)
- Build (GitHub Pages): `VITE_GH_PAGES=true pnpm build` (outputs to `build/`)

## Dev Environment

- Node: `24` (see `package.json` engines). CI uses Node 24.
- Package manager: pnpm via Corepack (see `package.json#packageManager`).
- Optional: Nix + direnv (`.envrc` uses `flake.nix`) provides Node and Corepack.

## Recipe Content (important)

Recipes live under `recipes/` and are discovered recursively at build/runtime by `src/lib/server/readRecipes.ts`.

- File type: Markdown (`.md`) with YAML frontmatter delimited by `---`.
- Filename convention: lowercase kebab-case (e.g. `light-and-fluffy-buttermilk-pancakes.md`).
- Required frontmatter keys (enforced via Zod in `src/lib/server/recipeModel.ts`):
  - `title: string`
  - `lang: fi | en`
  - `tags: "<comma-separated list>"` (stored as `string[]` after parsing)
- Optional keys:
  - `source: string`
  - `servings: string`
  - `nutrition:` object with `protein`, `carbs`, `fat` numbers (per 100g finished dish)
  - Any extra keys are allowed (Zod strips unknown keys by default).
- Slug/ID: derived from the filename _basename_ (not the directory). Keep basenames unique across the entire `recipes/` tree to avoid collisions (e.g. `recipes/a/pancakes.md` and `recipes/b/pancakes.md` would conflict).
- Some recipes might have multiple recipes within them, in this case there might be a mismatch between recipe heading and YAML font-matter. This is OK _if_ there are multiple recipes defined in the same markdown file. In these cases the included recipes should fall under the frontmatter category/domain. E.g. for a khachapuri recipe it is OK for there to be two khachapuri recipes within, but not OK for there to be a khachapuri recipe and a pizza recipe.

Tip: `ai/ai_prompt_en.txt` and `ai/ai_prompt_fi.txt` contain the preferred Markdown/frontmatter template for new recipes.

## Routing / GitHub Pages

- Pages build uses a base path when `VITE_GH_PAGES=true` (see `svelte.config.js`).
- In Svelte components, prefer `$app/paths` helpers (`resolve`, `asset`) over hard-coded absolute paths so links work both locally and on GitHub Pages.
- Static prerendering is enabled (`src/routes/+layout.ts`).

## Change Discipline

- Prefer small, focused diffs; do not add new dependencies or change build tooling without asking first.
- Keep the site static-friendly (no runtime server requirements beyond what prerender/build-time can do).
- After any file changes, run `pnpm format`.
- To use all available tool checks, run `pnpm verify`. It can be ran after any changes but at the latest run it when finished with a process involving file changes.

## Frontend code

- Prefer applying Tailwind CSS styling classes directly to html-elements, unless there are deduplication benefits
- Avoid @apply Tailwind CSS directive

# AGENTS.md

React Router 7 (framework mode, SSR enabled) + React 19 + TypeScript + Tailwind v4 + shadcn/ui (base-nova style). Admin app for "jualantar".

## Commands

- `npm run dev` — dev server (Vite via `react-router dev`)
- `npm run typecheck` — runs `react-router typegen && tsc`. **Always run this after adding/changing routes**; route types are generated into `.react-router/types` (gitignored).
- `npm run build` — production build; `npm run start` serves `./build/server/index.js`
- `npm run format` — Prettier (semi-less, double quotes, trailing commas es5, tailwind class sorting via `prettier-plugin-tailwindcss`)
- No lint script and no tests exist. Verification is `npm run typecheck` + `npm run build`.

## Architecture

- Routing is **code-defined**, not file-based: routes are registered in `app/routes.ts` (currently a single `index("routes/home.tsx")`). Add new route files there.
- Path alias: `~/*` → `./app/*` (configured in `vite.config.ts` + `tsconfig.json`).
- `app/app.css` is the global stylesheet: Tailwind v4 uses CSS-based config (`@theme inline` tokens, no `tailwind.config`). Default font is Plus Jakarta Sans (loaded via `@fontsource-variable`).

## UI conventions

- shadcn/ui components live in `app/components/ui`, aliased `~/components/ui`. Add new ones with `npx shadcn@latest add <name>` (writes into `app/components/ui`).
- This stack uses **Base UI** (`@base-ui/react`), not Radix. `cn` is re-exported from the `cn` npm package (`app/lib/utils.ts`).
- Reuse existing components (badge, card, table, dialog, toast, etc.) rather than hand-rolling markup. For design work, the UI/design skills under `.agents/skills/` are auto-loaded for UI tasks.

## Gotchas

- Package manager is **bun** (`bun.lock`). The `Dockerfile` is a stale template that references `package-lock.json` / `npm ci` — it does not match this repo, don't rely on it.
- `.react-router/` and `build/` are gitignored and generated; don't hand-edit generated type files.

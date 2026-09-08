# AGENTS.md

React Router 8 (framework mode, SSR enabled) + React 19 + TypeScript + Tailwind v4 + shadcn/ui (base-nova style). Admin app for "jualantar".

Arsitektur wajib mengikuti `docs/ARCHITECTURE.md` (feature/module-based): feature logic di `app/modules/<name>` (pages/routes/services/hooks/components + `index.ts` public API), shared layer global hanya untuk infra/UI generik tanpa business logic domain.

## Commands

- `npm run dev` — dev server (Vite via `react-router dev`)
- `npm run typecheck` — runs `react-router typegen && tsc`. **Always run this after adding/changing routes**; route types are generated into `.react-router/types` (gitignored).
- `npm run build` — production build; `npm run start` serves `./build/server/index.js`
- `npm run format` — Prettier (semi-less, double quotes, trailing commas es5, tailwind class sorting via `prettier-plugin-tailwindcss`)
- No lint script and no tests exist. Verification is `npm run typecheck` + `npm run build`.

## Architecture

- Routing is **code-defined**, not file-based: `app/routes.ts` is a thin registry that only mounts module routes (e.g. `index("modules/dashboard/routes/index.tsx")`). Nested/layout route files live inside each module's `routes/` folder.
- Feature code lives in `app/modules/<name>`: `pages/` (page components, named exports), `routes/` (thin route files, **default export** only), `services/` (API + TanStack Query), `components/`, `hooks/`. Public API via module `index.ts` — cross-module imports must go through it, never deep imports.
- Server state via **TanStack Query** (`QueryClientProvider` wired in `app/root.tsx`, per-render client from `app/lib/query-client.ts`). `loader`/`action` are not the default data pattern.
- **Single axios instance** in `app/lib/api.ts` (base URL from `VITE_API_BASE_URL`, default `/`). Modules must not create their own axios instances. Errors are normalized to `ApiError` via interceptor before being thrown.
- Path alias: `~/*` → `./app/*` (configured in `vite.config.ts` + `tsconfig.json`).
- `app/app.css` is the global stylesheet: Tailwind v4 uses CSS-based config (`@theme inline` tokens, no `tailwind.config`). Default font is Plus Jakarta Sans (loaded via `@fontsource-variable`).
- `app/stores/` is for **Zustand** global client/UI state only (e.g. sidebar, theme). Local state stays in module hooks; server state stays in TanStack Query.

## UI conventions

- shadcn/ui components live in `app/components/ui`, aliased `~/components/ui`. Add new ones with `npx shadcn@latest add <name>` (writes into `app/components/ui`).
- This stack uses **Base UI** (`@base-ui/react`), not Radix. `cn` is re-exported from the `cn` npm package (`app/lib/utils.ts`).
- Reuse existing components (badge, card, table, dialog, toast, etc.) rather than hand-rolling markup. For design work, the UI/design skills under `.agents/skills/` are auto-loaded for UI tasks.

## Gotchas

- Package manager is **bun** (`bun.lock`). The `Dockerfile` is a stale template that references `package-lock.json` / `npm ci` — it does not match this repo, don't rely on it.
- `.react-router/` and `build/` are gitignored and generated; don't hand-edit generated type files.

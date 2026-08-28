# Pizzeria Jogatina

Website for Pizzeria Jogatina, a wood-fired pizzeria in Baraki, Algiers —
a scroll-driven video hero, menu, table reservations, and a small admin
panel, built with TanStack Start and deployed to Cloudflare Workers.

**Live site:** https://jogatina-pizzeria.boutalebaymen2002.workers.dev

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React + SSR) on [Vite](https://vitejs.dev/)
- Tailwind CSS
- Cloudflare Workers + D1 (menu, reservations, site settings)
- [Bun](https://bun.sh/) for package management and scripts

## Getting started

```bash
cd app
bun install
bun run dev
```

D1-backed features (menu, reservations, admin login) only work against a
real deployed Worker — local `bun run dev` runs in plain Node and falls
back to sensible defaults for everything else.

## Deploy

```bash
cd app
bun run build
npx wrangler deploy
```

Run `npx wrangler login` once per machine first. The admin panel needs
two Cloudflare secrets set beforehand (`ADMIN_PASSWORD`,
`ADMIN_SESSION_SECRET`), via `npx wrangler secret put <NAME>`.

## Project layout

- `app/src/routes/index.tsx` — the public site (hero, menu, reservations, footer)
- `app/src/routes/admin.tsx` — password-gated admin panel (reservations, menu, contact number)
- `app/src/components/scroll-scrub/` — the scroll-driven video hero engine
- `app/migrations/` — D1 schema, applied with `wrangler d1 execute`

Ordering is WhatsApp/phone only — there is no online checkout, by design.

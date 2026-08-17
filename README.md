# Marketplace — Multi-Store E-Commerce Platform

A single Next.js app hosting several independent online stores. Each store has its own
products, orders, branding, and admin login — store admins can only see and manage their
own store's data — while all stores share one landing page and platform shell.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM + SQLite (`dev.db`)
- Auth.js / NextAuth v5 (credentials login, one admin per store)
- Zustand (client-side cart, persisted per store in `localStorage`)
- Stripe Checkout (test mode)

## Getting started

```bash
npm install
npx prisma migrate dev   # creates dev.db and applies the schema
npx prisma db seed       # seeds 3 demo stores, admins, and products
npm run dev
```

Open http://localhost:3000 — you'll see 3 demo stores: **Urban Threads**, **GreenLeaf
Grocer**, and **TechNest**. Admin login credentials for each store are written to
`SEED_CREDENTIALS.md` after seeding (also printed to the console).

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

- `AUTH_SECRET` — required for admin login sessions to work. Generate with:
  `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` — from your
  [Stripe test-mode dashboard](https://dashboard.stripe.com/test/apikeys). Without these,
  everything works except the final "pay" step of checkout.
- `STRIPE_WEBHOOK_SECRET` — run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
  locally with the [Stripe CLI](https://stripe.com/docs/stripe-cli) and use the secret it prints.

`DATABASE_URL` is already set in `.env` (SQLite, file-based, no setup needed).

## How the stores stay separate

Every store-owned table (`Product`, `Category`, `Order`, `OrderItem`, `AdminUser`) carries
a `storeId`, and every query — public and admin — filters by it. Admin sessions carry the
signed-in admin's `storeId`/`storeSlug`; `middleware.ts` and each `/admin/[storeSlug]/*`
layout both check that the URL's store matches the session's store, so one store's admin
can never view or edit another store's data.

## Project structure

- `/` — landing page listing all stores
- `/store/[storeSlug]` — storefront (home, product detail, cart, checkout)
- `/admin/login` — shared admin login
- `/admin/[storeSlug]/*` — per-store admin dashboard, product CRUD, order management
- `prisma/schema.prisma` — data model
- `prisma/seed.ts` — demo data generator

## Adding a new store

There's no UI for creating stores yet (this is a demo with 3 fixed stores). To add one,
extend the `stores` array in `prisma/seed.ts` and re-run `npx prisma db seed`, or insert
directly via `npx prisma studio`.

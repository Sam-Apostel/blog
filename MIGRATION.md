# Xata → Drizzle + Postgres (Railway) migration

The blog used to read from a Xata database (`controll-room`). That workspace was
deleted, which broke every page (the homepage queried `xata.db.project`). The data
layer has been moved to **Drizzle ORM** over a **Postgres** database, meant to run
on **Railway** next to the other services.

## What changed in code

- `globals/xata.ts` (generated Xata client) → **removed**.
- `globals/schema.ts` → **new** Drizzle schema for the two tables the blog uses
  (`blogpost`, `project`). The other Xata tables (`feed`, `mail`, `thread`,
  `contact`, `update`) belonged to other apps and were not part of the blog.
- `globals/db.ts` → now exports a Drizzle `db` (postgres-js driver) plus the
  `Blogpost` / `Project` row types.
- All query sites rewritten to Drizzle: `app/page.tsx`, `app/a/[slug]/page.tsx`,
  `app/p/[slug]/page.tsx`, `app/p/generateProjectMetadata.ts`, `app/rss.xml/route.tsx`.
- DB-backed routes are now `export const dynamic = 'force-dynamic'` and no longer use
  `generateStaticParams`, so `next build` does **not** need a reachable database
  (Railway's private DB host isn't reachable at build time). The MDX "dedicated"
  pages (`/a/communication-between-components`, `/p/polar-printer`) are unaffected.
- `.xatarc` / `XATA_*` env vars → replaced by `DATABASE_URL`.

## Remaining manual steps (need your input / Railway access)

1. **Provision Postgres on Railway** in the same project you want the blog in, or a
   new one. Copy its `DATABASE_URL`.
2. **Create the schema**: `DATABASE_URL=... npm run db:push` (or `db:generate` +
   `db:migrate` if you prefer tracked migrations).
3. **Seed** from your laptop exports: drop `blogpost.json` and `project.json` into
   `./seed/` and run `DATABASE_URL=... npm run db:seed`. Adjust field mapping in
   `scripts/seed.ts` if your export shape differs.
4. **Deploy the blog to Railway** from this repo and set `DATABASE_URL` as a service
   variable (reference the Postgres service so build + runtime both have it).
5. Point `sams.land` at the Railway service and remove the old Vercel project.

## Notes / things to double-check

- Dependency versions (`drizzle-orm`, `drizzle-kit`, `postgres`, `tsx`) are set to
  recent stable ranges; run an install and a `next build` to confirm.
- `published` is nullable; `published < now` excludes unpublished/draft rows exactly
  like the old Xata filter did.
- Projects are ordered by `updated_at` (was Xata's `xata.updatedAt`).

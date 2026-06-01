# sam.land

The informal blog & projects hub of Sam Apostel (`sams.land` / `sam.apostel.be`).
This is the casual counterpart to the formal portfolio at
[sams.works](https://sams.works), and the landing page that every one of my
projects links to from its footer.

## What it does

- **Three modes** — software, lifestyle, hardware. A visitor switches mode in the
  header and the _whole site re-themes_ (palette + typography). The choice is
  stored in a cookie so the server renders the right theme immediately.
- **Blog** — markdown posts with a built-in editor and live preview, OG images.
- **Reading list** — a dumping ground for useful articles.
- **Projects** — the things I build.
- **Releases** — an aggregated, live feed of what I'm shipping across all my
  projects. Projects report in via a shared [release-notes standard](docs/release-notes-standard.md).

## Stack

| Concern      | Tool                                       |
| ------------ | ------------------------------------------ |
| Framework    | TanStack Start (Vite, file-based routing)  |
| Database     | PostgreSQL + Drizzle ORM                   |
| Auth         | Better Auth (email/password, closed signup)|
| Styling      | Tailwind v4 + CSS-variable theme modes     |
| OG images    | Satori + resvg-wasm                        |
| Hosting      | Railway (Nitro `node-server` output)       |

## Local development

```sh
npm install
cp .env.example .env          # then fill in the values
npm run db:generate           # generate SQL from the Drizzle schema
npm run db:migrate            # apply migrations
npm run db:seed               # create the owner account + sample content
npm run dev                   # http://localhost:3000
```

The seed owner is controlled by `SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD`.
Sign-ups are closed in production; the seed temporarily enables them to create
the single owner account.

## Scripts

| Script             | Purpose                                  |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Dev server                               |
| `npm run build`    | Production build → `.output/`            |
| `npm run start`    | Run the built server                     |
| `npm run db:generate` | Generate migrations from the schema   |
| `npm run db:migrate`  | Apply migrations                      |
| `npm run db:push`     | Push schema directly (dev only)       |
| `npm run db:studio`   | Drizzle Studio                        |
| `npm run db:seed`     | Seed owner + sample data              |
| `npm run typecheck`   | `tsc --noEmit`                        |

## Deploying to Railway

1. Create a Railway project and add a **PostgreSQL** plugin.
2. Add this repo as a service. `railway.json` builds with `npm run build` and
   starts with `npm run db:migrate && npm run start`.
3. Set environment variables (see `.env.example`): `DATABASE_URL` (reference the
   Postgres plugin), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `PUBLIC_SITE_URL`,
   `RELEASES_INGEST_TOKEN`, and optionally GitHub OAuth.
4. Run the seed once (`npm run db:seed`) to create the owner account.

## Importing existing content

The old blog's posts and projects can be imported later from a database export
— the schema in `src/db/schema.ts` has `post`, `project`, `release` and
`reading_item` tables ready to receive them.

## Release-notes integration

Any project can report releases to `POST /api/releases` with a bearer token.
See [docs/release-notes-standard.md](docs/release-notes-standard.md) for the
contract and drop-in clients (curl, GitHub Actions, Node).

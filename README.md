# My blog

This is a place where I get to try out new stuff and rewrite the entire thing over and over.

Here's a quick overview for what I'm currently using:

|               | Tool                              |
| ------------- | :-------------------------------- |
| database      | Postgres (Railway) + Drizzle ORM  |
| styling       | scss modules, cva, wrap-balancer  |
| sharing / seo | satori, next-sitemap              |

## Database

Schema lives in `globals/schema.ts`, the client in `globals/db.ts`. Set `DATABASE_URL`
(see `.env.dist`). Common tasks:

```bash
npm run db:push     # sync schema to the database (quickest for a fresh DB)
npm run db:generate # generate SQL migrations from the schema
npm run db:migrate  # apply generated migrations
npm run db:seed     # seed from JSON exports in ./seed (see seed/README.md)
npm run db:studio   # browse the data
```

See `MIGRATION.md` for the full Xata → Drizzle/Railway migration notes.

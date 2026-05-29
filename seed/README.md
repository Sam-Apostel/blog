# Seed data

Drop your Xata exports here as `blogpost.json` and `project.json`, then run:

```bash
DATABASE_URL=... npm run db:seed
```

Each file may be either a JSON array of records or newline-delimited JSON
(the format Xata's `xata pull` / export produces). Records are matched on
their primary key, so re-running is safe (existing rows are skipped).

Expected fields:

- **blogpost.json**: `id`, `title`, `content`, `hook`, `slug`, `published`, `canonical`, `cover`, `keywords`
- **project.json**: `id`, `name`, `description`, `slug`, `url`, `content`, `published`, `showUrl`, `dedicatedPage`

The `*.json` files in this folder are gitignored so you don't commit a data dump.

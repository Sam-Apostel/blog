# Release Notes Standard

This is the contract every one of my projects follows to report its releases to
the blog, so that the [/releases](https://sam.land/releases) feed shows a live
view of everything I'm shipping.

A project announces a release by sending a single authenticated `POST` to the
blog's ingestion endpoint. The endpoint upserts the project (by `slug`) and the
release (by `slug` + `version`), so it is safe to call repeatedly — re-posting
the same version updates it in place rather than creating a duplicate.

## Endpoint

```
POST https://sam.land/api/releases
Authorization: Bearer <RELEASES_INGEST_TOKEN>
Content-Type: application/json
```

## Payload

```jsonc
{
  "project": {
    "slug": "my-project",        // kebab-case, stable identifier
    "name": "My Project",        // human readable name
    "url": "https://my-project.com",   // optional public URL
    "repo": "owner/my-project",        // optional source repo
    "mode": "software"                 // software | lifestyle | hardware
  },
  "release": {
    "version": "1.4.0",          // any version string (semver, date, ...)
    "title": "Faster cold starts",     // optional one-line summary
    "notes": "## What changed\n- ...", // markdown body
    "url": "https://.../releases/1.4.0", // optional link to the release
    "kind": "feature",                 // feature | fix | breaking | chore | security
    "releasedAt": "2026-06-01T12:00:00Z" // optional ISO date, defaults to now
  }
}
```

Only `project.slug`, `project.name`, and `release.version` are required.

## Responses

| Status | Meaning                                   |
| ------ | ----------------------------------------- |
| `201`  | Release stored (created or updated)       |
| `401`  | Missing or wrong bearer token             |
| `422`  | Payload failed validation (see `details`) |

## Drop-in clients

### Shell / CI (curl)

```sh
curl -fsS -X POST https://sam.land/api/releases \
  -H "Authorization: Bearer $RELEASES_INGEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project": { "slug": "my-project", "name": "My Project", "mode": "software" },
    "release": { "version": "'"$VERSION"'", "title": "'"$TITLE"'", "notes": "'"$NOTES"'", "kind": "feature" }
  }'
```

### GitHub Actions (on release published)

```yaml
name: Report release to sam.land
on:
  release:
    types: [published]
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -fsS -X POST https://sam.land/api/releases \
            -H "Authorization: Bearer ${{ secrets.RELEASES_INGEST_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d @- <<'JSON'
          {
            "project": { "slug": "my-project", "name": "My Project", "mode": "software", "repo": "${{ github.repository }}" },
            "release": {
              "version": "${{ github.event.release.tag_name }}",
              "title": "${{ github.event.release.name }}",
              "notes": ${{ toJSON(github.event.release.body) }},
              "url": "${{ github.event.release.html_url }}",
              "kind": "feature"
            }
          }
          JSON
```

### Node / TypeScript

```ts
export async function reportRelease(input: {
	version: string;
	title?: string;
	notes?: string;
	kind?: 'feature' | 'fix' | 'breaking' | 'chore' | 'security';
}) {
	await fetch('https://sam.land/api/releases', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.RELEASES_INGEST_TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			project: { slug: 'my-project', name: 'My Project', mode: 'software' },
			release: input,
		}),
	});
}
```

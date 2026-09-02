# Gopikrishnan — Portfolio

Next.js (App Router) portfolio, content-managed through Contentful, deployed on Vercel.

## Stack

- **Next.js 14** — server-rendered pages for real SEO (meta tags, sitemap, JSON-LD)
- **Framer Motion** — scroll-reveal and hero animations
- **Contentful** — the whole site (copy, skills, projects) is one `portfolio` entry, editable in Contentful; no redeploy needed to change content

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the Contentful values below
npm run dev
```

Without any Contentful env vars set, the site falls back to the previous hardcoded content (`lib/fallback-data.js`) so it always runs.

## Environment variables

Set these in Vercel (Project → Settings → Environment Variables) and locally in `.env.local`:

| Variable | Where to get it |
|---|---|
| `CONTENTFUL_SPACE_ID` | Contentful → Settings → General settings |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful → Settings → API keys → (an API key) → Content Delivery API - access token |
| `CONTENTFUL_ENVIRONMENT` | usually `master` |
| `CONTENTFUL_REVALIDATE_SECRET` | any random string you choose |
| `CONTENTFUL_MANAGEMENT_TOKEN` | only needed locally, to run `npm run seed` — Contentful → Settings → API keys → Content management tokens |

## One-time content seed

Creates the single `portfolio` content type and populates one entry (with `isDefault` checked) with the site's current copy, images, skills and projects:

```bash
npm run seed
```

Safe to re-run — it matches the existing entry (by site title) and updates it instead of duplicating.

## Keeping the live site in sync with Contentful (no redeploy)

The site uses ISR with on-demand revalidation. Content is cached for up to an hour automatically, but to make edits show up **immediately**:

1. In Contentful: **Settings → Webhooks → Add Webhook**
2. Name: `Revalidate Vercel site`
3. URL: `https://gopikrishnan.info/api/revalidate?secret=YOUR_CONTENTFUL_REVALIDATE_SECRET`
4. Method: `POST`
5. Triggers: select **Entry** → `Publish`, `Unpublish`, `Delete`
6. Save

Now publishing any change in Contentful hits that webhook, which busts the Next.js cache — the next page load (usually within seconds) shows the new content, with no code push or Vercel deploy involved.

## Editing content

Everything — the **About / hero** settings, the **Skills** list, and every **Project** card — lives on a single `Portfolio` entry, editable from Contentful's web app under Content. Skills and Projects are list fields on that entry; reorder items in the list to change display order, or add/remove entries directly.

If you keep more than one `Portfolio` entry (e.g. to draft an alternate version of the site), check **Is Default** on the one that should go live — the app renders whichever entry has it checked, falling back to the first entry if none is marked.

Each of the About, Skills, Projects (Work), and Contact sections has a matching **Show \* Section** boolean on the `Portfolio` entry — uncheck one to hide that section (and its nav link) without touching code. Left unset, a section renders as shown.

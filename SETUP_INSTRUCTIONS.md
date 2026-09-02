# Setup instructions (one-time)

You chose to handle git yourself, so here's exactly what to do with this zip.

## 1. Replace the project files

In your local clone of the `Resume` repo:

1. Delete these old Vite files (no longer used): `src/`, `index.html`, `vite.config.js`, `eslint.config.js`, `package-lock.json`
2. Extract this zip's contents into the repo root, replacing/adding everything (including the new `app/`, `components/`, `lib/`, `scripts/` folders, new `package.json`, `next.config.mjs`, etc.)
3. `.env.local` is included with your real Contentful keys already filled in — **do not commit it** (it's already in `.gitignore`, just double-check `git status` doesn't show it).

## 2. Install and seed Contentful

```bash
npm install
npm run seed
```

This creates a single `portfolio` content type in your Contentful space and fills one entry (marked as the default) with your current portfolio content + images (profile picture + all 6 project screenshots). Safe to re-run.

Afterwards, open Contentful → Content and confirm the entries look right. Feel free to edit any copy there right away.

## 3. Test locally (optional but recommended)

```bash
npm run dev
```

Open http://localhost:3000 — should look and animate the same as what I'll show you, and pull live from Contentful.

## 4. Commit and push

```bash
git add -A
git commit -m "Migrate to Next.js with Contentful CMS and redesigned UI"
git push
```

Vercel will auto-deploy from the push since it's already linked to this repo.

## 5. Add environment variables in Vercel

Vercel → your `resume` project → Settings → Environment Variables → add for **Production** (and Preview, if you want previews to also read Contentful):

| Key | Value |
|---|---|
| `CONTENTFUL_SPACE_ID` | `v3h21si7aw68` |
| `CONTENTFUL_ACCESS_TOKEN` | `nVZrwmZIbv4vGB6-hcYBpf3xHCVEMZfHnZMwLwIpc8U` |
| `CONTENTFUL_ENVIRONMENT` | `master` |
| `CONTENTFUL_REVALIDATE_SECRET` | `whisk-portfolio-hook-7f3ac1` (or make up your own — just keep it matching step 6) |

Then trigger a redeploy (Vercel → Deployments → ⋯ → Redeploy) so the new env vars take effect.

## 6. Set up the "no redeploy needed" webhook

In Contentful: **Settings → Webhooks → Add Webhook**

- Name: `Revalidate Vercel site`
- URL: `https://gopikrishnan.info/api/revalidate?secret=whisk-portfolio-hook-7f3ac1`
- Method: `POST`
- Triggers: **Entry** → check `Publish`, `Unpublish`, `Delete`
- Save

From now on, publishing any edit in Contentful (text, skills, adding/removing a project) shows up on the live site within seconds — no code change or redeploy required.

## 7. Make the repo private again

Once everything is deployed and working, flip the GitHub repo back to private in its Settings — Vercel's deployment keeps working either way.

---

Full reference docs are in `README.md`. If `npm run seed` errors on a specific entry, it's safe to just re-run it.

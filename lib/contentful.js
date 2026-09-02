import { createClient } from 'contentful';
import { cache } from 'react';
import { fallbackPortfolio } from './fallback-data';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

const isConfigured = Boolean(SPACE_ID && ACCESS_TOKEN);

let client = null;
function getClient() {
  if (!isConfigured) return null;
  if (!client) {
    client = createClient({
      space: SPACE_ID,
      accessToken: ACCESS_TOKEN,
      environment: ENVIRONMENT,
    });
  }
  return client;
}

function assetUrl(asset) {
  const url = asset?.fields?.file?.url;
  if (!url) return null;
  return url.startsWith('//') ? `https:${url}` : url;
}

// Projects live in their own "project" content type and are referenced from
// portfolio.projects as an array of entry links (array order = display
// order). Unresolved links (e.g. an unpublished project) come back without
// a `fields` object, so they're filtered out rather than rendered broken.
function mapProjects(projectEntries) {
  if (!projectEntries?.length) return null;
  const projects = projectEntries
    .filter((p) => p?.sys?.type === 'Entry' && p.fields)
    .map((p) => ({
      title: p.fields.title,
      imageUrl: assetUrl(p.fields.image),
      url: p.fields.url || '',
      description: p.fields.description,
      technologies: p.fields.technologies || [],
      points: p.fields.points || [],
    }));
  return projects.length ? projects : null;
}

// The whole site — settings, skills, projects — lives in one "portfolio"
// content type. When multiple entries exist (e.g. a draft/alternate version
// being worked on), the one with isDefault checked wins; otherwise the first
// entry found is used.
async function fetchPortfolioUncached() {
  const c = getClient();
  if (!c) return fallbackPortfolio;
  try {
    let entry;
    const defaultRes = await c.getEntries({
      content_type: 'portfolio',
      'fields.isDefault': true,
      limit: 1,
      include: 2,
    });
    entry = defaultRes.items[0];

    if (!entry) {
      const anyRes = await c.getEntries({ content_type: 'portfolio', limit: 1, include: 2 });
      entry = anyRes.items[0];
    }

    if (!entry) return fallbackPortfolio;
    const f = entry.fields;

    return {
      isDefault: Boolean(f.isDefault),
      siteTitle: f.siteTitle || fallbackPortfolio.siteTitle,
      metaDescription: f.metaDescription || fallbackPortfolio.metaDescription,
      ogImageUrl: assetUrl(f.ogImage) || fallbackPortfolio.ogImageUrl,
      name: f.name || fallbackPortfolio.name,
      role: f.role || fallbackPortfolio.role,
      phoneNo: f.phoneNo || fallbackPortfolio.phoneNo,
      email: f.email || fallbackPortfolio.email,
      linkedinUrl: f.linkedinUrl || fallbackPortfolio.linkedinUrl,
      cvUrl: assetUrl(f.cvFile) || fallbackPortfolio.cvUrl,
      profileImageUrl: assetUrl(f.profileImage) || fallbackPortfolio.profileImageUrl,
      summaryText: f.summaryText || fallbackPortfolio.summaryText,
      availabilityStatus: f.availabilityStatus || fallbackPortfolio.availabilityStatus,
      availabilityText: f.availabilityText || fallbackPortfolio.availabilityText,
      contactSubtitle: f.contactSubtitle || fallbackPortfolio.contactSubtitle,
      // Boolean fields come back `undefined` when left unset in Contentful —
      // treat that as "shown" so existing entries don't need every toggle set.
      showAbout: f.showAbout !== false,
      showSkills: f.showSkills !== false,
      showProjects: f.showProjects !== false,
      showContact: f.showContact !== false,
      skills: f.skills?.length ? f.skills : fallbackPortfolio.skills,
      projects: mapProjects(f.projects) || fallbackPortfolio.projects,
    };
  } catch (err) {
    console.error('[contentful] portfolio fetch failed, using fallback', err);
    return fallbackPortfolio;
  }
}

// The page is rendered dynamically (see `export const dynamic` in
// app/layout.jsx), so this runs on every request and always hits Contentful.
// `cache()` only dedupes the layout + page calls within a single request —
// it does not persist across requests, unlike the old unstable_cache setup.
export const getPortfolio = cache(fetchPortfolioUncached);

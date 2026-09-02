// One-time setup script: creates the Contentful content model (if missing)
// and seeds it with the current portfolio content + images, so the site
// has a real editable entry from day one.
//
// Usage:
//   CONTENTFUL_SPACE_ID=... CONTENTFUL_MANAGEMENT_TOKEN=... npm run seed
//
// Safe to re-run: the content type is created only if it doesn't already
// exist, and the entry is matched by siteTitle so re-running updates rather
// than duplicates it.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import contentfulManagement from 'contentful-management';
import { fallbackPortfolio } from '../lib/fallback-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Next.js auto-loads .env.local, but a plain node script doesn't — load it
// explicitly here (falling back to .env if that's what you used instead).
for (const file of ['.env.local', '.env']) {
  const p = path.join(ROOT, file);
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error(
    'Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN env vars. See README for setup steps.'
  );
  process.exit(1);
}

const client = contentfulManagement.createClient({ accessToken: MANAGEMENT_TOKEN });

async function getEnvironment() {
  const space = await client.getSpace(SPACE_ID);
  return space.getEnvironment(ENVIRONMENT_ID);
}

async function ensureContentType(env, id, definition) {
  try {
    const existing = await env.getContentType(id);
    console.log(`content type "${id}" already exists, skipping creation`);
    return existing;
  } catch (err) {
    if (err.name !== 'NotFound') throw err;
  }
  console.log(`creating content type "${id}"...`);
  let ct = await env.createContentTypeWithId(id, definition);
  ct = await ct.publish();
  return ct;
}

// Adds any of `fields` that don't already exist on a content type — purely
// additive and safe to re-run, unlike the projects reference migration
// above (existing fields are left untouched).
async function ensureFields(env, contentTypeId, fields) {
  let ct = await env.getContentType(contentTypeId);
  const existingIds = new Set(ct.fields.map((f) => f.id));
  const missing = fields.filter((f) => !existingIds.has(f.id));
  if (!missing.length) return ct;

  console.log(`adding field(s) ${missing.map((f) => f.id).join(', ')} to "${contentTypeId}"...`);
  ct.fields = [...ct.fields, ...missing];
  ct = await ct.update();
  return ct.publish();
}

// Sets the editor widget for a field (e.g. rendering a short-text field as
// a dropdown instead of a plain input). Safe to re-run.
async function ensureFieldControl(env, contentTypeId, fieldId, widgetId) {
  const ei = await env.getEditorInterfaceForContentType(contentTypeId);
  const control = ei.controls?.find((c) => c.fieldId === fieldId);
  if (control?.widgetId === widgetId) return;

  if (control) {
    control.widgetId = widgetId;
  } else {
    ei.controls = [...(ei.controls || []), { fieldId, widgetId }];
  }
  await ei.update();
}

async function uploadImageAsset(env, filePath, title) {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const contentType = ext === '.png' ? 'image/png' : ext === '.svg' ? 'image/svg+xml' : 'image/jpeg';

  console.log(`uploading asset ${fileName}...`);
  let asset = await env.createAssetFromFiles({
    fields: {
      title: { 'en-US': title },
      file: {
        'en-US': {
          contentType,
          fileName,
          file: fs.readFileSync(filePath),
        },
      },
    },
  });
  asset = await asset.processForAllLocales();
  asset = await asset.publish();
  return asset;
}

async function findEntryByField(env, contentTypeId, fieldId, value) {
  const res = await env.getEntries({
    content_type: contentTypeId,
    [`fields.${fieldId}`]: value,
    limit: 1,
  });
  return res.items[0] || null;
}

async function upsertEntry(env, contentTypeId, matchField, matchValue, fields) {
  // Drop any fields whose value is undefined (e.g. a missing asset link)
  // so they don't clobber existing data or break entry creation.
  const cleanFields = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== undefined)
  );

  let entry = await findEntryByField(env, contentTypeId, matchField, matchValue);
  if (entry) {
    console.log(`updating existing "${contentTypeId}" entry: ${matchValue}`);
    entry.fields = { ...entry.fields, ...cleanFields };
    entry = await entry.update();
  } else {
    console.log(`creating "${contentTypeId}" entry: ${matchValue}`);
    entry = await env.createEntry(contentTypeId, { fields: cleanFields });
  }
  return entry.publish();
}

function link(target, linkType = 'Asset') {
  return { sys: { type: 'Link', linkType, id: target.sys.id } };
}

// Lets the whole site switch between "actively looking" / "not actively
// looking" (or anything else) from Contentful alone: availabilityStatus
// and availabilityText drive the hero pill's color/label, contactSubtitle
// drives the matching line in the Contact section.
const AVAILABILITY_FIELDS = [
  {
    id: 'availabilityStatus',
    name: 'Availability Status',
    type: 'Symbol',
    required: false,
    validations: [{ in: ['green', 'yellow', 'red'] }],
  },
  { id: 'availabilityText', name: 'Availability Text', type: 'Symbol', required: false },
  { id: 'contactSubtitle', name: 'Contact Subtitle', type: 'Text', required: false },
];

// Per-section visibility toggles. Left unchecked/unset reads as "shown" (see
// the `!== false` checks in lib/contentful.js) so existing entries don't
// need to be touched for every section to keep rendering.
const SECTION_VISIBILITY_FIELDS = [
  { id: 'showAbout', name: 'Show About Section', type: 'Boolean', required: false },
  { id: 'showSkills', name: 'Show Skills Section', type: 'Boolean', required: false },
  { id: 'showProjects', name: 'Show Projects Section', type: 'Boolean', required: false },
  { id: 'showContact', name: 'Show Contact Section', type: 'Boolean', required: false },
];

// Contentful won't let a field's type change in place, so migrating
// `projects` from an inline Object to Entry references means: omit the old
// field, delete it, then add it back with the new type. Safe to re-run —
// skipped once the field is already an Array of Entry links.
async function migrateProjectsFieldToReferences(env) {
  let ct = await env.getContentType('portfolio');
  const existing = ct.fields.find((f) => f.id === 'projects');

  if (existing && existing.type === 'Array' && existing.items?.linkType === 'Entry') {
    return;
  }
  if (!existing) return;

  console.log('migrating portfolio.projects field from inline Object to Entry references...');

  ct.fields = ct.fields.map((f) => (f.id === 'projects' ? { ...f, omitted: true } : f));
  ct = await ct.update();
  ct = await ct.publish();

  ct.fields = ct.fields.filter((f) => f.id !== 'projects');
  ct = await ct.update();
  ct = await ct.publish();

  ct.fields = [
    ...ct.fields,
    {
      id: 'projects',
      name: 'Projects',
      type: 'Array',
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [{ linkContentType: ['project'] }],
      },
      required: false,
    },
  ];
  ct = await ct.update();
  await ct.publish();
}

async function run() {
  const env = await getEnvironment();

  // --- Content types -----------------------------------------------------
  // Projects are their own content type so each one can be authored and
  // published independently; portfolio.projects below just references them.
  await ensureContentType(env, 'project', {
    name: 'Project',
    description: 'A single portfolio project, referenced from the Portfolio content type.',
    displayField: 'title',
    fields: [
      { id: 'title', name: 'Title', type: 'Symbol', required: true },
      { id: 'image', name: 'Image', type: 'Link', linkType: 'Asset', required: false },
      { id: 'url', name: 'URL', type: 'Symbol', required: false },
      { id: 'description', name: 'Description', type: 'Text', required: true },
      {
        id: 'technologies',
        name: 'Technologies',
        type: 'Array',
        items: { type: 'Symbol' },
        required: false,
      },
      {
        id: 'points',
        name: 'Highlights',
        type: 'Array',
        items: { type: 'Symbol' },
        required: false,
      },
    ],
  });

  // Everything else the site renders — settings, skills — lives on one
  // "portfolio" entry. isDefault marks which entry is live when more than
  // one exists (e.g. while drafting an alternate version of the content).
  await ensureContentType(env, 'portfolio', {
    name: 'Portfolio',
    description: 'Single content model for site settings and skills; projects are referenced entries.',
    displayField: 'siteTitle',
    fields: [
      {
        id: 'isDefault',
        name: 'Is Default',
        type: 'Boolean',
        required: true,
      },
      { id: 'siteTitle', name: 'Site Title', type: 'Symbol', required: true },
      { id: 'metaDescription', name: 'Meta Description', type: 'Text', required: true },
      { id: 'ogImage', name: 'OG Image', type: 'Link', linkType: 'Asset', required: false },
      { id: 'name', name: 'Name', type: 'Symbol', required: true },
      { id: 'role', name: 'Role / Title', type: 'Symbol', required: true },
      { id: 'summaryText', name: 'Summary Text', type: 'Text', required: true },
      { id: 'profileImage', name: 'Profile Image', type: 'Link', linkType: 'Asset', required: false },
      { id: 'phoneNo', name: 'Phone Number', type: 'Symbol', required: false },
      { id: 'email', name: 'Email', type: 'Symbol', required: true },
      { id: 'linkedinUrl', name: 'LinkedIn URL', type: 'Symbol', required: false },
      // Legacy free-text URL field, superseded by cvFile below (an actual
      // upload beats linking out to an editable Canva draft). Left in place
      // as a fallback path for now.
      { id: 'cvUrl', name: 'CV URL', type: 'Symbol', required: false },
      { id: 'cvFile', name: 'CV File', type: 'Link', linkType: 'Asset', required: false },
      ...AVAILABILITY_FIELDS,
      ...SECTION_VISIBILITY_FIELDS,
      {
        id: 'skills',
        name: 'Skills',
        type: 'Array',
        items: { type: 'Symbol' },
        required: false,
      },
      // Array order is display order — no separate "order" field needed.
      {
        id: 'projects',
        name: 'Projects',
        type: 'Array',
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [{ linkContentType: ['project'] }],
        },
        required: false,
      },
    ],
  });

  // Safety net for a space that already has the old inline-Object field
  // from before projects were split into their own content type.
  await migrateProjectsFieldToReferences(env);

  // Safety net for a space created before the availability pill fields
  // existed — additive, so it's a no-op once they're present.
  await ensureFields(env, 'portfolio', AVAILABILITY_FIELDS);
  await ensureFieldControl(env, 'portfolio', 'availabilityStatus', 'dropdown');

  // Safety net for a space created before the CV was an upload.
  await ensureFields(env, 'portfolio', [
    { id: 'cvFile', name: 'CV File', type: 'Link', linkType: 'Asset', required: false },
  ]);

  // Safety net for a space created before per-section visibility toggles existed.
  await ensureFields(env, 'portfolio', SECTION_VISIBILITY_FIELDS);

  // --- Assets ----------------------------------------------------------
  const profileAsset = await uploadImageAsset(
    env,
    path.join(ROOT, 'public/images/profile_picture.jpg'),
    'Profile picture'
  );

  const projectImageFiles = {
    'VISION TRADING APP': 'vision_project.jpeg',
    'PROJECT MANAGEMENT TOOL': 'clickup_pms.png',
    'ORMA PROJECT': 'orma_app.png',
    'ENTERPRISE RESOURCE PLANNING (ERP) TOOL': 'erpv2_dashboard.png',
    "HERO'S SAVINGS VAULT": 'military_app.png',
    'PROPOSAL MANAGEMENT TOOL': 'proposal_portfolio_pms.png',
  };

  const projectAssets = {};
  for (const [title, fileName] of Object.entries(projectImageFiles)) {
    projectAssets[title] = await uploadImageAsset(
      env,
      path.join(ROOT, 'public/images/projects', fileName),
      title
    );
  }

  // --- Project entries ---------------------------------------------------
  // Each project becomes its own "project" entry (matched/updated by title,
  // same as the portfolio entry below), then linked from portfolio.projects
  // in the same order as fallbackPortfolio.projects.
  const projectEntries = [];
  for (const project of fallbackPortfolio.projects) {
    const asset = projectAssets[project.title];
    const projectEntry = await upsertEntry(env, 'project', 'title', project.title, {
      title: { 'en-US': project.title },
      image: asset ? { 'en-US': link(asset) } : undefined,
      url: { 'en-US': project.url || '' },
      description: { 'en-US': project.description },
      technologies: { 'en-US': project.technologies },
      points: { 'en-US': project.points },
    });
    projectEntries.push(projectEntry);
  }

  // --- Entry -------------------------------------------------------------
  await upsertEntry(env, 'portfolio', 'siteTitle', fallbackPortfolio.siteTitle, {
    isDefault: { 'en-US': true },
    siteTitle: { 'en-US': fallbackPortfolio.siteTitle },
    metaDescription: { 'en-US': fallbackPortfolio.metaDescription },
    ogImage: { 'en-US': link(profileAsset) },
    name: { 'en-US': fallbackPortfolio.name },
    role: { 'en-US': fallbackPortfolio.role },
    summaryText: { 'en-US': fallbackPortfolio.summaryText },
    availabilityStatus: { 'en-US': fallbackPortfolio.availabilityStatus },
    availabilityText: { 'en-US': fallbackPortfolio.availabilityText },
    contactSubtitle: { 'en-US': fallbackPortfolio.contactSubtitle },
    showAbout: { 'en-US': fallbackPortfolio.showAbout },
    showSkills: { 'en-US': fallbackPortfolio.showSkills },
    showProjects: { 'en-US': fallbackPortfolio.showProjects },
    showContact: { 'en-US': fallbackPortfolio.showContact },
    profileImage: { 'en-US': link(profileAsset) },
    phoneNo: { 'en-US': fallbackPortfolio.phoneNo },
    email: { 'en-US': fallbackPortfolio.email },
    linkedinUrl: { 'en-US': fallbackPortfolio.linkedinUrl },
    cvUrl: { 'en-US': fallbackPortfolio.cvUrl },
    skills: { 'en-US': fallbackPortfolio.skills },
    projects: { 'en-US': projectEntries.map((e) => link(e, 'Entry')) },
  });

  console.log('\nDone. Contentful is now seeded with your portfolio content.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

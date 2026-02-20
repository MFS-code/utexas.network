import fs from 'node:fs';
import path from 'node:path';

const issueBody = process.env.ISSUE_BODY || '';
const membersPath = path.resolve('src/data/members.ts');

const markerMatch = issueBody.match(/<!-- JOIN_REQUEST_DATA\s*([\s\S]*?)\s*-->/);
if (!markerMatch) {
  throw new Error('Could not find JOIN_REQUEST_DATA marker in issue body.');
}

const payload = JSON.parse(markerMatch[1]);
const isProject = payload.type === 'project';

const normalizeNameToken = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const toSlug = (name) => {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return '';
  return parts.map(normalizeNameToken).join('-');
};

const toMemberId = (fullName) => {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return '';
  if (parts.length === 1) return normalizeNameToken(parts[0]);
  return `${normalizeNameToken(parts[0])}-${normalizeNameToken(parts[parts.length - 1])}`;
};

const sanitizeUrl = (value) => String(value || '').trim();
const sanitizeText = (value) => String(value || '').trim();
const sanitizeAccentItem = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  const allowed = new Set(['default', 'red', 'yellow', 'white', 'black']);
  if (allowed.has(normalized)) return normalized;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(normalized)) return normalized;
  return '';
};

const file = fs.readFileSync(membersPath, 'utf8');

if (isProject) {
  const id = toSlug(payload.projectName);
  if (!id) throw new Error('Generated project id is empty.');

  if (new RegExp(`id:\\s*["']${id}["']`).test(file)) {
    throw new Error(`Project with id "${id}" already exists.`);
  }

  const memberIds = sanitizeText(payload.memberIds)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  const entryLines = [
    '  {',
    `    id: ${JSON.stringify(id)},`,
    `    name: ${JSON.stringify(sanitizeText(payload.projectName))},`,
    `    memberIds: ${JSON.stringify(memberIds)},`,
  ];

  if (sanitizeText(payload.description)) {
    entryLines.push(`    description: ${JSON.stringify(sanitizeText(payload.description))},`);
  }
  const accentItem = sanitizeAccentItem(payload.accentItem);
  if (accentItem) {
    entryLines.push(`    accentItem: ${JSON.stringify(accentItem)},`);
  }
  if (sanitizeUrl(payload.website)) {
    entryLines.push(`    website: ${JSON.stringify(sanitizeUrl(payload.website))},`);
  }
  if (sanitizeUrl(payload.profilePic)) {
    entryLines.push(`    profilePic: ${JSON.stringify(sanitizeUrl(payload.profilePic))},`);
  }
  if (sanitizeUrl(payload.instagram)) {
    entryLines.push(`    instagram: ${JSON.stringify(sanitizeUrl(payload.instagram))},`);
  }
  if (sanitizeUrl(payload.twitter)) {
    entryLines.push(`    twitter: ${JSON.stringify(sanitizeUrl(payload.twitter))},`);
  }
  if (sanitizeUrl(payload.linkedin)) {
    entryLines.push(`    linkedin: ${JSON.stringify(sanitizeUrl(payload.linkedin))},`);
  }
  if (sanitizeUrl(payload.github)) {
    entryLines.push(`    github: ${JSON.stringify(sanitizeUrl(payload.github))},`);
  }
  entryLines.push('  },');

  const entryBlock = `${entryLines.join('\n')}\n`;

  const projectsArrayMatch = file.match(/export const projects:\s*Project\[\]\s*=\s*\[/);
  if (!projectsArrayMatch || projectsArrayMatch.index == null) {
    throw new Error('Could not find projects array declaration.');
  }

  const projectsArrayStart = projectsArrayMatch.index + projectsArrayMatch[0].length;
  const projectsArrayTail = file.slice(projectsArrayStart);
  const projectsArrayCloseMatch = projectsArrayTail.match(/^\s*\];/m);
  if (!projectsArrayCloseMatch || projectsArrayCloseMatch.index == null) {
    throw new Error('Could not find projects array closing.');
  }

  const insertionPoint = projectsArrayStart + projectsArrayCloseMatch.index;

  const updated =
    file.slice(0, insertionPoint) +
    (file.slice(0, insertionPoint).endsWith('\n') ? '' : '\n') +
    entryBlock +
    file.slice(insertionPoint);

  fs.writeFileSync(membersPath, updated, 'utf8');
  console.log(`Added project "${id}" to src/data/members.ts`);
} else {
  const id = toMemberId(payload.fullName);
  if (!id) throw new Error('Generated member id is empty.');

  if (new RegExp(`id:\\s*["']${id}["']`).test(file)) {
    throw new Error(`Member with id "${id}" already exists.`);
  }

  const connections = sanitizeText(payload.connections)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  const entryLines = [
    '  {',
    `    id: ${JSON.stringify(id)},`,
    `    name: ${JSON.stringify(sanitizeText(payload.fullName))},`,
    `    website: ${JSON.stringify(sanitizeUrl(payload.website))},`,
    `    profilePic: ${JSON.stringify(sanitizeUrl(payload.profilePic))},`,
  ];

  if (sanitizeText(payload.program)) {
    entryLines.push(`    program: ${JSON.stringify(sanitizeText(payload.program))},`);
  }
  if (sanitizeText(payload.year)) {
    entryLines.push(`    year: ${JSON.stringify(sanitizeText(payload.year))},`);
  }
  if (sanitizeUrl(payload.instagram)) {
    entryLines.push(`    instagram: ${JSON.stringify(sanitizeUrl(payload.instagram))},`);
  }
  if (sanitizeUrl(payload.twitter)) {
    entryLines.push(`    twitter: ${JSON.stringify(sanitizeUrl(payload.twitter))},`);
  }
  if (sanitizeUrl(payload.linkedin)) {
    entryLines.push(`    linkedin: ${JSON.stringify(sanitizeUrl(payload.linkedin))},`);
  }
  entryLines.push(`    connections: ${JSON.stringify(connections)},`);
  entryLines.push('  },');

  const entryBlock = `${entryLines.join('\n')}\n`;

  const membersArrayMatch = file.match(/export const members:\s*Member\[\]\s*=\s*\[/);
  if (!membersArrayMatch || membersArrayMatch.index == null) {
    throw new Error('Could not find members array declaration.');
  }

  const membersArrayStart = membersArrayMatch.index + membersArrayMatch[0].length;
  const membersArrayTail = file.slice(membersArrayStart);
  const membersArrayCloseMatch = membersArrayTail.match(/^\s*\];/m);
  if (!membersArrayCloseMatch || membersArrayCloseMatch.index == null) {
    throw new Error('Could not find members array closing.');
  }

  const insertionPoint = membersArrayStart + membersArrayCloseMatch.index;

  const updated =
    file.slice(0, insertionPoint) +
    (file.slice(0, insertionPoint).endsWith('\n') ? '' : '\n') +
    entryBlock +
    file.slice(insertionPoint);

  fs.writeFileSync(membersPath, updated, 'utf8');
  console.log(`Added member "${id}" to src/data/members.ts`);
}

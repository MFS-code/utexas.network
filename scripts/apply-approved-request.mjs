import fs from 'node:fs';
import path from 'node:path';

const issueBody = process.env.ISSUE_BODY || '';
const membersPath = path.resolve('src/data/members.ts');

const markerMatch = issueBody.match(/<!-- JOIN_REQUEST_DATA\s*([\s\S]*?)\s*-->/);
if (!markerMatch) {
  throw new Error('Could not find JOIN_REQUEST_DATA marker in issue body.');
}

const payload = JSON.parse(markerMatch[1]);

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const sanitizeUrl = (value) => String(value || '').trim();
const sanitizeText = (value) => String(value || '').trim();

const id = slugify(payload.fullName);
if (!id) {
  throw new Error('Generated id is empty.');
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
if (sanitizeText(payload.instagram)) {
  entryLines.push(`    instagram: ${JSON.stringify(sanitizeUrl(payload.instagram))},`);
}
if (sanitizeText(payload.twitter)) {
  entryLines.push(`    twitter: ${JSON.stringify(sanitizeUrl(payload.twitter))},`);
}
if (sanitizeText(payload.linkedin)) {
  entryLines.push(`    linkedin: ${JSON.stringify(sanitizeUrl(payload.linkedin))},`);
}
entryLines.push(`    connections: ${JSON.stringify(connections)},`);
entryLines.push('  },');

const entryBlock = `${entryLines.join('\n')}\n`;

const file = fs.readFileSync(membersPath, 'utf8');

if (new RegExp(`id:\\s*["']${id}["']`).test(file)) {
  throw new Error(`Member with id "${id}" already exists.`);
}

const insertionPoint = file.lastIndexOf('];');
if (insertionPoint === -1) {
  throw new Error('Could not find members array closing.');
}

const updated =
  file.slice(0, insertionPoint) +
  (file.slice(0, insertionPoint).endsWith('\n') ? '' : '\n') +
  entryBlock +
  file.slice(insertionPoint);

fs.writeFileSync(membersPath, updated, 'utf8');
console.log(`Added member "${id}" to src/data/members.ts`);

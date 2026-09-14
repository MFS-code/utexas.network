const issueBody = process.env.ISSUE_BODY || '';
const markerMatch = issueBody.match(/<!-- JOIN_REQUEST_DATA\s*([\s\S]*?)\s*-->/);
if (!markerMatch) {
  process.exit(0);
}

let payload;
try {
  payload = JSON.parse(markerMatch[1]);
} catch {
  process.exit(0);
}

if (payload.type === 'project') {
  process.exit(0);
}

const githubUrl = String(payload.github || '').trim();
const loginMatch = githubUrl.match(
  /^https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)\/?$/i
);
if (!loginMatch) {
  process.exit(0);
}

const login = loginMatch[1];
const token = process.env.GITHUB_TOKEN || '';
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'utexas.network',
};
if (token) {
  headers.Authorization = `Bearer ${token}`;
}

const response = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, { headers });
if (!response.ok) {
  process.exit(0);
}

const user = await response.json();
if (!user?.id || !user?.login) {
  process.exit(0);
}

const name = String(payload.fullName || user.name || user.login).trim();
console.log(`Co-Authored-By: ${name} <${user.id}+${user.login}@users.noreply.github.com>`);

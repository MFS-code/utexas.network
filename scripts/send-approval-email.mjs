const issueBody = process.env.ISSUE_BODY || '';
const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const defaultSiteUrl = 'https://utexas.network';
const siteUrl = (process.env.SITE_URL || defaultSiteUrl).trim() || defaultSiteUrl;

const markerMatch = issueBody.match(/<!-- JOIN_REQUEST_DATA\s*([\s\S]*?)\s*-->/);
if (!markerMatch) {
  throw new Error('Could not find JOIN_REQUEST_DATA marker in issue body.');
}

if (!resendApiKey || !resendFromEmail) {
  throw new Error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL.');
}

const payload = JSON.parse(markerMatch[1]);
const fullName = String(payload.fullName || '').trim();
const utEmail = String(payload.utEmail || '').trim();

if (!utEmail) {
  throw new Error('Join request payload is missing utEmail.');
}

const normalizeNameToken = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const toMemberId = (name) => {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return '';
  if (parts.length === 1) return normalizeNameToken(parts[0]);
  return `${normalizeNameToken(parts[0])}-${normalizeNameToken(parts[parts.length - 1])}`;
};

const memberId = toMemberId(fullName);

const scriptSrc = `${siteUrl.replace(/\/+$/, '')}/embed.js`;
const subject = 'Welcome to utexas.network - you are in!';
const text = [
  `Hi ${fullName || 'there'},`,
  '',
  "You're officially in the utexas.network webring.",
  '',
  'Add this widget snippet to your site:',
  '',
  '<script',
  `  src="${scriptSrc}"`,
  '  data-webring',
  `  data-user="${memberId || 'your-id'}"`,
  '></script>',
  '',
  'Important: ',
  '- data-user is prefilled with your generated member id.',
  '- The center icon links to utexas.network.',
  '- The arrows navigate to your webring connections.',
  '',
  'Optional customization:',
  '- Add data-color="red"',
  '- Add data-arrow="chevron"',
  '',
  `Directory: ${siteUrl.replace(/\/+$/, '')}`,
  '',
  'If you have any questions, trouble with the setup, or just want to say hi, please contact me at miguelfserna@gmail.com or any of my socials (expect instagram) listed on the website.',
  '',
  'Welcome aboard,',
  'Miguel F. Serna',
].join('\n');

const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${resendApiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: resendFromEmail,
    to: [utEmail],
    subject,
    text,
  }),
});

if (!response.ok) {
  const errText = await response.text();
  throw new Error(`Failed to send approval email: ${errText}`);
}

console.log(`Sent approval email to ${utEmail}`);

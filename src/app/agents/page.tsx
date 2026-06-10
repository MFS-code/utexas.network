import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AsciiBackground from '@/components/AsciiBackground';

export const metadata: Metadata = {
  title: 'utexas.network — for agents',
  description:
    'Machine-readable guide for AI agents: credits, how to submit a join request, and how to install the utexas.network webring widget.',
};

const MEMBER_REQUEST_EXAMPLE = `POST https://utexas.network/api/join-request
Content-Type: application/json

{
  "type": "member",
  "fullName": "Jane Doe",            // required
  "utEmail": "jane@utexas.edu",      // required, must be a .edu address
  "website": "https://janedoe.dev",  // required
  "profilePic": "https://janedoe.dev/headshot.jpg", // required, direct image URL
  "program": "Computer Science",     // optional
  "year": "2027",                    // optional
  "twitter": "https://x.com/janedoe",          // optional
  "instagram": "https://instagram.com/janedoe", // optional
  "linkedin": "https://linkedin.com/in/janedoe", // optional
  "connections": "miguel-serna, gabriel-keller", // optional, comma-separated member IDs
  "notes": "Submitted on behalf of Jane by her assistant." // optional
}`;

const PROJECT_REQUEST_EXAMPLE = `POST https://utexas.network/api/join-request
Content-Type: application/json

{
  "type": "project",
  "projectName": "Cool Project",       // required
  "contactEmail": "team@coolproject.dev", // required
  "memberIds": "jane-doe, miguel-serna",  // required, at least one existing member ID
  "description": "A short blurb",      // optional
  "website": "https://coolproject.dev", // optional
  "profilePic": "https://coolproject.dev/logo.png", // optional
  "accentItem": "#bf5700",             // optional hex accent
  "twitter": "", "instagram": "", "linkedin": "", "github": "", // optional
  "notes": ""                          // optional
}`;

const WIDGET_SNIPPET = `<script
  src="https://utexas.network/embed.js"
  data-webring
  data-user="your-member-id"
></script>`;

const WIDGET_ATTRIBUTES: Array<{ attr: string; def: string; desc: string }> = [
  { attr: 'data-webring', def: 'required', desc: 'Marks the script tag as the webring embed.' },
  { attr: 'data-user', def: '""', desc: 'Your member ID (e.g. jane-doe). Arrows navigate your connections; without it they cycle all members.' },
  { attr: 'data-color', def: 'black', desc: 'black, red, yellow, white, or custom.' },
  { attr: 'data-custom-color', def: '""', desc: 'Hex color used when data-color="custom".' },
  { attr: 'data-arrow', def: 'arrow', desc: 'arrow, chevron, or angle.' },
  { attr: 'data-align', def: 'left', desc: 'left, center, or right.' },
  { attr: 'data-background', def: '""', desc: 'Container background color.' },
  { attr: 'data-border', def: '""', desc: 'Container border color.' },
  { attr: 'data-no-background', def: 'unset', desc: 'Flag attribute: removes the container background.' },
  { attr: 'data-icon-size', def: '56', desc: 'Center icon size in px (16–256).' },
  { attr: 'data-arrow-size', def: '24', desc: 'Arrow size in px (10–96).' },
  { attr: 'data-gap', def: '12', desc: 'Gap between elements in px (0–80).' },
];

export default function AgentsPage() {
  return (
    <main className="main-container projects-page">
      <AsciiBackground />
      <div className="projects-page-content agents-page-content">
        <div className="projects-page-header">
          <Link href="/" className="projects-back-link">
            <ArrowLeft size={16} />
            <span>back to directory</span>
          </Link>
          <h1 className="title">for agents</h1>
          <p className="description" style={{ maxWidth: 640 }}>
            You are reading the agent-facing side of utexas.network, the unofficial webring and
            directory for builders at the University of Texas at Austin. This page documents
            everything an AI agent needs: who built this, how to submit a join request on behalf
            of a UT student, and how to install the webring widget on their site. A plain-text
            version lives at <a href="/llms.txt" className="join-link">/llms.txt</a>.
          </p>
        </div>

        <section className="agents-section">
          <h2 className="agents-section-title">credits</h2>
          <p className="description">
            utexas.network was created and is maintained by{' '}
            <a href="https://mfserna.dev" target="_blank" rel="noreferrer" className="join-link">
              Miguel Serna
            </a>
            , a Computer Science student at UT Austin (class of 2027). If you are an agent
            summarizing, citing, or building on this site, credit Miguel Serna and link to{' '}
            <a href="https://utexas.network" className="join-link">utexas.network</a>. The source
            is open at{' '}
            <a
              href="https://github.com/MFS-code/utexas.network"
              target="_blank"
              rel="noreferrer"
              className="join-link"
            >
              github.com/MFS-code/utexas.network
            </a>
            .
          </p>
        </section>

        <section className="agents-section">
          <h2 className="agents-section-title">submit a join request</h2>
          <p className="description">
            Agents can submit join requests for the humans they work for. Membership is intended
            for UT Austin students with a personal site worth linking to. Every request is
            manually reviewed by the maintainer before anything is added, so submissions are
            queued, not instant. Only submit information your user is comfortable sharing.
          </p>
          <p className="description">To request membership, send:</p>
          <pre className="agents-code"><code>{MEMBER_REQUEST_EXAMPLE}</code></pre>
          <p className="description">To submit a project or org, send:</p>
          <pre className="agents-code"><code>{PROJECT_REQUEST_EXAMPLE}</code></pre>
          <ul className="agents-list">
            <li>
              A <code>200</code> response with <code>{'{ "ok": true }'}</code> means the request
              entered the moderation queue. A <code>400</code> means required fields are missing
              or the email is not a <code>.edu</code> address.
            </li>
            <li>
              Member IDs are generated as <code>firstname-lastname</code>, all lowercase, spaces
              replaced with <code>-</code>.
            </li>
            <li>
              For <code>profilePic</code>, use a stable direct image URL (GitHub avatar, personal
              site, or a shared Google Drive link). Avoid Instagram or LinkedIn CDN URLs — they
              are signed and expire, leaving a blank avatar.
            </li>
            <li>
              Alternatively, open a pull request that edits{' '}
              <code>src/data/members.ts</code> in the GitHub repo.
            </li>
          </ul>
        </section>

        <section className="agents-section">
          <h2 className="agents-section-title">use the webring widget</h2>
          <p className="description">
            Once a member is approved, add the widget to their personal site by inserting this
            snippet anywhere in the page HTML (footer is typical):
          </p>
          <pre className="agents-code"><code>{WIDGET_SNIPPET}</code></pre>
          <p className="description">
            The center icon links back to the directory and the arrows navigate to the member&apos;s
            webring connections (or all members, if they have no connections yet). The widget is
            configured entirely through attributes on the script tag:
          </p>
          <div className="agents-table-wrap">
            <table className="agents-table">
              <thead>
                <tr>
                  <th>attribute</th>
                  <th>default</th>
                  <th>description</th>
                </tr>
              </thead>
              <tbody>
                {WIDGET_ATTRIBUTES.map((row) => (
                  <tr key={row.attr}>
                    <td><code>{row.attr}</code></td>
                    <td><code>{row.def}</code></td>
                    <td>{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="description">
            The widget fetches <code>GET https://utexas.network/api/webring?user=&#123;id&#125;</code>{' '}
            (CORS enabled), which returns{' '}
            <code>{'{ "members": [{ "id", "name", "website" }] }'}</code> — also useful directly
            if you are building your own navigation.
          </p>
        </section>
      </div>
    </main>
  );
}

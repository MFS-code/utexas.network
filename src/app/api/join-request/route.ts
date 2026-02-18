import { NextResponse } from 'next/server';

interface JoinRequestPayload {
  fullName: string;
  utEmail: string;
  website: string;
  profilePic: string;
  program?: string;
  year?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  connections?: string;
  notes?: string;
}

const requiredFields: Array<keyof JoinRequestPayload> = [
  'fullName',
  'utEmail',
  'website',
  'profilePic',
];

function isValidPayload(payload: Partial<JoinRequestPayload>): payload is JoinRequestPayload {
  return requiredFields.every((field) => {
    const value = payload[field];
    return typeof value === 'string' && value.trim().length > 0;
  });
}

function escapeFence(input: string): string {
  return input.replace(/```/g, '\\`\\`\\`');
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<JoinRequestPayload>;

    if (!isValidPayload(payload)) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const token = process.env.GITHUB_JOIN_BOT_TOKEN;
    const owner = process.env.GITHUB_JOIN_REPO_OWNER;
    const repo = process.env.GITHUB_JOIN_REPO_NAME;

    if (!token || !owner || !repo) {
      return NextResponse.json(
        {
          error:
            'Join request backend not configured. Set GITHUB_JOIN_BOT_TOKEN, GITHUB_JOIN_REPO_OWNER, and GITHUB_JOIN_REPO_NAME.',
        },
        { status: 500 }
      );
    }

    const cleanPayload: JoinRequestPayload = {
      fullName: payload.fullName.trim(),
      utEmail: payload.utEmail.trim(),
      website: payload.website.trim(),
      profilePic: payload.profilePic.trim(),
      program: payload.program?.trim() || '',
      year: payload.year?.trim() || '',
      twitter: payload.twitter?.trim() || '',
      instagram: payload.instagram?.trim() || '',
      linkedin: payload.linkedin?.trim() || '',
      connections: payload.connections?.trim() || '',
      notes: payload.notes?.trim() || '',
    };

    const issueBody = [
      '## New utexas.network join request',
      '',
      `- **Name:** ${cleanPayload.fullName}`,
      `- **UT Email:** ${cleanPayload.utEmail}`,
      `- **Website:** ${cleanPayload.website}`,
      `- **Profile Photo:** ${cleanPayload.profilePic}`,
      `- **Program:** ${cleanPayload.program || '-'}`,
      `- **Year:** ${cleanPayload.year || '-'}`,
      `- **Twitter:** ${cleanPayload.twitter || '-'}`,
      `- **Instagram:** ${cleanPayload.instagram || '-'}`,
      `- **LinkedIn:** ${cleanPayload.linkedin || '-'}`,
      `- **Connections:** ${cleanPayload.connections || '-'}`,
      '',
      '### Moderator commands',
      '- Reply with `/approve` to add this member to `src/data/members.ts` automatically.',
      '- Reply with `/reject` to close without adding.',
      '',
      '### Notes',
      cleanPayload.notes || '-',
      '',
      '<!-- JOIN_REQUEST_DATA',
      escapeFence(JSON.stringify(cleanPayload)),
      '-->',
    ].join('\n');

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `[join-request] ${cleanPayload.fullName}`,
        body: issueBody,
        labels: ['join-request', 'pending'],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Failed to create moderation issue: ${errText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }
}

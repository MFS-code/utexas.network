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

const JOIN_ALERT_TO_EMAIL = 'miguelfserna@gmail.com';

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

async function sendJoinAlertEmail(payload: JoinRequestPayload, issueUrl?: string): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !resendFromEmail) {
    throw new Error('Email not configured: set RESEND_API_KEY and RESEND_FROM_EMAIL.');
  }

  const subject = `New utexas.network join request: ${payload.fullName}`;
  const lines = [
    'A new join request was submitted.',
    '',
    `Name: ${payload.fullName}`,
    `UT Email: ${payload.utEmail}`,
    `Website: ${payload.website}`,
    `Profile Photo: ${payload.profilePic}`,
    `Program: ${payload.program || '-'}`,
    `Year: ${payload.year || '-'}`,
    `Twitter: ${payload.twitter || '-'}`,
    `Instagram: ${payload.instagram || '-'}`,
    `LinkedIn: ${payload.linkedin || '-'}`,
    `Connections: ${payload.connections || '-'}`,
    `Notes: ${payload.notes || '-'}`,
    '',
    `Moderation Issue: ${issueUrl || '(not available)'}`,
  ];

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [JOIN_ALERT_TO_EMAIL],
      subject,
      text: lines.join('\n'),
    }),
  });

  if (!resendResponse.ok) {
    const errText = await resendResponse.text();
    throw new Error(`Failed to send join alert email: ${errText}`);
  }
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

    const issueData = (await response.json()) as { html_url?: string };

    try {
      await sendJoinAlertEmail(cleanPayload, issueData.html_url);
      return NextResponse.json({ ok: true, emailSent: true });
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : 'Unknown email delivery error.';
      console.error(message);
      return NextResponse.json({ ok: true, emailSent: false, emailError: message });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';

interface MemberPayload {
  type?: 'member';
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

interface ProjectPayload {
  type: 'project';
  projectName: string;
  contactEmail: string;
  memberIds: string;
  accentItem?: string;
  description?: string;
  website?: string;
  profilePic?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  notes?: string;
}

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_API_VERSION = '2022-11-28';
const GENERIC_SUBMISSION_ERROR = 'Unable to submit the request right now. Please try again shortly.';

function isEduEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.edu$/i.test(email.trim());
}

function isValidMemberPayload(p: Record<string, unknown>): boolean {
  const utEmail = typeof p.utEmail === 'string' ? p.utEmail.trim() : '';
  return (
    typeof p.fullName === 'string' && p.fullName.trim().length > 0 &&
    utEmail.length > 0 &&
    isEduEmail(utEmail) &&
    typeof p.website === 'string' && p.website.trim().length > 0 &&
    typeof p.profilePic === 'string' && p.profilePic.trim().length > 0
  );
}

function isValidProjectPayload(p: Record<string, unknown>): boolean {
  return (
    typeof p.projectName === 'string' && p.projectName.trim().length > 0 &&
    typeof p.contactEmail === 'string' && p.contactEmail.trim().length > 0 &&
    typeof p.memberIds === 'string' && p.memberIds.trim().length > 0
  );
}

function escapeFence(input: string): string {
  return input.replace(/```/g, '\\`\\`\\`');
}

async function sendAlertEmail(subject: string, lines: string[]): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;
  const joinAlertToEmail = process.env.JOIN_ALERT_TO_EMAIL?.trim();

  if (!resendApiKey || !resendFromEmail || !joinAlertToEmail) {
    throw new Error('Email not configured: set RESEND_API_KEY, RESEND_FROM_EMAIL, and JOIN_ALERT_TO_EMAIL.');
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [joinAlertToEmail],
      subject,
      text: lines.join('\n'),
    }),
  });

  if (!resendResponse.ok) {
    const errText = await resendResponse.text();
    throw new Error(`Failed to send alert email: ${errText}`);
  }
}

async function sendFallbackSubmissionEmail(
  issue: {
    body: string;
    alertSubject: string;
    alertLines: string[];
  },
  fallbackLines: string[],
): Promise<void> {
  await sendAlertEmail(
    `[fallback] ${issue.alertSubject}`,
    [
      ...fallbackLines,
      '',
      ...issue.alertLines,
      '',
      'Raw moderation issue payload:',
      issue.body,
    ],
  );
}

async function createModerationIssue(
  token: string,
  owner: string,
  repo: string,
  issue: { title: string; body: string; labels: string[]; }
): Promise<{ ok: true; htmlUrl?: string } | { ok: false; status: number; error: string }> {
  const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': GITHUB_API_VERSION,
    },
    body: JSON.stringify({
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
    }),
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: await response.text(),
    };
  }

  const issueData = (await response.json()) as { html_url?: string };
  return { ok: true, htmlUrl: issueData.html_url };
}

function buildMemberIssue(payload: MemberPayload) {
  const clean = {
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
    `- **Name:** ${clean.fullName}`,
    `- **UT Email:** ${clean.utEmail}`,
    `- **Website:** ${clean.website}`,
    `- **Profile Photo:** ${clean.profilePic}`,
    `- **Program:** ${clean.program || '-'}`,
    `- **Year:** ${clean.year || '-'}`,
    `- **Twitter:** ${clean.twitter || '-'}`,
    `- **Instagram:** ${clean.instagram || '-'}`,
    `- **LinkedIn:** ${clean.linkedin || '-'}`,
    `- **Connections:** ${clean.connections || '-'}`,
    '',
    '### Moderator commands',
    '- Reply with `/approve` to add this member to `src/data/members.ts` automatically.',
    '- Reply with `/reject` to close without adding.',
    '',
    '### Notes',
    clean.notes || '-',
    '',
    '<!-- JOIN_REQUEST_DATA',
    escapeFence(JSON.stringify(clean)),
    '-->',
  ].join('\n');

  return {
    title: `[join-request] ${clean.fullName}`,
    body: issueBody,
    labels: ['join-request', 'pending'],
    clean,
    alertSubject: `New utexas.network join request: ${clean.fullName}`,
    alertLines: [
      'A new join request was submitted.',
      '',
      `Name: ${clean.fullName}`,
      `UT Email: ${clean.utEmail}`,
      `Website: ${clean.website}`,
      `Profile Photo: ${clean.profilePic}`,
      `Program: ${clean.program || '-'}`,
      `Year: ${clean.year || '-'}`,
      `Twitter: ${clean.twitter || '-'}`,
      `Instagram: ${clean.instagram || '-'}`,
      `LinkedIn: ${clean.linkedin || '-'}`,
      `Connections: ${clean.connections || '-'}`,
      `Notes: ${clean.notes || '-'}`,
    ],
  };
}

function buildProjectIssue(payload: ProjectPayload) {
  const clean = {
    type: 'project' as const,
    projectName: payload.projectName.trim(),
    contactEmail: payload.contactEmail.trim(),
    memberIds: payload.memberIds.trim(),
    accentItem: payload.accentItem?.trim() || '',
    description: payload.description?.trim() || '',
    website: payload.website?.trim() || '',
    profilePic: payload.profilePic?.trim() || '',
    twitter: payload.twitter?.trim() || '',
    instagram: payload.instagram?.trim() || '',
    linkedin: payload.linkedin?.trim() || '',
    github: payload.github?.trim() || '',
    notes: payload.notes?.trim() || '',
  };

  const issueBody = [
    '## New utexas.network project / org request',
    '',
    `- **Project Name:** ${clean.projectName}`,
    `- **Contact Email:** ${clean.contactEmail}`,
    `- **Member IDs:** ${clean.memberIds}`,
    `- **Accent Item:** ${clean.accentItem || '(default)'}`,
    `- **Description:** ${clean.description || '-'}`,
    `- **Website:** ${clean.website || '-'}`,
    `- **Logo / Image:** ${clean.profilePic || '-'}`,
    `- **Twitter:** ${clean.twitter || '-'}`,
    `- **Instagram:** ${clean.instagram || '-'}`,
    `- **LinkedIn:** ${clean.linkedin || '-'}`,
    `- **GitHub:** ${clean.github || '-'}`,
    '',
    '### Moderator commands',
    '- Reply with `/approve` to add this project to `src/data/members.ts` automatically.',
    '- Reply with `/reject` to close without adding.',
    '',
    '### Notes',
    clean.notes || '-',
    '',
    '<!-- JOIN_REQUEST_DATA',
    escapeFence(JSON.stringify(clean)),
    '-->',
  ].join('\n');

  return {
    title: `[project-request] ${clean.projectName}`,
    body: issueBody,
    labels: ['project-request', 'pending'],
    clean,
    alertSubject: `New utexas.network project request: ${clean.projectName}`,
    alertLines: [
      'A new project / org request was submitted.',
      '',
      `Project: ${clean.projectName}`,
      `Contact: ${clean.contactEmail}`,
      `Members: ${clean.memberIds}`,
      `Accent Item: ${clean.accentItem || '(default)'}`,
      `Description: ${clean.description || '-'}`,
      `Website: ${clean.website || '-'}`,
      `Logo: ${clean.profilePic || '-'}`,
      `Twitter: ${clean.twitter || '-'}`,
      `Instagram: ${clean.instagram || '-'}`,
      `LinkedIn: ${clean.linkedin || '-'}`,
      `GitHub: ${clean.github || '-'}`,
      `Notes: ${clean.notes || '-'}`,
    ],
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const isProject = payload.type === 'project';

    if (isProject ? !isValidProjectPayload(payload) : !isValidMemberPayload(payload)) {
      return NextResponse.json({ error: 'Missing required fields or invalid .edu email.' }, { status: 400 });
    }

    const issue = isProject
      ? buildProjectIssue(payload as unknown as ProjectPayload)
      : buildMemberIssue(payload as unknown as MemberPayload);

    const token = process.env.GITHUB_JOIN_BOT_TOKEN?.trim();
    const owner = process.env.GITHUB_JOIN_REPO_OWNER?.trim();
    const repo = process.env.GITHUB_JOIN_REPO_NAME?.trim();

    if (!token || !owner || !repo) {
      try {
        await sendFallbackSubmissionEmail(issue, [
          'GitHub moderation is not configured, so this request needs manual review via email.',
          '',
          `GitHub token configured: ${token ? 'yes' : 'no'}`,
          `GitHub owner configured: ${owner ? 'yes' : 'no'}`,
          `GitHub repo configured: ${repo ? 'yes' : 'no'}`,
        ]);

        return NextResponse.json({
          ok: true,
          emailSent: true,
          fallback: 'email',
          message:
            'Request received. GitHub moderation is temporarily unavailable, so your submission was emailed to the moderators for manual review.',
        });
      } catch (emailError) {
        console.error(
          'Join request backend is not configured and fallback email delivery failed',
          emailError instanceof Error ? emailError.message : emailError,
        );

        return NextResponse.json(
          {
            error:
              'Join request backend not configured. Set GITHUB_JOIN_BOT_TOKEN, GITHUB_JOIN_REPO_OWNER, and GITHUB_JOIN_REPO_NAME.',
          },
          { status: 500 }
        );
      }
    }

    const githubResult = await createModerationIssue(token, owner, repo, issue);

    if (!githubResult.ok) {
      console.error('Failed to create moderation issue', {
        status: githubResult.status,
        owner,
        repo,
        error: githubResult.error,
      });

      try {
        await sendFallbackSubmissionEmail(issue, [
          'GitHub moderation issue creation failed, so this request needs manual review.',
          '',
          `GitHub status: ${githubResult.status}`,
          `GitHub error: ${githubResult.error}`,
        ]);

        return NextResponse.json({
          ok: true,
          emailSent: true,
          fallback: 'email',
          message:
            'Request received. GitHub moderation is temporarily unavailable, so your submission was emailed to the moderators for manual review.',
        });
      } catch (emailError) {
        console.error(
          'Fallback email delivery failed',
          emailError instanceof Error ? emailError.message : emailError,
        );

        return NextResponse.json(
          { error: GENERIC_SUBMISSION_ERROR },
          { status: 502 }
        );
      }
    }

    try {
      await sendAlertEmail(
        issue.alertSubject,
        [...issue.alertLines, '', `Moderation Issue: ${githubResult.htmlUrl || '(not available)'}`],
      );
      return NextResponse.json({
        ok: true,
        emailSent: true,
        message: 'Request sent. You will receive updates after a manual review.',
      });
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : 'Unknown email delivery error.';
      console.error(message);
      return NextResponse.json({
        ok: true,
        emailSent: false,
        emailError: message,
        message: 'Request sent. You will receive updates after a manual review.',
      });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }
}

# utexas.network

A webring for UT Austin students.

---

## Join the Webring (Moderated)

**Requirements:** UT Austin student + personal website

### 1. Submit the join form

Submissions are sent to `POST /api/join-request` (no redirect), which creates a GitHub issue for moderation.

Set these server env vars:

```bash
GITHUB_JOIN_BOT_TOKEN=replace-with-github-token
GITHUB_JOIN_REPO_OWNER=MFS-code
GITHUB_JOIN_REPO_NAME=utexas.network
NEXT_PUBLIC_BASE_URL=https://utexas.network
RESEND_API_KEY=replace-with-resend-api-key
RESEND_FROM_EMAIL=alerts@your-domain.com
```

Join submissions also send an email alert to `miguelfserna@gmail.com`.  
`RESEND_FROM_EMAIL` must be a verified sender in your Resend account.

For local dev, use:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For the `/approve` workflow email, also configure GitHub repository settings:

- `Settings -> Secrets and variables -> Actions -> Secrets`
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL` (your verified noreply sender)
- `Settings -> Secrets and variables -> Actions -> Variables`
  - `SITE_URL` (optional, defaults to `https://utexas.network`)
  - `DEPLOY_HOOK_URL` (recommended: production deploy hook URL from your hosting provider)

### 2. Approve/reject by GitHub issue comment

On the generated join-request issue, comment with either:

- `/approve` -> auto-adds the member to `src/data/members.ts` and closes the issue
- `/reject` -> closes without adding

This is handled by `.github/workflows/moderate-join-requests.yml`.

### 2.5 Auto-deploy after merges/approvals

Profile entries are source-controlled in `src/data/members.ts`, so they appear on the live site only after a production deploy.  
This repo includes `.github/workflows/trigger-deploy.yml`, which calls `DEPLOY_HOOK_URL` on every push to `main` (including approve-workflow commits), so new profiles publish automatically once that secret is configured.

### 3. Optional profile images
You can use external `profilePic` URLs directly, or upload to `public/photos/` and edit the member later.

---

## Add the Widget to Your Site

```html
<script 
  src="https://utexas.network/embed.js" 
  data-webring
  data-user="your-name"
></script>
```

**What it does:**
- Center icon → links to [utexas.network](https://utexas.network)
- Arrows → open your connections' websites

**Customize:** `data-color` and `data-arrow` still work, and you can also size/space the widget with `data-icon-size`, `data-arrow-size`, and `data-gap` (numeric pixel values).

---

made with ❤️ by the utexas.network crew
# utexas.network

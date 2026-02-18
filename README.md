# utexas.network

A webring for UT Austin students.

---

## Join the Webring (Moderated)

**Requirements:** UT Austin student + personal website

### 1. Submit the join form

Submissions are sent to `POST /api/join-request` (no redirect), which creates a GitHub issue for moderation.

Set these server env vars:

```bash
GITHUB_JOIN_BOT_TOKEN=ghp_xxx
GITHUB_JOIN_REPO_OWNER=your-github-org-or-user
GITHUB_JOIN_REPO_NAME=utexas.network
```

### 2. Approve/reject by email reply

When GitHub sends you an issue notification email, reply with either:

- `/approve` -> auto-adds the member to `src/data/members.ts` and closes the issue
- `/reject` -> closes without adding

This is handled by `.github/workflows/moderate-join-requests.yml`.

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

**Customize:** Add `data-color="red"` or `data-arrow="chevron"` for different styles.

---

made with ❤️ by the utexas.network crew
# utexas.network

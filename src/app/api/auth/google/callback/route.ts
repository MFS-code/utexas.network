import { NextResponse } from 'next/server';

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfoResponse {
  name?: string;
  email?: string;
  picture?: string;
}

function getTargetOrigin(requestOrigin: string): string {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!configuredBaseUrl) return requestOrigin;

  try {
    return new URL(configuredBaseUrl).origin;
  } catch {
    return requestOrigin;
  }
}

function escapeForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function buildPopupHtml(message: Record<string, unknown>, targetOrigin: string): string {
  const safeMessage = escapeForScript(message);
  const safeOrigin = escapeForScript(targetOrigin);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Google Sign-In</title>
  </head>
  <body>
    <script>
      (function () {
        const payload = ${safeMessage};
        const targetOrigin = ${safeOrigin};
        if (window.opener) {
          window.opener.postMessage(payload, targetOrigin);
        }
        window.close();
      })();
    </script>
    <p>Completing sign in...</p>
  </body>
</html>`;
}

function htmlResponse(message: Record<string, unknown>, targetOrigin: string): NextResponse {
  return new NextResponse(buildPopupHtml(message, targetOrigin), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const requestOrigin = requestUrl.origin;
  const targetOrigin = getTargetOrigin(requestOrigin);

  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state') || '';
  const oauthError = requestUrl.searchParams.get('error');

  if (oauthError) {
    return htmlResponse(
      {
        source: 'google-oauth',
        success: false,
        state,
        error: `Google OAuth error: ${oauthError}`,
      },
      targetOrigin,
    );
  }

  if (!code) {
    return htmlResponse(
      {
        source: 'google-oauth',
        success: false,
        state,
        error: 'Missing OAuth code.',
      },
      targetOrigin,
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${requestOrigin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return htmlResponse(
      {
        source: 'google-oauth',
        success: false,
        state,
        error: 'Google OAuth is not configured.',
      },
      targetOrigin,
    );
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenJson = (await tokenResponse.json()) as GoogleTokenResponse;
    if (!tokenResponse.ok || !tokenJson.access_token) {
      const reason = tokenJson.error_description || tokenJson.error || 'Token exchange failed.';
      return htmlResponse(
        {
          source: 'google-oauth',
          success: false,
          state,
          error: reason,
        },
        targetOrigin,
      );
    }

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
      },
      cache: 'no-store',
    });

    const userInfo = (await userInfoResponse.json()) as GoogleUserInfoResponse;
    if (!userInfoResponse.ok || !userInfo.email) {
      return htmlResponse(
        {
          source: 'google-oauth',
          success: false,
          state,
          error: 'Unable to fetch Google profile.',
        },
        targetOrigin,
      );
    }

    return htmlResponse(
      {
        source: 'google-oauth',
        success: true,
        state,
        profile: {
          name: userInfo.name || '',
          email: userInfo.email || '',
          picture: userInfo.picture || '',
        },
      },
      targetOrigin,
    );
  } catch {
    return htmlResponse(
      {
        source: 'google-oauth',
        success: false,
        state,
        error: 'Google sign-in failed. Please try again.',
      },
      targetOrigin,
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = new Set([
  'drive.usercontent.google.com',
]);

export async function GET(request: NextRequest) {
  const remoteUrl = request.nextUrl.searchParams.get('url');

  if (!remoteUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(remoteUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid url parameter' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol) || !ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    return NextResponse.json({ error: 'Unsupported avatar host' }, { status: 400 });
  }

  const upstreamResponse = await fetch(parsedUrl.toString(), {
    headers: {
      'User-Agent': 'utexas.network avatar proxy',
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
    cache: 'force-cache',
  });

  if (!upstreamResponse.ok) {
    return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: upstreamResponse.status });
  }

  const contentType = upstreamResponse.headers.get('content-type') ?? 'application/octet-stream';
  const cacheControl = upstreamResponse.headers.get('cache-control') ?? 'public, max-age=86400, s-maxage=86400';
  const body = await upstreamResponse.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
    },
  });
}

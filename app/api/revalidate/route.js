import { NextResponse } from 'next/server';

// The site now renders dynamically on every request (see `dynamic` export in
// app/layout.jsx), so Contentful edits already show up on a plain refresh —
// this webhook endpoint is no longer needed to bust a cache. Kept as a no-op
// so an existing Contentful webhook pointed here doesn't start failing.
export async function POST(request) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (!process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: 'CONTENTFUL_REVALIDATE_SECRET is not set on the server' },
      { status: 500 }
    );
  }

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: 'Invalid secret' }, { status: 401 });
  }

  return NextResponse.json({
    revalidated: false,
    message: 'No-op: the site now renders dynamically, so no cache needs revalidating.',
    now: Date.now(),
  });
}

// Convenience GET so the endpoint can also be tested from a browser/curl
// during setup. Same secret check applies.
export async function GET(request) {
  return POST(request);
}

import { NextResponse } from 'next/server';

export function rejectCrossOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get('origin');
  if (!origin) return null;

  try {
    const requestUrl = new URL(request.url);
    const originUrl = new URL(origin);
    if (originUrl.protocol === requestUrl.protocol && originUrl.host === requestUrl.host) return null;
  } catch {
    // Toute origine illisible est refusée.
  }

  return NextResponse.json(
    { ok: false, error: 'ORIGINE_REFUSEE' },
    { status: 403, headers: { 'Cache-Control': 'no-store' } },
  );
}

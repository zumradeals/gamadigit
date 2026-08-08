import { NextResponse } from 'next/server';
import { handshakeWithGamadCore } from '@/lib/gamad-core/server';
import { rejectCrossOrigin } from '@/lib/http/same-origin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  try {
    const result = await handshakeWithGamadCore();

    return NextResponse.json(
      {
        service: 'DG AFRIQUE Portal Genesis',
        core: result.ok ? 'connected' : 'unavailable',
        productRef: result.productRef,
        authnRef: result.authnRef,
        coreReachable: result.coreReachable,
        authenticated: result.authenticated,
        sessionClosed: result.sessionClosed,
        assurance: result.assurance ?? null,
        error: result.error ?? null,
      },
      {
        status: result.ok ? 200 : 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          Pragma: 'no-cache',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      },
    );
  } catch {
    return NextResponse.json(
      { service: 'DG AFRIQUE Portal Genesis', core: 'configuration_error' },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          Pragma: 'no-cache',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      },
    );
  }
}

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  CoreAccountError,
  parsePortalSession,
  portalAccountCookie,
  readCanonicalIdentity,
} from '@/lib/gamad-core/account';

export const dynamic = 'force-dynamic';

export async function GET() {
  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const identity = await readCanonicalIdentity(session);
    return NextResponse.json({
      authenticated: true,
      account: {
        entity: session.entity,
        assurance: session.assurance,
        expiresAt: session.expiresAt,
        identity,
      },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof CoreAccountError && error.status === 401) {
      const response = NextResponse.json({ authenticated: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
      response.cookies.set(portalAccountCookie.name, '', { ...portalAccountCookie.options, expires: new Date(0) });
      return response;
    }

    return NextResponse.json(
      { authenticated: true, error: 'IDENTITE_TEMPORAIREMENT_INDISPONIBLE' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

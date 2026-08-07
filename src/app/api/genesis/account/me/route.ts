import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parsePortalSession, portalAccountCookie, readCanonicalIdentity } from '@/lib/gamad-core/account';

export const dynamic = 'force-dynamic';

export async function GET() {
  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
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
    });
  } catch {
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.set(portalAccountCookie.name, '', { ...portalAccountCookie.options, expires: new Date(0) });
    return response;
  }
}

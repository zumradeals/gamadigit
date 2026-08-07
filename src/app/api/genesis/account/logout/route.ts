import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { closeUserSession, parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';

export const dynamic = 'force-dynamic';

export async function POST() {
  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);

  if (session) {
    await closeUserSession(session);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(portalAccountCookie.name, '', { ...portalAccountCookie.options, expires: new Date(0) });
  return response;
}

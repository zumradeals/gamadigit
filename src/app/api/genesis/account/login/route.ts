import { NextResponse } from 'next/server';
import {
  CoreAccountError,
  openUserSession,
  portalAccountCookie,
  readCanonicalIdentity,
  serializePortalSession,
} from '@/lib/gamad-core/account';
import { rejectCrossOrigin } from '@/lib/http/same-origin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const body = (await request.json().catch(() => null)) as { identifier?: string; password?: string } | null;
  const identifier = body?.identifier?.trim();
  const password = body?.password;

  if (!identifier || !password) {
    return NextResponse.json({ ok: false, error: 'IDENTIFIANTS_REQUIS' }, { status: 422 });
  }

  try {
    const session = await openUserSession(identifier, 'EMAIL', password);
    const identity = await readCanonicalIdentity(session);
    const response = NextResponse.json({
      ok: true,
      account: { entity: session.entity, assurance: session.assurance, expiresAt: session.expiresAt, identity },
    }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(portalAccountCookie.name, serializePortalSession(session), {
      ...portalAccountCookie.options,
      expires: new Date(session.expiresAt),
    });
    return response;
  } catch (error) {
    if (error instanceof CoreAccountError) {
      const status = error.status === 401 ? 401 : error.status === 429 ? 429 : 503;
      const code = error.status === 401
        ? 'IDENTIFIANT_OU_SECRET_REFUSE'
        : error.status === 429
          ? 'TROP_DE_TENTATIVES_CONNEXION'
          : error.code;
      return NextResponse.json(
        { ok: false, error: code },
        { status, headers: { 'Cache-Control': 'no-store' } },
      );
    }
    return NextResponse.json({ ok: false, error: 'CORE_TEMPORAIREMENT_INDISPONIBLE' }, { status: 503 });
  }
}

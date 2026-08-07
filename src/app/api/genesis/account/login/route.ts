import { NextResponse } from 'next/server';
import { openUserSession, portalAccountCookie, readCanonicalIdentity, serializePortalSession } from '@/lib/gamad-core/account';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { entity?: string; secret?: string } | null;
  const entity = body?.entity?.trim();
  const secret = body?.secret;

  if (!entity || !secret) {
    return NextResponse.json({ ok: false, error: 'IDENTIFIANTS_REQUIS' }, { status: 422 });
  }

  try {
    const session = await openUserSession(entity, secret);
    const identity = await readCanonicalIdentity(session);

    const response = NextResponse.json({
      ok: true,
      account: {
        entity: session.entity,
        assurance: session.assurance,
        expiresAt: session.expiresAt,
        identity,
      },
    });

    response.cookies.set(portalAccountCookie.name, serializePortalSession(session), {
      ...portalAccountCookie.options,
      expires: new Date(session.expiresAt),
    });

    return response;
  } catch (error) {
    const code = error instanceof Error ? error.message : 'CORE_INDISPONIBLE';
    const status = code === 'AUTHENTIFICATION_REFUSEE' ? 401 : 503;
    return NextResponse.json(
      { ok: false, error: code === 'AUTHENTIFICATION_REFUSEE' ? 'IDENTIFIANT_OU_SECRET_REFUSE' : 'CORE_TEMPORAIREMENT_INDISPONIBLE' },
      { status },
    );
  }
}

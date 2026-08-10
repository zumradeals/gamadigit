import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  CoreAccountError,
  parsePortalSession,
  portalAccountCookie,
  readCanonicalIdentity,
  readCurrentUserSession,
  serializePortalSession,
} from '@/lib/gamad-core/account';
import { identityResolutionFailure } from '@/lib/gamad-core/identity-state';
import { renewPortalSessionFromAttestation } from '@/lib/gamad-core/portal-session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const identity = await readCanonicalIdentity(session);
    const attestation = await readCurrentUserSession(session);
    const renewed = renewPortalSessionFromAttestation(session, attestation);
    if (!renewed) {
      throw new CoreAccountError('ATTESTATION_SESSION_INVALIDE', 502);
    }

    const response = NextResponse.json({
      authenticated: true,
      account: {
        entity: renewed.entity,
        assurance: renewed.assurance,
        expiresAt: renewed.expiresAt,
        identity,
      },
    }, { headers: { 'Cache-Control': 'no-store' } });

    response.cookies.set(portalAccountCookie.name, serializePortalSession(renewed), {
      ...portalAccountCookie.options,
      expires: new Date(renewed.expiresAt),
    });
    return response;
  } catch (error) {
    const failure = identityResolutionFailure(error instanceof CoreAccountError ? error.status : undefined);
    const response = NextResponse.json(
      failure.error
        ? { authenticated: failure.authenticated, error: failure.error }
        : { authenticated: failure.authenticated },
      { status: failure.status, headers: { 'Cache-Control': 'no-store' } },
    );

    if (failure.clearPortalCookie) {
      response.cookies.set(portalAccountCookie.name, '', { ...portalAccountCookie.options, expires: new Date(0) });
    }

    return response;
  }
}

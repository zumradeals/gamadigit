import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { listFederationSatellites } from '@/lib/federation/satellites';
import { closeUserSession, parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { readProductionLogoutUrl } from '@/lib/gamad-core/server';
import { rejectCrossOrigin } from '@/lib/http/same-origin';

export const dynamic = 'force-dynamic';

async function firstSatelliteLogoutUrl(): Promise<string | null> {
  // GamaDrive est actuellement le seul satellite réel raccordé. Le contrat
  // retourne une seule prochaine navigation ; un futur multi-satellite devra
  // définir un chaînage front-channel explicite avant d'en activer plusieurs.
  for (const satellite of listFederationSatellites()) {
    const logoutUrl = await readProductionLogoutUrl(satellite.productRef);
    if (logoutUrl) return logoutUrl;
  }

  return null;
}

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);

  const [nextLogoutUrl] = await Promise.all([
    firstSatelliteLogoutUrl(),
    session ? closeUserSession(session) : Promise.resolve(),
  ]);

  const response = NextResponse.json(
    { ok: true, nextLogoutUrl },
    { headers: { 'Cache-Control': 'no-store' } },
  );
  response.cookies.set(portalAccountCookie.name, '', { ...portalAccountCookie.options, expires: new Date(0) });
  return response;
}

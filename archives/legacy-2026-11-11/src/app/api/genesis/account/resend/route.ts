import { NextResponse } from 'next/server';
import { CoreAccountError, resendGamadVerification } from '@/lib/gamad-core/account';
import { rejectCrossOrigin } from '@/lib/http/same-origin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const body = (await request.json().catch(() => null)) as {
    destination?: string;
    identifier?: string;
    identifierReference?: string;
  } | null;

  // `identifier` est accepté temporairement pour les onglets ayant chargé
  // l'ancien bundle avant le déploiement. Le contrat Core reçoit toujours
  // `destination` + `identifiant_reference`.
  const destination = body?.destination?.trim() || body?.identifier?.trim();
  const identifierReference = body?.identifierReference;

  if (!destination || !identifierReference) {
    return NextResponse.json({ ok: false, error: 'DONNEES_REQUISES' }, { status: 422 });
  }

  try {
    const result = await resendGamadVerification({ destination, identifierReference });
    return NextResponse.json({ ok: true, verification: result }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof CoreAccountError) {
      const status = error.status === 429 ? 429 : error.status >= 500 ? 503 : 422;
      return NextResponse.json({ ok: false, error: error.code }, { status, headers: { 'Cache-Control': 'no-store' } });
    }
    return NextResponse.json({ ok: false, error: 'RENVOI_INDISPONIBLE' }, { status: 503 });
  }
}

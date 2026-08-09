import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { coreFetch, getGamadCoreConfig } from '@/lib/gamad-core/server';
import {
  federationReturnCookie,
  getFederationSatellite,
  type FederationSatellite,
} from '@/lib/federation/satellites';

export const dynamic = 'force-dynamic';

type CoreOpeningPayload = {
  acces?: {
    jeton?: string;
    audience?: string;
    expire_le?: string;
  };
  erreur?: string;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[character] ?? character);
}

function securityHeaders(callbackOrigin?: string, nonce?: string): HeadersInit {
  const formAction = callbackOrigin ? ` ${callbackOrigin}` : " 'none'";
  const scriptSource = nonce ? ` 'nonce-${nonce}'` : " 'none'";
  const styleSource = nonce ? ` 'nonce-${nonce}'` : " 'none'";

  return {
    'Cache-Control': 'no-store, private, max-age=0',
    Pragma: 'no-cache',
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': `default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action${formAction}; script-src${scriptSource}; style-src${styleSource}`,
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  };
}

function clearFederationReturn(response: NextResponse): NextResponse {
  response.cookies.set(federationReturnCookie.name, '', {
    ...federationReturnCookie.options,
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

function redirectToLogin(request: Request, satellite: FederationSatellite, clearPortalSession = false): NextResponse {
  const response = NextResponse.redirect(new URL('/connexion', request.url));
  response.cookies.set(
    federationReturnCookie.name,
    satellite.key,
    federationReturnCookie.options,
  );

  if (clearPortalSession) {
    response.cookies.set(portalAccountCookie.name, '', {
      ...portalAccountCookie.options,
      expires: new Date(0),
      maxAge: 0,
    });
  }

  response.headers.set('Cache-Control', 'no-store, private, max-age=0');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

function errorPage(satellite: FederationSatellite, message: string, status = 503): NextResponse {
  const nonce = crypto.randomBytes(18).toString('base64');
  const retryPath = `/federation/continue/${encodeURIComponent(satellite.key)}`;
  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ouverture de ${escapeHtml(satellite.displayName)} — DG Afrique</title>
  <style nonce="${nonce}">
    body{margin:0;background:#f7f3ea;color:#071a33;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.card{max-width:620px;background:#fff;border:1px solid #ded8cb;border-radius:24px;padding:32px;box-shadow:0 18px 55px rgba(7,26,51,.08)}h1{margin:0 0 12px;font-size:30px}p{line-height:1.65;color:#536070}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}a{display:inline-block;padding:12px 16px;border-radius:12px;text-decoration:none;font-weight:800}.primary{background:#071a33;color:#fff}.secondary{border:1px solid #ded8cb;color:#071a33}
  </style>
</head>
<body><main class="wrap"><section class="card"><p>DG Afrique</p><h1>Impossible d’ouvrir ${escapeHtml(satellite.displayName)} pour le moment.</h1><p>${escapeHtml(message)}</p><div class="actions"><a class="primary" href="${escapeHtml(retryPath)}">Réessayer</a><a class="secondary" href="/espace">Retour à mon espace</a></div></section></main></body>
</html>`;

  return clearFederationReturn(new NextResponse(html, {
    status,
    headers: securityHeaders(undefined, nonce),
  }));
}

function handoffPage(satellite: FederationSatellite, token: string): NextResponse {
  const callback = new URL(satellite.callbackUrl);
  const nonce = crypto.randomBytes(18).toString('base64');
  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ouverture de ${escapeHtml(satellite.displayName)} — DG Afrique</title>
  <style nonce="${nonce}">
    body{margin:0;background:#f7f3ea;color:#071a33;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.card{max-width:560px;text-align:center;background:#fff;border:1px solid #ded8cb;border-radius:24px;padding:32px;box-shadow:0 18px 55px rgba(7,26,51,.08)}h1{margin:0 0 12px;font-size:28px}p{line-height:1.6;color:#536070}button{margin-top:18px;border:0;border-radius:12px;background:#071a33;color:#fff;padding:12px 18px;font-weight:800;cursor:pointer}
  </style>
</head>
<body>
  <main class="wrap"><section class="card"><p>DG Afrique</p><h1>Ouverture de ${escapeHtml(satellite.displayName)}…</h1><p>Votre accès est préparé de façon sécurisée. Vous allez être redirigé automatiquement.</p>
    <form id="federation-handoff" method="post" action="${escapeHtml(satellite.callbackUrl)}">
      <input type="hidden" name="jeton" value="${escapeHtml(token)}">
      <noscript><button type="submit">Continuer vers ${escapeHtml(satellite.displayName)}</button></noscript>
    </form>
  </section></main>
  <script nonce="${nonce}">document.getElementById('federation-handoff').submit();</script>
</body>
</html>`;

  return clearFederationReturn(new NextResponse(html, {
    status: 200,
    headers: securityHeaders(callback.origin, nonce),
  }));
}

export async function GET(
  request: Request,
  context: { params: Promise<{ satellite: string }> },
) {
  const { satellite: satelliteKey } = await context.params;
  const satellite = getFederationSatellite(satelliteKey);

  if (!satellite) {
    return new NextResponse('Satellite inconnu.', {
      status: 404,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);
  if (!session) return redirectToLogin(request, satellite);

  try {
    const core = getGamadCoreConfig();
    const opening = await coreFetch(
      `${core.baseUrl}/produits/${encodeURIComponent(satellite.productRef)}/ouverture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'X-Correlation-ID': crypto.randomUUID(),
        },
        body: JSON.stringify({}),
      },
    );

    const payload = await opening.json().catch(() => ({})) as CoreOpeningPayload;

    if (opening.status === 401) {
      return redirectToLogin(request, satellite, true);
    }

    if (!opening.ok) {
      const denied = opening.status === 403 || opening.status === 422;
      return errorPage(
        satellite,
        denied
          ? 'Cet accès n’est pas disponible pour votre compte actuellement.'
          : 'Le service d’ouverture est momentanément indisponible. Aucune donnée de connexion n’a été transmise à GamaDrive.',
        denied ? 403 : 503,
      );
    }

    const token = payload.acces?.jeton;
    if (!token || payload.acces?.audience !== satellite.productRef) {
      return errorPage(
        satellite,
        'DG Afrique n’a pas reçu une preuve d’accès exploitable. Veuillez réessayer dans quelques instants.',
        502,
      );
    }

    return handoffPage(satellite, token);
  } catch {
    return errorPage(
      satellite,
      'Le service d’ouverture est momentanément indisponible. Aucune donnée de connexion n’a été transmise à GamaDrive.',
      503,
    );
  }
}

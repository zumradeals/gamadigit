import 'server-only';

export type FederationSatelliteKey = 'gamadrive';

export type FederationSatellite = {
  key: FederationSatelliteKey;
  productRef: string;
  displayName: string;
  callbackUrl: string;
};

const DEFAULT_GAMADRIVE_CALLBACK = 'https://gamadrive.dgafrique.com/federation/callback';

function federationCallbackUrl(value: string | undefined, fallback: string): string {
  const candidate = value?.trim() || fallback;
  const url = new URL(candidate);

  if (url.protocol !== 'https:') {
    throw new Error('Une URL de callback de fédération doit utiliser HTTPS.');
  }

  return url.toString();
}

const satellites: Record<FederationSatelliteKey, FederationSatellite> = {
  gamadrive: {
    key: 'gamadrive',
    productRef: 'PRD-GAMAD-002',
    displayName: 'GamaDrive',
    callbackUrl: federationCallbackUrl(
      process.env.GAMADRIVE_FEDERATION_CALLBACK_URL,
      DEFAULT_GAMADRIVE_CALLBACK,
    ),
  },
};

export const federationReturnCookie = {
  name: 'dgafrique_federation_return',
  options: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 10 * 60,
  },
};

export function getFederationSatellite(value: string): FederationSatellite | null {
  return Object.prototype.hasOwnProperty.call(satellites, value)
    ? satellites[value as FederationSatelliteKey]
    : null;
}

export function listFederationSatellites(): FederationSatellite[] {
  return Object.values(satellites);
}

export function isFederationSatelliteKey(value?: string | null): value is FederationSatelliteKey {
  return Boolean(value && Object.prototype.hasOwnProperty.call(satellites, value));
}

export function federationContinuePath(satellite: FederationSatelliteKey): string {
  return `/federation/continue/${satellite}`;
}

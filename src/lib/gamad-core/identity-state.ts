export type IdentityResolutionFailure = {
  status: 401 | 503;
  authenticated: boolean;
  clearPortalCookie: boolean;
  error?: 'IDENTITE_TEMPORAIREMENT_INDISPONIBLE';
};

export function identityResolutionFailure(coreStatus?: number): IdentityResolutionFailure {
  if (coreStatus === 401) {
    return {
      status: 401,
      authenticated: false,
      clearPortalCookie: true,
    };
  }

  return {
    status: 503,
    authenticated: true,
    clearPortalCookie: false,
    error: 'IDENTITE_TEMPORAIREMENT_INDISPONIBLE',
  };
}

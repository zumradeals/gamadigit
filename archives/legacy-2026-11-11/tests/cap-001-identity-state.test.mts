import assert from 'node:assert/strict';
import test from 'node:test';
import { identityResolutionFailure } from '../src/lib/gamad-core/identity-state.ts';

test('CAP-001 treats Core 401 as a revoked or invalid portal session', () => {
  assert.deepEqual(identityResolutionFailure(401), {
    status: 401,
    authenticated: false,
    clearPortalCookie: true,
  });
});

test('CAP-001 preserves the portal session on transient Core failures', () => {
  assert.deepEqual(identityResolutionFailure(503), {
    status: 503,
    authenticated: true,
    clearPortalCookie: false,
    error: 'IDENTITE_TEMPORAIREMENT_INDISPONIBLE',
  });

  assert.deepEqual(identityResolutionFailure(undefined), {
    status: 503,
    authenticated: true,
    clearPortalCookie: false,
    error: 'IDENTITE_TEMPORAIREMENT_INDISPONIBLE',
  });
});

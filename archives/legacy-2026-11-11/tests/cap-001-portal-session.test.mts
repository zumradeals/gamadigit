import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parsePortalSession,
  serializePortalSession,
  type PortalAccountSession,
} from '../src/lib/gamad-core/portal-session.ts';

const originalSecret = process.env.GAMAD_CORE_CONNECT_SECRET;

function futureSession(): PortalAccountSession {
  return {
    token: 'test-token-never-production',
    entity: 'IDN-PER-TEST',
    assurance: 'AS1',
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  };
}

test.beforeEach(() => {
  process.env.GAMAD_CORE_CONNECT_SECRET = 'cap-001-test-signing-secret';
});

test.after(() => {
  if (originalSecret === undefined) delete process.env.GAMAD_CORE_CONNECT_SECRET;
  else process.env.GAMAD_CORE_CONNECT_SECRET = originalSecret;
});

test('CAP-001 accepts an intact, unexpired signed portal session', () => {
  const session = futureSession();
  const encoded = serializePortalSession(session);
  assert.deepEqual(parsePortalSession(encoded), session);
});

test('CAP-001 rejects a tampered payload', () => {
  const encoded = serializePortalSession(futureSession());
  const [payload, signature] = encoded.split('.');
  const tamperedPayload = `${payload.slice(0, -1)}${payload.endsWith('A') ? 'B' : 'A'}`;
  assert.equal(parsePortalSession(`${tamperedPayload}.${signature}`), null);
});

test('CAP-001 rejects a tampered signature', () => {
  const encoded = serializePortalSession(futureSession());
  const [payload, signature] = encoded.split('.');
  const tamperedSignature = `${signature.slice(0, -1)}${signature.endsWith('A') ? 'B' : 'A'}`;
  assert.equal(parsePortalSession(`${payload}.${tamperedSignature}`), null);
});

test('CAP-001 rejects an expired session', () => {
  const expired = {
    ...futureSession(),
    expiresAt: new Date(Date.now() - 1_000).toISOString(),
  };
  assert.equal(parsePortalSession(serializePortalSession(expired)), null);
});

test('CAP-001 rejects a session signed with another connector secret', () => {
  const encoded = serializePortalSession(futureSession());
  process.env.GAMAD_CORE_CONNECT_SECRET = 'another-cap-001-secret';
  assert.equal(parsePortalSession(encoded), null);
});

test('CAP-001 rejects malformed or incomplete cookies', () => {
  assert.equal(parsePortalSession(null), null);
  assert.equal(parsePortalSession('not-a-cookie'), null);
  assert.equal(parsePortalSession('a.b.c'), null);

  const incomplete = serializePortalSession({
    ...futureSession(),
    entity: '',
  });
  assert.equal(parsePortalSession(incomplete), null);
});

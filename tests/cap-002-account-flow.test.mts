import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildVerificationResendPayload,
  makePendingAccountVerification,
  normalizePendingAccountVerification,
  pendingVerificationCodeIsActive,
  safeAccountReturnPath,
} from '../src/lib/gamad-core/account-flow.ts';

const NOW = Date.parse('2026-08-10T12:00:00Z');

test('CAP-002 accepts only safe local return paths', () => {
  assert.equal(safeAccountReturnPath('/espace/zumra/rejoindre/abc?x=1'), '/espace/zumra/rejoindre/abc?x=1');
  assert.equal(safeAccountReturnPath('/connexion'), '/espace');
  assert.equal(safeAccountReturnPath('//evil.example/path'), '/espace');
  assert.equal(safeAccountReturnPath('https://evil.example/path'), '/espace');
  assert.equal(safeAccountReturnPath('javascript:alert(1)'), '/espace');
  assert.equal(safeAccountReturnPath(undefined), '/espace');
});

test('CAP-002 sends the current Core resend contract exactly', () => {
  assert.deepEqual(buildVerificationResendPayload('personne@example.com', 'RID-123'), {
    identifiant_reference: 'RID-123',
    destination: 'personne@example.com',
  });
});

test('CAP-002 keeps a verification resume dossier without password or code', () => {
  const pending = makePendingAccountVerification({
    identity: 'IDN-123',
    identifierReference: 'RID-123',
    verificationReference: 'VER-123',
    expiresAt: '2026-08-10T12:10:00Z',
    channel: 'EMAIL',
    identifier: 'personne@example.com',
  }, NOW);

  const restored = normalizePendingAccountVerification(pending, NOW + 60_000);
  assert.deepEqual(restored, pending);
  assert.equal('password' in pending, false);
  assert.equal('code' in pending, false);
});

test('CAP-002 can resume after the old code expires while the resume dossier remains valid', () => {
  const pending = makePendingAccountVerification({
    identity: 'IDN-123',
    identifierReference: 'RID-123',
    verificationReference: 'VER-123',
    expiresAt: '2026-08-10T12:01:00Z',
    channel: 'EMAIL',
    identifier: 'personne@example.com',
  }, NOW);

  assert.equal(pendingVerificationCodeIsActive(pending, NOW + 120_000), false);
  assert.ok(normalizePendingAccountVerification(pending, NOW + 120_000));
});

test('CAP-002 expires the local resume dossier after its bounded recovery window', () => {
  const pending = makePendingAccountVerification({
    identity: 'IDN-123',
    identifierReference: 'RID-123',
    verificationReference: 'VER-123',
    expiresAt: '2026-08-10T12:10:00Z',
    channel: 'EMAIL',
    identifier: 'personne@example.com',
  }, NOW);

  assert.equal(normalizePendingAccountVerification(pending, Date.parse(pending.resumeUntil) + 1), null);
});

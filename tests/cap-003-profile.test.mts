import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  parseCapabilityProfileInput,
  profileHasOrientationSignal,
} from '../src/lib/profile/capability-profile.ts';

test('CAP-003 accepts a useful DG profile without ZUMRA-specific requirements', () => {
  const profile = parseCapabilityProfileInput({
    country: ' Côte d’Ivoire ',
    city: ' Abidjan ',
    currentActivity: ' Commerçant ',
    skills: [' Vente ', ' Négociation '],
    learningGoals: [' Comptabilité '],
    sectors: [' Commerce '],
    intentions: [' Développer mon activité '],
    openToRecommendations: true,
  });

  assert.ok(profile);
  assert.equal(profile.country, 'Côte d’Ivoire');
  assert.equal(profile.city, 'Abidjan');
  assert.deepEqual(profile.skills, ['Vente', 'Négociation']);
  assert.equal(profileHasOrientationSignal(profile), true);
});

test('CAP-003 treats starting without a skill as a valid orientation signal', () => {
  const profile = parseCapabilityProfileInput({
    noSkillsYet: true,
    skills: ['Valeur qui doit être ignorée'],
    learningGoals: ['Mécanique'],
  });

  assert.ok(profile);
  assert.deepEqual(profile.skills, []);
  assert.equal(profile.noSkillsYet, true);
  assert.equal(profileHasOrientationSignal(profile), true);
});

test('CAP-003 rejects oversized profile lists', () => {
  const profile = parseCapabilityProfileInput({
    skills: Array.from({ length: 21 }, (_, index) => `Compétence ${index + 1}`),
  });
  assert.equal(profile, null);
});

test('CAP-003 storage is independent from ZUMRA membership', () => {
  const migration = readFileSync(
    new URL('../supabase/migrations/20260811234000_dg_person_profiles.sql', import.meta.url),
    'utf8',
  );

  const createTableBlock = migration.slice(0, migration.indexOf('insert into public.dg_person_profiles'));
  assert.match(createTableBlock, /create table if not exists public\.dg_person_profiles/);
  assert.match(createTableBlock, /core_identity_reference text primary key/);
  assert.doesNotMatch(createTableBlock, /references\s+public\.zumra_memberships/i);
});

test('CAP-003 profile API binds reads and writes to a live authenticated Core identity', () => {
  const source = readFileSync(
    new URL('../src/app/api/genesis/profile/route.ts', import.meta.url),
    'utf8',
  );

  assert.match(source, /from\('dg_person_profiles'\)/);
  assert.match(source, /core_identity_reference:\s*session\.entity/);
  assert.match(source, /rejectCrossOrigin\(request\)/);
  assert.match(source, /readCurrentUserSession\(session\)/);
  assert.match(source, /renewPortalSessionFromAttestation\(session, attestation\)/);
  assert.doesNotMatch(source, /body.*coreIdentityReference/s);
});

test('CAP-003 PATCH preserves profile fields that the current editor does not send', () => {
  const source = readFileSync(
    new URL('../src/app/api/genesis/profile/route.ts', import.meta.url),
    'utf8',
  );

  assert.match(source, /owns\(body, 'phone'\).*existing\?\.phone/s);
  assert.match(source, /owns\(body, 'education'\).*existing\?\.education/s);
  assert.match(source, /owns\(body, 'participationMode'\).*existing\?\.participation_mode/s);
});

test('CAP-003 keeps DG profile existence separate from ZUMRA enrollment and consent', () => {
  const accountSpace = readFileSync(
    new URL('../src/components/genesis/account-space.tsx', import.meta.url),
    'utf8',
  );
  const meSource = readFileSync(
    new URL('../src/app/api/zumra/me/route.ts', import.meta.url),
    'utf8',
  );

  assert.match(accountSpace, /fetch\('\/api\/genesis\/profile'/);
  assert.match(meSource, /if \(!membership\)[\s\S]*enrolled:\s*false/);
  assert.match(meSource, /from\('dg_person_profiles'\)/);
  assert.match(meSource, /from\('zumra_member_profiles'\)/);
});

test('CAP-003 lets ZUMRA reuse shared profile data without overwriting free DG intentions', () => {
  const enrollSource = readFileSync(
    new URL('../src/app/api/zumra/enroll/route.ts', import.meta.url),
    'utf8',
  );

  assert.match(enrollSource, /from\('dg_person_profiles'\)/);
  assert.match(enrollSource, /from\('zumra_member_profiles'\)/);
  assert.match(enrollSource, /canonicalIntentions/);
  assert.match(enrollSource, /intentions:\s*value\.intentions/);
});

test('CAP-003 routes profile management through DG Afrique without reducing the person to a score', () => {
  const home = readFileSync(
    new URL('../src/components/superapp/home/member-home.tsx', import.meta.url),
    'utf8',
  );
  const profilePage = readFileSync(
    new URL('../src/app/(public)/espace/profil/page.tsx', import.meta.url),
    'utf8',
  );

  assert.match(home, /href="\/espace\/profil"/);
  assert.doesNotMatch(home, /progressLabel:\s*`Profil/);
  assert.match(profilePage, /CapabilityProfileForm/);
});

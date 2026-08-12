# AI HANDOFF — DG Afrique

> **Lire ce fichier avant toute modification.** Il doit permettre à une autre IA de reprendre sans accès à la conversation précédente.

## Projet canonique

- Dépôt : `zumradeals/gamadigit`
- Production : branche `cursor`, `https://dgafrique.com`
- Stack : Next.js 15, React 19, TypeScript, Tailwind, Supabase/PostgreSQL, GAMAD Core, GeniusPay
- Laravel V2 n'est plus la trajectoire active.

## Règle de chantier

Le développement suit **CAP-001 → CAP-084**, un seul gate actif. Lire `docs/capacites/CAP-MASTER-TRACKER.md`, travailler uniquement le premier CAP non `VALIDÉ PROD`, maintenir spec/preuve/historique/tracker/handoff, puis seulement ouvrir le CAP suivant.

### Profondeur adoptée le 2026-08-11

Ne plus poursuivre une perfection exhaustive avant d'avancer. Un CAP peut être validé quand le **parcours principal réel**, les **invariants sécurité/données critiques**, les **tests automatisés utiles** et la **production** sont verts. Les raffinements UX et cas rares non bloquants vont au backlog.

## État officiel

- **CAP-001 — IDENTITÉ PERSONNE : VALIDÉ PROD.**
- **CAP-002 — COMPTE DG AFRIQUE : VALIDÉ PROD.** Preuve `docs/capacites/proofs/CAP-002-2026-08-10.md`.
- **CAP-003 — PROFIL DE CAPACITÉS : EN DEV, seul gate actif.**
- CAP-004 à CAP-084 : BLOQUÉS.

## CAP-003 — définition V0.1

- décrire une personne par ce qu'elle sait faire, souhaite apprendre et cherche à accomplir ;
- profil = source structurée de capacités, pas simple biographie ;
- identité/localisation, activité, compétences existantes/recherchées, intérêts et intentions ;
- garde-fou : **ne pas réduire la personne à un score**.

CAP-003 ne doit pas absorber CAP-004 COMPÉTENCES, CAP-005 APPRENTISSAGE, CAP-023/024 graphe/profil-source, CAP-026 INTENTION ni les moteurs de matching futurs.

## Décision architecturale CAP-003

Avant CAP-003, le profil était prisonnier de ZUMRA : `zumra_member_profiles.core_identity_reference` possède une FK vers `zumra_memberships`. Impossible d'avoir un profil DG sans adhésion.

Correction : nouvelle table métier **`public.dg_person_profiles`**, attachée directement à la référence d'identité GAMAD Core.

Invariants :

- `core_identity_reference` = clé primaire ;
- aucune FK vers ZUMRA ;
- RLS activée ;
- aucune identité membre parallèle dans Supabase Auth ;
- migration additive, profils ZUMRA existants backfillés ;
- existence d'un profil DG ≠ adhésion/consentement ZUMRA ;
- intentions libres DG séparées des intentions contrôlées ZUMRA ;
- aucun score ou pourcentage de personne affiché.

Migration `supabase/migrations/20260811234000_dg_person_profiles.sql` appliquée avec succès au projet Supabase `sgvzkvxefsazvsvvqtsj`. Contrôle live : table présente, RLS active, PK Core, aucune FK vers ZUMRA, 1 ancien profil backfillé au moment de l'audit.

## Code CAP-003 actuel

Branche : `cap/003-profil-capacites`.

Head code validé : `543bd401c4dc0609f2d88c43ed64fc21600ae04a`. Des commits documentaires suivent sur la même branche.

Fichiers principaux :

- `src/lib/profile/capability-profile.ts` ;
- `src/app/api/genesis/profile/route.ts` ;
- `src/app/(public)/espace/profil/page.tsx` ;
- `src/components/profile/capability-profile-form.tsx` ;
- `src/components/genesis/account-space.tsx` ;
- `src/components/superapp/home/member-home.tsx` ;
- ponts `/api/zumra/me` et `/api/zumra/enroll`.

### Sécurité

`/api/genesis/profile` :

- session portail signée requise ;
- vérification réelle auprès de GAMAD Core via `readCurrentUserSession()` ;
- renouvellement seulement jusqu'à l'expiration attestée Core ;
- mutation same-origin ;
- identité de la ligne imposée par `session.entity`, jamais par le body client ;
- champs non affichés par l'éditeur actuel préservés.

### Séparation ZUMRA

- Mon espace charge `/api/genesis/profile` indépendamment de `/api/zumra/me` ;
- `/api/zumra/me` sans membership retourne `enrolled:false` et ne transforme pas le profil DG en consentement ZUMRA ;
- pour un membre réel, ZUMRA peut réutiliser les champs partagés ;
- `/api/zumra/enroll` conserve les intentions libres DG et écrit ses propres intentions contrôlées dans le profil legacy ZUMRA.

## Tests

Head code `543bd401...` : **27/27 tests pass**, compilation Next.js réussie, lint/types sans erreur observée. Preview code `dpl_2ZDx8Wj8Mi1NHExFLLbbFTaeyEab` est READY.

Preuve en cours : `docs/capacites/proofs/CAP-003-2026-08-11.md`.

## Prochain geste exact

1. attendre le dernier preview documentaire READY ;
2. comparer `cursor` et `cap/003-profil-capacites` ; exiger ahead-only / behind=0 ;
3. fast-forward `cursor` avec `force:false` ;
4. attendre production READY ;
5. demander un seul test utilisateur sur `dgafrique.com` : ouvrir **Mon profil de capacités**, saisir quelques données, enregistrer, revenir à Mon espace et vérifier qu'elles apparaissent ;
6. vérifier logs runtime + Supabase et confirmer qu'un profil DG n'a pas créé d'adhésion ZUMRA ;
7. si vert : CAP-003 `VALIDÉ PROD`, docs de clôture, puis CAP-004 `EN SPEC`.

## Architecture à préserver

- GAMAD Core = autorité canonique identité/authentification ;
- Supabase/PostgreSQL = données métier ;
- Supabase Auth historique = admin/CMS, pas identité membre ;
- DG Afrique = portail/orchestrateur ;
- satellites autonomes ;
- ne pas modifier GamaDrive sans autorisation spécifique ;
- pas de force push ; pas de secret dans docs/messages/logs.

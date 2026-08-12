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
- **CAP-002 — COMPTE DG AFRIQUE : VALIDÉ PROD.**
- **CAP-003 — PROFIL DE CAPACITÉS : VALIDÉ PROD.** Preuve `docs/capacites/proofs/CAP-003-2026-08-11.md`.
- **CAP-004 — COMPÉTENCES : EN SPEC, seul gate actif.**
- CAP-005 à CAP-084 : BLOQUÉS.

## CAP-003 — clôture production

Architecture finale : profil métier DG indépendant de ZUMRA dans `public.dg_person_profiles`, PK `core_identity_reference` GAMAD Core, RLS active, aucune FK vers `zumra_memberships`, backfill du profil historique, aucun compte/identité parallèle.

Fichiers principaux :

- `src/lib/profile/capability-profile.ts` ;
- `src/app/api/genesis/profile/route.ts` ;
- `src/app/(public)/espace/profil/page.tsx` ;
- `src/components/profile/capability-profile-form.tsx` ;
- `src/components/genesis/account-space.tsx` ;
- `src/components/superapp/home/member-home.tsx` ;
- ponts ZUMRA `/api/zumra/me` et `/api/zumra/enroll`.

Invariants :

- session Core live requise ;
- identité imposée par `session.entity` ;
- mutation same-origin ;
- profil DG ≠ adhésion/consentement ZUMRA ;
- intentions libres DG séparées des intentions ZUMRA ;
- aucun score/percentage de valeur personnelle.

Production : commit `59009d5450c7e00ff7cf7583d8e1e530103a6158`, Vercel `dpl_jS8o3KuFG7WyvEMHWBiz3KXYDxnu` READY, **27/27 tests**, build Next.js/lint/types/génération 102/102 verts.

Validation utilisateur 2026-08-12 00:22 UTC : **« profil enregistré et visible »**.

**CAP-003 est fermé.**

## CAP-004 — définition V0.1

### Finalité

Permettre à une personne de déclarer et d'enrichir ce qu'elle sait faire.

### Capacité

DG Afrique peut enregistrer des compétences issues de l'expérience, de la pratique, d'une formation ou d'autres formes de preuve.

### Points clés

- une compétence n'exige pas automatiquement un diplôme ;
- exemples du référentiel : développement web, agriculture, commerce, soudure, comptabilité, design, mécanique, gestion de projet.

### Garde-fou

Le système doit reconnaître plusieurs chemins d'acquisition d'une compétence.

## Frontière CAP-004

CAP-004 doit approfondir la liste simple `skills` introduite par CAP-003 sans absorber :

- CAP-005 APPRENTISSAGE ;
- CAP-006 TRANSMISSION ;
- CAP-023 graphe des capacités ;
- CAP-035 mémoire d'expérience ;
- CAP-036 preuve de capacité ;
- CAP-060 réputation.

À auditer avant conception : stockage actuel `dg_person_profiles.skills`, usages dans Mon profil, Mon espace, ZUMRA, recommandations éventuelles et tout modèle de compétences déjà présent dans le dépôt.

## Prochain geste exact

1. créer la branche `cap/004-competences` depuis `cursor` après clôture documentaire CAP-003 ;
2. créer `docs/capacites/specs/CAP-004-competences.md` ;
3. auditer tous les usages de `skills` et modèles de compétences existants ;
4. décider le modèle minimal structuré CAP-004 sans créer de scoring ni dépendance au diplôme ;
5. implémenter, tester, preview, production, validation ;
6. seulement après `VALIDÉ PROD`, ouvrir CAP-005.

## Architecture à préserver

- GAMAD Core = autorité canonique identité/authentification ;
- Supabase/PostgreSQL = données métier ;
- Supabase Auth historique = admin/CMS, pas identité membre ;
- DG Afrique = portail/orchestrateur ;
- satellites autonomes ;
- ne pas modifier GamaDrive sans autorisation spécifique ;
- ne pas modifier GAMAD Core sans autorisation spécifique ;
- pas de force push ; pas de secret dans docs/messages/logs.

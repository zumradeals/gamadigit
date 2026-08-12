# Historique durable du chantier CAP

Ce journal conserve les décisions et preuves nécessaires pour reprendre le chantier sans dépendre d'une conversation précédente. Les dossiers de preuve de chaque CAP contiennent le détail technique complet.

## 2026-08-09 — Recentrage DG Afrique V1

- Laravel V2 abandonné comme trajectoire produit active.
- `zumradeals/gamadigit` devient l'application DG Afrique canonique.
- Le référentiel `DG_Afrique_Referentiel_Final_84_Capacites_V0.1` est la constitution fonctionnelle.
- Les 84 capacités sont indexées dans `CAPABILITY-INDEX.md`.
- Architecture : DG Afrique portail/orchestrateur ; GAMAD Core identité/auth ; Supabase/PostgreSQL données métier ; satellites autonomes.

## 2026-08-09 — Gate CAP séquentiel

Décision dirigeant : CAP-001 → CAP-084, un seul gate actif. Un CAP futur peut avoir du code préexistant mais ne compte pas comme validé tant que son tour officiel n'est pas passé par spec, dev, tests, production et validation.

Création de `CAP-PRODUCTION-GATE.md`, `CAP-MASTER-TRACKER.md`, `AI-HANDOFF.md`, dossiers `specs/` et `proofs/`.

## 2026-08-10 — Incident SSO GamaDrive clos

Incident : après déconnexion DG, une session GamaDrive pouvait rester utilisable.

Dépendances déployées : Core PR #81/#82, GamaDrive PR #3/#4 et front-channel DG. Le scénario réel `DG → GamaDrive → DG logout → accès direct GamaDrive` a finalement été validé. Cette preuve ne valide pas les CAP satellites futurs.

## 2026-08-10 — CAP-001 IDENTITÉ PERSONNE

- GAMAD Core confirmé comme autorité canonique.
- `session.entity` retenu comme point d'attache stable.
- Supabase métier n'est pas une identité membre parallèle.
- Cookie portail signé, expiration contrôlée, distinction 401 / panne transitoire.
- preview final `dpl_5n97En7V4aDEeSTKgBdwzc6YPc56` READY ; production `dpl_7pSY1rsS2x8EbhcNym1He1nHCZYx` READY ; validation utilisateur **« Mon espace OK »**.

**CAP-001 → VALIDÉ PROD.** Preuve : `docs/capacites/proofs/CAP-001-2026-08-10.md`.

## 2026-08-10 → 2026-08-11 — CAP-002 COMPTE DG AFRIQUE

Source V0.1 : compte DG gratuit ; création, vérification, connexion et entrée dans Mon espace ; compte distinct de l'adhésion ZUMRA ; porte d'accès et non adhésion automatique.

Corrections majeures : contrat renvoi, `?next=` sûr, reprise vérification bornée, conservation des références, 429 login, contrat Core `GET /api/v1/sessions/current`, renouvellement du cookie uniquement à l'`expire_le` attesté.

Core PR #83 fusionnée/déployée, main `67b2ca74c7b4e9e510d1bb4a0fa5f094e56d952b`.

Tests production réels : connexion, Mon espace, déconnexion, `next=/formations`, utilisateur déjà connecté, création + email + vérification + première connexion.

Incident GamaDrive découvert : ancien cookie `dgafrique_federation_return` repris avec une nouvelle identité. Correctifs : effacement après création/déconnexion et `prefetch={false}` sur le lien GamaDrive. Validation finale utilisateur : **« Mon espace DG OK »**.

Production finale : commit `da39eb0dc7a2916c464e3e652591426fd7182535`, Vercel `dpl_FwwqzsHCSyccApqPS5DhfBPHGuAH` READY, 18/18 tests.

### Décision de profondeur de validation

Le dirigeant a demandé de préserver le sens de DG Afrique et d'éviter une quête de perfection interminable sur 84 capacités. Règle adoptée : parcours principal réel + invariants sécurité/données critiques + tests utiles + production verte suffisent ; raffinements/cas rares vont au backlog.

**CAP-002 → VALIDÉ PROD.** Preuve : `docs/capacites/proofs/CAP-002-2026-08-10.md`.

## 2026-08-11 — CAP-003 PROFIL DE CAPACITÉS

### Source / limite

Finalité : décrire une personne par ce qu'elle sait faire, souhaite apprendre et cherche à accomplir. Le profil devient une source structurée de capacités, utile à l'orientation, sans réduire la personne à un score.

CAP-004 compétences, CAP-005 apprentissage, CAP-023/024 graphe/profil-source, CAP-026 intentions et les moteurs de matching restent hors périmètre.

### Audit

Le profil existant était stocké dans `zumra_member_profiles`, dont `core_identity_reference` est FK vers `zumra_memberships`. Un profil ne pouvait donc exister qu'avec une adhésion ZUMRA : contradiction avec CAP-003.

### Décision architecture

Création de `public.dg_person_profiles` :

- PK = `core_identity_reference` GAMAD Core ;
- aucune FK vers ZUMRA ;
- RLS activée ;
- migration additive ;
- backfill des profils ZUMRA existants ;
- aucun compte/identité parallèle.

Migration `20260811234000_dg_person_profiles.sql` appliquée au Supabase production `gamadigit`. Contrôle live : table présente, RLS, PK Core, aucune FK ZUMRA, 1 profil historique repris au moment du contrôle.

### Implémentation

- API indépendante `/api/genesis/profile` ;
- page `/espace/profil` et formulaire DG ;
- Mon espace charge le profil DG séparément de `/api/zumra/me` ;
- GET/PATCH profil valident la session courante auprès du Core et renouvellent le cookie uniquement à l'échéance attestée ;
- PATCH same-origin, identité imposée par `session.entity` ;
- champs non édités préservés ;
- ZUMRA peut réutiliser des champs partagés seulement dans un vrai contexte d'adhésion ;
- les intentions libres DG ne sont pas écrasées par les intentions contrôlées ZUMRA ;
- suppression du pourcentage de complétude visible : aucune personne n'est transformée en score.

### Tests avant promotion

Head code `543bd401c4dc0609f2d88c43ed64fc21600ae04a` : **27/27 tests verts** ; compilation Next.js réussie. Preview code `dpl_2ZDx8Wj8Mi1NHExFLLbbFTaeyEab` READY.

Preuve : `docs/capacites/proofs/CAP-003-2026-08-11.md`.

### Gate actuel

**CAP-003 → EN DEV**, attente promotion production + un test utilisateur simple du parcours profil. **CAP-004 reste BLOQUÉ.**

## Format des prochaines entrées

Pour chaque CAP : Spec, Dev, Tests, Preview, Prod, Validation, Handoff.

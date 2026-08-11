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

Création de :

- `CAP-PRODUCTION-GATE.md` ;
- `CAP-MASTER-TRACKER.md` ;
- `AI-HANDOFF.md` ;
- dossiers `specs/` et `proofs/`.

## 2026-08-10 — Incident SSO GamaDrive clos

Incident : après déconnexion DG, une session GamaDrive pouvait rester utilisable.

Dépendances déployées : Core PR #81/#82, GamaDrive PR #3/#4 et front-channel DG. Le scénario réel `DG → GamaDrive → DG logout → accès direct GamaDrive` a finalement été validé. Cette preuve ne valide pas les CAP satellites futurs.

## 2026-08-10 — CAP-001 IDENTITÉ PERSONNE

### Spec / Dev

- GAMAD Core confirmé comme autorité canonique.
- `session.entity` retenu comme point d'attache stable.
- Supabase métier n'est pas une identité membre parallèle.
- Cookie portail signé, expiration contrôlée, distinction 401 / panne transitoire.

### Tests / Prod

- preview final `dpl_5n97En7V4aDEeSTKgBdwzc6YPc56` READY ;
- commit applicatif `76e4d1266f7ad4a1ca4772292145d8e138e69747` ;
- production `dpl_7pSY1rsS2x8EbhcNym1He1nHCZYx` READY ;
- validation utilisateur : **« Mon espace OK »**.

### Décision

**CAP-001 → VALIDÉ PROD.**

Preuve : `docs/capacites/proofs/CAP-001-2026-08-10.md`.

## 2026-08-10 → 2026-08-11 — CAP-002 COMPTE DG AFRIQUE

### Spec

Source V0.1 : compte DG gratuit ; création, vérification, connexion et entrée dans Mon espace ; compte distinct de l'adhésion ZUMRA ; porte d'accès et non adhésion automatique.

### Écarts trouvés et corrigés

- payload de renvoi obsolète → `{identifiant_reference,destination}` ;
- `?next=` perdu → chemin local sûr conservé ;
- vérification interrompue → dossier local borné sans mot de passe/code ;
- `VERIFICATION_NON_LIVREE` → références du même compte conservées ;
- 429 login → message spécifique ;
- cookie DG figé alors que Core glisse la session → contrat Core `GET /api/v1/sessions/current` + renouvellement uniquement à l'`expire_le` attesté.

### Dépendance Core

Core PR #83 fusionnée et déployée :

- source préparée `bdab8968a1045a005a61ee309cd2b77b91a6e087` ;
- main final `67b2ca74c7b4e9e510d1bb4a0fa5f094e56d952b` ;
- `GET /api/v1/sessions/current` live ;
- tests Core session/auth verts ;
- health live PRET.

### Promotion DG initiale

Après tests et intégration Core live, la branche `cap/002-compte-dg-afrique` a été fast-forward vers `cursor` sans force. Production READY et premières validations réelles :

- connexion → 200 ;
- `/api/genesis/account/me` → 200 ;
- déconnexion → 200 ;
- `next=/formations` → destination correcte ;
- utilisateur déjà connecté → redirigé vers Mon espace.

### Nouveau compte réel et incident GamaDrive

Un second compte réel a été créé ; l'email de vérification a été reçu, le compte vérifié et la connexion réussie.

Incident observé : après connexion, ce nouveau compte a été envoyé automatiquement vers GamaDrive.

Cause : un ancien cookie `dgafrique_federation_return` provenant d'une intention satellite précédente était repris par `/espace` avec la nouvelle identité.

Corrections :

- création d'un nouveau compte efface l'ancienne intention satellite ;
- déconnexion efface aussi cette intention ;
- lien GamaDrive dans Mon espace utilise `prefetch={false}` pour qu'aucune ouverture technique ne parte avant un clic explicite.

Validation utilisateur après correction : **« Mon espace DG OK »**.

### Production finale CAP-002

- commit DG final : `da39eb0dc7a2916c464e3e652591426fd7182535` ;
- Vercel production : `dpl_FwwqzsHCSyccApqPS5DhfBPHGuAH` — READY ;
- **18 tests / 18 pass / 0 fail** ;
- compilation Next.js, lint/types et génération statique verts ;
- aliases `dgafrique.com` et `www.dgafrique.com` actifs.

### Décision de profondeur de validation

Le dirigeant a demandé de préserver le sens de DG Afrique et d'éviter une quête de perfection qui rendrait les 84 capacités interminables.

Règle adoptée : un CAP peut être validé lorsque son **parcours principal réel**, ses **invariants sécurité/données critiques**, ses **tests automatisés utiles** et sa **production** sont verts. Les raffinements et cas rares non bloquants restent au backlog d'amélioration continue.

Le re-test manuel spécifique `reload vérification + renvoi d'un second code` est donc laissé au backlog ; les contrats associés sont couverts automatiquement.

### Décision

**CAP-002 — COMPTE DG AFRIQUE → VALIDÉ PROD.**

Preuve : `docs/capacites/proofs/CAP-002-2026-08-10.md`.

**CAP-003 — PROFIL DE CAPACITÉS → EN SPEC**, seul gate actif. CAP-004 à CAP-084 restent BLOQUÉS.

## 2026-08-11 — Ouverture CAP-003 PROFIL DE CAPACITÉS

Source V0.1 :

- Finalité : décrire une personne par ce qu'elle est capable de faire, ce qu'elle souhaite apprendre et ce qu'elle cherche à accomplir.
- Le profil doit devenir une source structurée de capacités plutôt qu'une simple fiche biographique.
- Points clés : identité/localisation, activité actuelle, compétences existantes, compétences recherchées, domaines d'intérêt et intentions.
- Garde-fou : le profil sert l'orientation sans réduire la personne à un score.

Limite initiale : CAP-003 doit structurer le profil mais ne doit pas absorber la sémantique complète de CAP-004 COMPÉTENCES, CAP-005 APPRENTISSAGE, CAP-026 INTENTION ni les futurs CAP du graphe.

## Format des prochaines entrées

Pour chaque CAP, documenter au minimum :

- **Spec** — finalité, limites et contradictions résolues ;
- **Dev** — branche, commits, fichiers ;
- **Tests** — scénarios et résultats ;
- **Preview** — déploiement et contrôle ;
- **Prod** — commit, déploiement et preuve ;
- **Validation** — parcours principal + garde-fous critiques ;
- **Handoff** — prochain geste exact.

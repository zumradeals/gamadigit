# AI HANDOFF — DG Afrique

> **Lire ce fichier avant toute modification.** Il doit permettre à une autre IA de reprendre sans la conversation.

## 1. Projet canonique

- Dépôt : `zumradeals/gamadigit`
- Production : branche `cursor`, `https://dgafrique.com`
- Stack : Next.js 15, React 19, TypeScript, Tailwind, Supabase/PostgreSQL, GAMAD Core, GeniusPay.
- Laravel V2 n'est plus la trajectoire active.

## 2. Loi du chantier

Progression obligatoire **CAP-001 → CAP-084**, un seul CAP actif.

Avant toute action : lire `docs/capacites/CAP-MASTER-TRACKER.md`, `CAP-PRODUCTION-GATE.md`, la fiche et le dossier de preuve du CAP actif. Aucun CAP N+1 n'est ouvert avant `VALIDÉ PROD` de N. Un écran/API déjà présent pour un CAP futur reste préexistant/non validé.

Toujours finir une session en mettant à jour la fiche, le dossier de preuve, `CAP-HISTORY.md`, `CAP-MASTER-TRACKER.md` et ce handoff.

## 3. État officiel

### CAP-001 — IDENTITÉ PERSONNE

**VALIDÉ PROD.**

- commit applicatif : `76e4d1266f7ad4a1ca4772292145d8e138e69747`
- preview : `dpl_5n97En7V4aDEeSTKgBdwzc6YPc56` READY
- production : `dpl_7pSY1rsS2x8EbhcNym1He1nHCZYx` READY
- validation utilisateur : `Mon espace OK`
- preuve : `docs/capacites/proofs/CAP-001-2026-08-10.md`

À préserver : Core est l'autorité canonique personne ; `session.entity` est le point d'attache ; Supabase métier n'est pas une seconde identité membre ; 401 Core invalide le cookie ; panne non-401 conserve la session.

### CAP-002 — COMPTE DG AFRIQUE

**EN DEV — seul gate actif.**

- branche : `cap/002-compte-dg-afrique`
- fiche : `docs/capacites/specs/CAP-002-compte-dg-afrique.md`
- preuve en cours : `docs/capacites/proofs/CAP-002-2026-08-10.md`
- CAP-003 à CAP-084 : **BLOQUÉS**.

Référentiel V0.1 : compte gratuit, création, vérification, connexion, entrée dans Mon espace ; compte distinct de ZUMRA ; porte d'accès et non adhésion automatique.

## 4. CAP-002 — audit Core confirmé

Core main :

- `POST /v1/comptes` : création gouvernée par produit ; password min 6 ; EMAIL/TELEPHONE vérification requise ;
- `POST /v1/comptes/verifications` : consommation du défi du même produit ;
- `POST /v1/comptes/verifications/renvoi` : **contrat `{identifiant_reference,destination}`**, 60 s minimum, 5 émissions/h ;
- EMAIL non vérifié ne peut pas servir à `resoudrePourAuthentification` ;
- `POST /v1/sessions` : ouverture ;
- `DELETE /v1/sessions/current` : fermeture ;
- `Ctr16` : session 8 h d'inactivité glissantes, plafond absolu 30 jours.

Le Core livre le code de vérification au canal humain et ne renvoie pas le code brut au navigateur via DG.

## 5. CAP-002 — corrections DG déjà faites sur la branche

Commits principaux :

- `c1b3ddd3b4089b52bc04f2a523912d9ef30d6d98` — spec/audit ;
- `c6d3d73eac6455ac9dbe7b0f7f14910a451b1a46` — tracker EN DEV ;
- `4cb95b0cf4291e5641d59608bc22c6deb7587718` + `c5eb890548bf0867fa4056ef9972aabd31abcc8f` — `account-flow.ts` ;
- `ed8cc628760f7c15a2f729ffddeaad7918ca69c1` — `account.ts` aligné Core ;
- `2586ca1feae0696beb6dc47e51758ca59000642b` — récupération du cas `VERIFICATION_NON_LIVREE` ;
- `b1f69f22f02e00bb91c6eb79b136cc5f9581fe9d` — renvoi aligné ;
- `4faf442fdd8ea69dfc4468754d6efc91f8310bfa` — `next` local sûr ;
- `a62be11764c74a8da539cb8fdf086d1468824fac` — UI reprise de vérification ;
- `d08e31d7199d6502a30ddb46f7739b283bb95e37` — 429 connexion ;
- `ed75255b274f48c93b83252e466475fe3cac3d6f` — tests CAP-002.

Comportements :

1. renvoi Core avec `{identifiant_reference,destination}` ;
2. `?next=` repris uniquement s'il est un chemin local sûr ;
3. dossier de vérification reprenable après reload dans `localStorage`, sans password/code, borné 7 jours ;
4. ancien code expiré peut être remplacé par renvoi sans recréer le compte ;
5. `VERIFICATION_NON_LIVREE` conserve les références du compte déjà créé ;
6. 429 login présenté comme trop de tentatives.

## 6. Preview DG actuel

Head code : `ed75255b274f48c93b83252e466475fe3cac3d6f`.

Vercel : `dpl_FvNxDXp32TjpUnvTHhbNAP9focvW` — **READY**.

Build : `npm test && next build` ; **13 tests / 13 pass / 0 fail** ; compilation, lint/types et génération 101/101 verts.

**Ne pas promouvoir vers `cursor` maintenant.** Un bloqueur Core reste ouvert.

## 7. BLOQUEUR — session Core glissante vs cookie DG

DG fixe actuellement le cookie HttpOnly à l'`expire_le` reçu lors du `POST /sessions` initial. Le Core, lui, prolonge `expire_le` lors de chaque `verifierSession()` valide, jusqu'à 30 jours. `AuthentifierApi` ne transmet pas l'échéance rafraîchie aux contrôleurs/au produit.

Donc le navigateur DG peut supprimer son cookie à l'échéance initiale (~8 h) alors que la session Core a été prolongée. **Ne jamais fabriquer une nouvelle date côté DG.**

Contrat Core minimal requis : après authentification valide, exposer l'`expire_le` courant attesté, par exemple via `GET /sessions/current`, un en-tête authentifié, ou une primitive officielle équivalente. DG renouvellera son cookie au maximum jusqu'à cette échéance attestée, jamais au-delà. Aucun nouveau token/compte/identité parallèle.

Ce point doit être traité dans le chantier Core/Claude ou résolu par une primitive Core déjà officielle. Ne pas modifier GamaDrive dans ce chantier.

## 8. Message technique à transmettre au chantier Core

« CAP-002 DG Afrique audite la cohérence de session. Core Ctr16 glisse désormais l'expiration de 8 h d'inactivité jusqu'au plafond 30 jours, mais DG ne reçoit `expire_le` qu'au POST `/sessions` initial. `AuthentifierApi` appelle `verifierSession()` puis n'expose que entity/assurance/session, donc le cookie HttpOnly DG reste fixé à l'ancienne échéance et peut disparaître alors que Core a prolongé la session. Merci d'identifier d'abord s'il existe déjà une primitive officielle pour lire l'échéance courante. Sinon, implémenter le contrat minimal authentifié et non secret qui expose l'`expire_le` courant après vérification valide (GET `/sessions/current`, header ou équivalent), avec tests et preuve de déploiement. Ne pas créer une nouvelle session ni un second token. DG ne renouvellera son cookie qu'à l'échéance attestée par Core. »

## 9. Prochaine action exacte

1. attendre le résultat du chantier Core ci-dessus ;
2. auditer la sémantique exacte livrée ;
3. intégrer le rafraîchissement de cookie DG sans dépasser `expire_le` Core ;
4. ajouter tests CAP-002 de renouvellement borné ;
5. mettre à jour fiche/preuve/historique ;
6. final preview READY ;
7. tests navigateur : création, vérification, reload, renvoi, connexion, `next`, déjà connecté, logout ;
8. fast-forward `force:false` seulement après diff sûr ;
9. production READY + logs + validation utilisateur ;
10. seulement alors CAP-002 → VALIDÉ PROD et CAP-003 → EN SPEC.

## 10. SSO GamaDrive — incident clos, hors gate actuel

GamaDrive est le seul satellite réel raccordé. Core PR #81/#82, GamaDrive PR #3/#4 et front-channel DG sont en production. Test utilisateur central logout réussi. Cette preuve ne valide pas CAP-018/049/051/074.

## 11. Discipline

- jamais de secret dans docs/logs/réponses ;
- ne jamais demander à l'utilisateur de coller un secret ;
- pas de force push ;
- branche → preview READY → compare → fast-forward sans force → prod READY → preuves ;
- une preuve d'un CAP ne valide jamais un CAP futur par ricochet.

# Historique durable du chantier CAP

Ce journal doit être mis à jour à chaque étape significative : décision métier, modification de contrat, commit, preview, test, déploiement, validation production, incident ou rollback. Il sert de mémoire durable pour qu'une autre IA puisse reprendre le travail sans dépendre d'une conversation précédente.

## 2026-08-09 — Recentrage DG Afrique V1

- Laravel V2 abandonné comme trajectoire produit active.
- Le dépôt `zumradeals/gamadigit` devient l'application DG Afrique canonique.
- Le référentiel `DG_Afrique_Referentiel_Final_84_Capacites_V0.1` est conservé comme constitution fonctionnelle.
- Les 84 capacités sont indexées dans `CAPABILITY-INDEX.md`.
- Des fiches détaillées existaient déjà pour CAP-002, CAP-007, CAP-048, CAP-049, CAP-050, CAP-061, CAP-062 et CAP-074 ; elles restent à réauditer à leur tour.

## 2026-08-09 — Nouveau langage Super App

Travaux visibles déjà présents avant le gate séquentiel : accueil `/espace` orienté intentions et prochaine action, données réelles du compte/ZUMRA, adaptation progressive du design Claude vers Next.js/TSX et suppression progressive d'identifiants techniques dans les écrans.

Ces travaux existent mais ne constituent aucune validation rétroactive des CAP concernés.

## 2026-08-09 — Fédération GamaDrive

- DG Afrique possède un lanceur `/federation/continue/gamadrive`.
- Le parcours DG Afrique → GAMAD Core → GamaDrive a été testé manuellement avec succès pour l'entrée.
- DG Afrique reste la porte d'accès ; le satellite appartient à un chantier séparé.
- Principe produit : une seule porte visible de connexion/déconnexion pour l'écosystème.

Sous le gate séquentiel, les CAP satellites restent BLOQUÉS jusqu'à leur tour officiel.

## 2026-08-09 — Correction de session portail

- `Mon espace` réaligné sur `/espace`.
- Un utilisateur déjà authentifié ne doit pas repasser inutilement par la connexion.
- Une panne transitoire du Core ne doit pas supprimer la session ; un vrai `401` reste le signal d'invalidation.

Ces comportements seront formellement repris sous CAP-001/CAP-002.

## 2026-08-09 — Refonte ZUMRA préexistante

Écrans déjà présents : `/espace/zumra`, paiement initial, réseau, détail groupe, invitation. Les groupes réels de l'utilisateur sont utilisés ; aucun catalogue public fictif n'est inventé.

Ces écrans restent préexistants / non validés jusqu'au tour de leurs CAP.

## 2026-08-09 — Instauration du gate CAP séquentiel

Décision dirigeant :

> Tous les CAP doivent être menés et documentés. Tant qu'un CAP n'est pas VALIDÉ PROD, on n'avance pas au suivant. L'historique doit permettre à une autre IA de reprendre le chantier en cas d'indisponibilité.

Actions :

- création de `CAP-PRODUCTION-GATE.md` ;
- création de `CAP-MASTER-TRACKER.md` couvrant CAP-001 à CAP-084 ;
- tous les CAP futurs marqués BLOQUÉS ;
- CAP-001 défini comme seul gate actif ;
- création de `AI-HANDOFF.md` et de la fiche CAP-001.

État initial du verrouillage : production applicative sur `cursor`, commit `d906d8a721a9193e326fbfe57159c2ce9d494b07`, déploiement Vercel `dpl_BVvMA4xfg1raB4naN4hK3nPp9fwx` READY.

## 2026-08-10 — Incident SSO : déconnexion centrale non propagée à GamaDrive

### Incident

Test navigateur réel : après déconnexion de DG Afrique, une session locale GamaDrive restait utilisable. La fédération d'entrée était correcte ; la propagation de sortie ne l'était pas.

Une première correction GamaDrive ajoutait une revérification périodique Core mais laissait une fenêtre d'environ 120 secondes. Le test immédiat a donc continué d'échouer.

### Dépendances externes déployées

- Core PR #81 : revérification de session centrale liée ;
- GamaDrive PR #3 : middleware fédéré sur toutes les routes authentifiées + filet périodique ;
- Core PR #82 : `logout_url` gouverné dans l'environnement produit ;
- GamaDrive PR #4 : `GET /federation/deconnexion-centrale`, qui détruit la session locale puis repasse par DG Afrique.

### Correction DG Afrique

Branche `fix/front-channel-logout` :

- `e2757747d0035ba029ed5e1b8e5dd026d4ca767a` — lecture du `logout_url` PRODUCTION depuis le Core ;
- `8f8529f545065af282e49fd1c8e89952fb0264da` — exposition du registre local de satellites ;
- `adaf81dcde4e5f94336fa8ce7d7cc55f6ae2d8bd` — fermeture session centrale + retour du front-channel ;
- `d52287fcf24c63d4b480c28e716b91178633765c` — navigation navigateur vers le `nextLogoutUrl`.

Principes : aucune URL GamaDrive codée en dur dans la logique de logout ; URL lue du Core ; HTTPS sans credentials ; fermeture centrale fail-soft si registre indisponible.

### Preview / production

- preview applicatif `dpl_BAd48avZF3QuRH7WykKXjh67V9eu` — READY ;
- preview branche complète `dpl_Eqg6N7FZ7JJyF9kwrzP5t7C2G3Jy` — READY ;
- fast-forward `force:false` vers `cursor` ;
- production `dpl_kPxMbRom8z9CeguAmiTjXVeNAgXv` — READY ;
- documentation ultérieure `75c722d735090484e1cdbea5f278cfa5984b21c3`, production `dpl_4kekTkZZQnfVBbLSnikqEkxGBBKb` — READY.

### Geste opérateur Core

L'environnement PRODUCTION de `PRD-GAMAD-002` a été déclaré par la voie gouvernée avec `logout_url = https://gamadrive.dgafrique.com/federation/deconnexion-centrale`. Produit ACTIF, fédération autorisée, journal opérationnel exécuté, aucune valeur secrète déclarée.

Il s'agissait de la première déclaration persistante de cet environnement ; aucune version précédente n'a été clôturée.

### Validation utilisateur finale SSO

Scénario : `connexion DG → GamaDrive → retour DG → déconnexion DG → accès direct immédiat GamaDrive`.

Résultat confirmé : **tout est OK** ; l'ancienne session GamaDrive ne survit plus. Incident SSO **CLOS**.

Cette preuve ne valide pas CAP-018/CAP-049/CAP-051/CAP-074.

## 2026-08-10 — CAP-001 : audit et finalisation technique

### Spec

- contrat Core `CAP-CORE-001 / CTR-01` audité ;
- Core conserve l'identité minimale/canonique, pas les profils métier ;
- Supabase Auth historique du CMS borné au plan de contrôle `/admin` ;
- limites clarifiées : CAP-002, CAP-003, CAP-018, CAP-051, CAP-052, CAP-053 restent hors scope.

### Audit données

Vérification des points d'attache métier existants : `zumra_memberships.core_identity_reference`, profil membre, groupes, membres, rôles, événements, paiements. `/api/zumra/me` utilise `session.entity`. Le client Supabase métier est serveur/service-role sans session utilisateur persistée.

Ces preuves ne valident aucun CAP métier ZUMRA futur.

### Dev

Branche `cap/001-finalize` issue de la production courante :

- `7efc07848c65cc1172217e67fe519b3d7b348681` — primitive testable de session portail ;
- `898e83cc7e387568b63fc140a29b3c390b9270e9` — `account.ts` utilise cette primitive ;
- `4634786f0439f46c7d063d64b17877a777de99c5` — tests intégrité/expiration cookie ;
- `040da4f0fd91c8f75f5b645d0bf28449bab752f6` — `npm test` obligatoire avant `next build` ;
- `378882e265944574d3118e3eb1f829035d07bdb9` — primitive de décision d'état d'identité ;
- `aaad39b3709fcaf634d1260be135d6c8ef8f9329` — `/api/genesis/account/me` relié à la décision 401/503 ;
- `549b5cb1c08defffd4b04283769c7d86501c914a` — tests 401 / panne transitoire ;
- `c6641509f583d3a35d69cf0d74d947f3877c20b2` — mémoire durable CAP-001 ;
- `76e4d1266f7ad4a1ca4772292145d8e138e69747` — relance du gate Vercel après cooldown et head final validé.

### Incident Vercel

Le premier head final a été marqué `failure` avec cible explicite `build-rate-limit`. Il ne s'agissait pas d'une erreur de code. L'ancien statut ne pouvant devenir vert tout seul, une nouvelle tentative réelle a été déclenchée après cooldown.

### Preview final

Déploiement `dpl_5n97En7V4aDEeSTKgBdwzc6YPc56` — **READY**.

Build : `npm test && next build`, tests CAP-001 exécutés, compilation réussie.

### Production finale CAP-001

Fast-forward `force:false` de `cap/001-finalize` vers `cursor` après comparaison `ahead=9`, `behind=0`.

Déploiement production `dpl_7pSY1rsS2x8EbhcNym1He1nHCZYx` — **READY**, aliases `dgafrique.com` et `www.dgafrique.com`, `aliasError=null`.

Logs de build : 8 tests, 8 pass, 0 fail, compilation Next.js réussie, lint/types réussis, déploiement complété.

### Contrôle production

Après déploiement, contrôle Vercel des erreurs runtime sur `/espace` et `/api/genesis/account/me` : aucune erreur runtime trouvée dans la fenêtre inspectée.

### Validation utilisateur finale CAP-001

**2026-08-10 11:58 UTC : « Mon espace OK »** après le déploiement final CAP-001.

### Décision

**CAP-001 — IDENTITÉ PERSONNE → VALIDÉ PROD.**

Toutes les preuves sont regroupées dans `docs/capacites/proofs/CAP-001-2026-08-10.md`.

**CAP-002 — COMPTE DG AFRIQUE → EN SPEC**, seul nouveau gate actif. CAP-003 à CAP-084 restent BLOQUÉS.

## 2026-08-10 — Note de staging documentaire

Lors de la préparation de la clôture documentaire, un fichier temporaire `.noop` a été créé par erreur sur `cursor` puis supprimé immédiatement. Aucun code, donnée, configuration ou comportement applicatif n'a été modifié. Cet incident de staging est conservé ici pour transparence et continuité IA.

## 2026-08-10 — CAP-002 : audit, corrections DG et preview technique

### Spec

Le référentiel V0.1 a été repris comme source : compte DG gratuit, création, vérification, connexion et entrée dans Mon espace ; compte distinct de l'adhésion ZUMRA ; porte d'accès et non adhésion automatique.

Contrats Core actuels audités : création de compte, vérification, renvoi, ouverture/fermeture de session, résolution des identifiants et durée de session.

Quatre écarts ont été identifiés :

1. payload DG de renvoi obsolète ;
2. `?next=` perdu après connexion ;
3. vérification en attente non reprenable après reload/fermeture ;
4. cookie DG figé à l'expiration initiale alors que la session Core glisse de 8 h d'inactivité jusqu'au plafond 30 jours.

### Dev DG

Branche `cap/002-compte-dg-afrique`.

Corrections effectuées :

- renvoi aligné au contrat Core `{identifiant_reference,destination}` ;
- retour après connexion borné à un chemin local sûr ;
- dossier de vérification local reprenable, sans password/code, borné 7 jours ;
- reprise du cas `VERIFICATION_NON_LIVREE` sur le même compte déjà créé ;
- mapping explicite du 429 de connexion ;
- tests CAP-002 dédiés.

Commits jusqu'au premier preview complet :

- `c1b3ddd3b4089b52bc04f2a523912d9ef30d6d98` — audit/spec ;
- `c6d3d73eac6455ac9dbe7b0f7f14910a451b1a46` — EN DEV ;
- `4cb95b0cf4291e5641d59608bc22c6deb7587718` — primitives compte ;
- `ed8cc628760f7c15a2f729ffddeaad7918ca69c1` — alignement Core ;
- `2586ca1feae0696beb6dc47e51758ca59000642b` — récupération livraison initiale échouée ;
- `b1f69f22f02e00bb91c6eb79b136cc5f9581fe9d` — renvoi ;
- `4faf442fdd8ea69dfc4468754d6efc91f8310bfa` — `next` sûr ;
- `c5eb890548bf0867fa4056ef9972aabd31abcc8f` — reprise bornée ;
- `a62be11764c74a8da539cb8fdf086d1468824fac` — UI ;
- `d08e31d7199d6502a30ddb46f7739b283bb95e37` — 429 ;
- `ed75255b274f48c93b83252e466475fe3cac3d6f` — tests.

### Tests / Preview

Preview Vercel `dpl_FvNxDXp32TjpUnvTHhbNAP9focvW` — **READY**.

Build : `npm test && next build` ; **13 tests / 13 pass / 0 fail** ; compilation Next.js réussie ; lint/types verts ; génération statique 101/101.

Les erreurs/cancel intermédiaires de commits plus anciens sont supersédées par ce head vert et ne constituent pas l'état courant.

### BLOQUEUR Core avant production

`Ctr16` prolonge réellement `expire_le` après chaque vérification de session valide. DG ne reçoit toutefois `expire_le` qu'au `POST /sessions` initial ; `AuthentifierApi` n'expose pas la nouvelle échéance. Le cookie HttpOnly DG peut donc expirer à la première échéance alors que Core a prolongé la session.

Décision : **ne pas fabriquer une expiration locale.** Demander au chantier Core d'identifier une primitive officielle existante ou de livrer un contrat minimal authentifié exposant l'`expire_le` courant attesté. DG renouvellera ensuite son cookie uniquement jusqu'à cette échéance.

**CAP-002 reste EN DEV. Aucune promotion `cursor` avant résolution, intégration et nouveau preview complet. CAP-003 reste BLOQUÉ.**

Dossier de preuve : `docs/capacites/proofs/CAP-002-2026-08-10.md`.

### Handoff

Prochain geste : chantier Core/Claude sur l'échéance courante de session ; puis intégration DG, tests de renouvellement borné, final preview, tests navigateur, production et validation utilisateur.

## 2026-08-10 — CAP-002 : contrat Core session courante préparé + raccord DG

### Vérification préalable Core

Claude a confirmé qu'aucune primitive Core officielle existante ne répondait au besoin du bearer Core courant. La vérification fédérée CAP-CORE-022 est bornée à un satellite/audience, lit l'expiration sans la faire glisser et ne remplace pas une primitive `sessions/current`.

### Contrat Core préparé

Commit Core `bdab896`, branche Claude dédiée :

`GET /api/v1/sessions/current` avec `Authorization: Bearer <jeton déjà ouvert>`.

Réponse 200 `no-store` : `entite`, `assurance`, `expire_le`; 401 si session absente/invalide/expirée/révoquée. `Ctr16::verifierSession()` retourne désormais l'`expire_le` réellement persisté après glissement ; `AuthentifierApi` transmet `gamad_expire_le` ; `SessionController::current()` expose le contrat. OpenAPI et documentation d'exploitation ont été mis à jour côté Core.

Preuves locales annoncées : 28 assertions `authentification_p3`, 8/8 `sessions_current_p1`, garde journal verte, OpenAPI/console/fédération verts. Un échec readiness matching/pgsql de `api_v1_p1` est déclaré préexistant sur `main` et reproduit sans les changements.

**État Core : implémenté/testé localement, mais non fusionné, non déployé VPS, aucune preuve live.**

### Raccord DG

Sur `cap/002-compte-dg-afrique` :

- `98f5fffd3f95b0bd649aad481474b32f9fa40df2` — primitive `renewPortalSessionFromAttestation()` ;
- `1c721a38dcfd32f87c409a644624ef248a30615a` — `readCurrentUserSession()` ;
- `117deab63b4ca1ef70b54d137d74ad557849f113` — `/api/genesis/account/me` renouvelle le cookie uniquement à l'échéance Core ;
- `4b9e8c882d6885632927f20a62efb9d5f4dfe1d7` — tests de bornage.

Garde : même identité, échéance future, jamais régressive. DG ne calcule jamais une prolongation locale.

### Preview DG

`dpl_AbwStXbszQuJtforAc7q2db9VC5a` — **READY** sur `4b9e8c882d6885632927f20a62efb9d5f4dfe1d7`.

Build : **16 tests / 16 pass / 0 fail**, `npm test && next build` vert, compilation/types verts.

### Gate

**CAP-002 reste EN DEV. CAP-003 reste BLOQUÉ.**

Interdiction de promouvoir DG tant que le Core live ne contient pas `GET /api/v1/sessions/current` et que le preview DG n'a pas été testé contre ce Core live.

Prochain geste : autorisation explicite du dirigeant pour fusion/déploiement Core `bdab896`, preuve checkout live, puis test d'intégration DG → Core avant production.

## Format obligatoire des prochaines entrées

Pour chaque CAP, documenter :

- **Spec** — décisions et contradictions résolues ;
- **Dev** — branche, commits, fichiers ;
- **Tests** — scénarios et résultats ;
- **Preview** — déploiement et contrôle ;
- **Prod** — commit, déploiement, route et preuve ;
- **Validation** — critères cochés et validation métier/utilisateur si nécessaire ;
- **Handoff** — prochain geste exact.

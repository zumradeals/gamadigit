# Historique durable du chantier CAP

Ce journal doit être mis à jour **à chaque étape significative** : décision métier, modification de contrat, commit, preview, test, déploiement, validation production, incident ou rollback.

Il sert de mémoire durable pour qu'une autre IA puisse reprendre le travail sans dépendre d'une conversation précédente.

## 2026-08-09 — Recentrage DG Afrique V1

- Laravel V2 abandonné comme trajectoire produit active.
- Le dépôt `zumradeals/gamadigit` devient l'application DG Afrique canonique à faire évoluer.
- Le référentiel `DG_Afrique_Referentiel_Final_84_Capacites_V0.1` est conservé comme constitution fonctionnelle.
- Les 84 capacités sont indexées dans `CAPABILITY-INDEX.md`.
- Premières fiches détaillées préexistantes : CAP-002, CAP-007, CAP-048, CAP-049, CAP-050, CAP-061, CAP-062, CAP-074.

## 2026-08-09 — Nouveau langage Super App

Travaux visibles déjà présents avant l'instauration du gate séquentiel :

- remplacement progressif de l'ancien tableau de bord par un accueil `/espace` orienté intentions et prochaine action ;
- utilisation de données réelles du compte et de ZUMRA ;
- adaptation progressive du design Claude vers Next.js/TSX ;
- suppression progressive d'identifiants techniques dans les écrans utilisateurs.

Ces travaux existent dans le produit mais **ne constituent pas une validation rétroactive** des CAP correspondants.

## 2026-08-09 — Fédération GamaDrive

- DG Afrique possède un lanceur fédéré `/federation/continue/gamadrive`.
- Le parcours production DG Afrique → GAMAD Core → GamaDrive a été testé manuellement avec succès pendant la session de travail.
- Le satellite GamaDrive appartient à un chantier séparé ; DG Afrique reste l'orchestrateur et la porte d'accès.
- Le principe produit retenu est une porte centrale de connexion/déconnexion, à la manière d'un compte commun donnant accès à plusieurs services.
- La terminologie interne `GAMAD` ne doit pas être exposée inutilement dans le portail utilisateur.

Sous le nouveau gate, les CAP satellites concernés restent BLOQUÉS jusqu'à leur passage séquentiel et devront être réaudités avec preuves enregistrées dans ce dépôt.

## 2026-08-09 — Correction de session portail

- L'entrée globale `Mon espace` a été réalignée sur `/espace`.
- Un utilisateur déjà authentifié ne doit pas être renvoyé vers un écran de connexion inutile.
- Une indisponibilité transitoire du Core ne doit pas supprimer la session portail ; un vrai `401` reste le signal de session invalide.

Ces comportements seront formellement audités lors des CAP identité/compte concernés.

## 2026-08-09 — Refonte ZUMRA déjà présente

Écrans refondus avant l'instauration du gate séquentiel :

- `/espace/zumra` : profil, parcours adhésion, paiement initial, accès réseau ;
- `/espace/zumra/reseau` : groupes réels de l'utilisateur et création ;
- `/espace/zumra/reseau/[id]` : progression 5 membres / 5 responsabilités, invitations et responsabilités ;
- `/espace/zumra/rejoindre/[token]` : acceptation d'invitation.

Aucun catalogue public de Zumra n'a été inventé : l'API actuelle expose les groupes de l'utilisateur et l'entrée par invitation.

Ces écrans restent **préexistants / à auditer** jusqu'au passage officiel de leurs CAP.

## 2026-08-09 — Instauration du gate CAP séquentiel

Décision du dirigeant :

> Tous les CAP doivent être menés et documentés. Tant qu'un CAP n'est pas VALIDÉ PROD, on n'avance pas au suivant. L'historique doit permettre à une autre IA de reprendre le chantier en cas d'indisponibilité.

Actions :

- création de `CAP-PRODUCTION-GATE.md` ;
- création de `CAP-MASTER-TRACKER.md` couvrant CAP-001 à CAP-084 ;
- tous les CAP futurs marqués BLOQUÉS ;
- CAP-001 défini comme seul gate actif ;
- création de `AI-HANDOFF.md` et de la fiche CAP-001.

### État au moment du verrouillage

- Branche production applicative : `cursor`.
- Dernier commit applicatif production avant la gouvernance CAP : `d906d8a721a9193e326fbfe57159c2ce9d494b07`.
- Déploiement production Vercel correspondant : `dpl_BVvMA4xfg1raB4naN4hK3nPp9fwx`, READY au moment de la vérification.
- Gate actif : **CAP-001 — IDENTITÉ PERSONNE**.

## 2026-08-10 — Incident SSO : déconnexion centrale non propagée à GamaDrive

### Incident

Le test navigateur réel a montré qu'après une déconnexion de DG Afrique, une session locale GamaDrive déjà ouverte restait utilisable. Le lancement fédéré d'entrée était correct ; la propagation de sortie ne l'était pas.

Une première correction côté GamaDrive liait sa session locale à la session Core et la revérifiait périodiquement, mais une fenêtre d'environ 120 secondes restait possible. Le test utilisateur immédiat a donc continué d'échouer et a empêché toute déclaration prématurée de succès.

### Dépendances externes déployées

- GAMAD Core PR #81 : contrat de revérification de session Core liée, déployé.
- GamaDrive PR #3 : middleware de session fédérée sur l'ensemble des routes authentifiées, avec revérification périodique comme filet de sécurité.
- GAMAD Core PR #82 : ajout de `logout_url` au registre des environnements produit, déployé ; URL HTTPS exigée en production.
- GamaDrive PR #4 : `GET /federation/deconnexion-centrale`, déployé ; détruit la session locale sans appel Core puis redirige vers le lanceur DG Afrique.

### Dev DG Afrique

Branche : `fix/front-channel-logout`.

Commits applicatifs :

- `e2757747d0035ba029ed5e1b8e5dd026d4ca767a` — lecture du `logout_url` PRODUCTION actif depuis le registre Core ;
- `8f8529f545065af282e49fd1c8e89952fb0264da` — exposition du registre local des satellites fédérés pour l'orchestration ;
- `adaf81dcde4e5f94336fa8ce7d7cc55f6ae2d8bd` — logout DG : fermeture session centrale + retour du front-channel ;
- `d52287fcf24c63d4b480c28e716b91178633765c` — navigation du navigateur vers `nextLogoutUrl`.

Principes préservés : pas d'URL GamaDrive codée en dur dans le logout, HTTPS sans credentials uniquement, fermeture centrale fail-soft si registre indisponible, un seul front-channel tant que GamaDrive est l'unique satellite réel.

### Preview et production DG

- Preview applicatif `dpl_BAd48avZF3QuRH7WykKXjh67V9eu` — READY.
- Preview branche complète `dpl_Eqg6N7FZ7JJyF9kwrzP5t7C2G3Jy` — READY.
- Fast-forward sans force vers `cursor`.
- Déploiement production `dpl_kPxMbRom8z9CeguAmiTjXVeNAgXv` — READY.
- Documentation ultérieure sur `cursor` : `75c722d735090484e1cdbea5f278cfa5984b21c3`, production `dpl_4kekTkZZQnfVBbLSnikqEkxGBBKb` — READY.

### Geste opérateur Core

L'autorité Core a déclaré par la voie gouvernée `AccesProduits::declarerEnvironnement()` l'environnement PRODUCTION de `PRD-GAMAD-002` avec :

- produit toujours ACTIF et fédérable ;
- audience `PRD-GAMAD-002` ;
- `logout_url = https://gamadrive.dgafrique.com/federation/deconnexion-centrale` ;
- journal `ENVIRONNEMENT_PRODUIT_DECLARE`, décision exécutée ;
- aucun secret dans les valeurs publiques déclarées.

Il s'agissait en réalité de la première déclaration d'environnement persistante pour ce produit ; aucune version précédente n'a donc été clôturée.

### Validation utilisateur finale — INCIDENT CLOS

Date : **2026-08-10**, vers **00:25 UTC**.

Scénario réel, même navigateur :

`connexion DG → ouverture GamaDrive → retour DG → déconnexion DG → accès direct immédiat GamaDrive`

Attendu : l'ancienne session locale GamaDrive n'est plus exploitable et l'utilisateur repasse par la porte DG Afrique.

Observé : **succès confirmé par l'utilisateur — « les tests ont marché tout est ok »**.

Conclusion : l'incident de déconnexion fédérée immédiate est **CLOS**. La revérification périodique GamaDrive reste un filet de sécurité. Cette clôture ne valide aucun CAP satellite futur ; CAP-018/CAP-049/CAP-051/CAP-074 restent BLOQUÉS.

## 2026-08-10 — CAP-001 : audit et finalisation technique

### Spec

- Contrat Core réel `CAP-CORE-001 / CTR-01` audité dans `Ctr01.php` et `Ctr01Controller.php`.
- Le Core conserve l'identité minimale et canonique ; il n'absorbe pas les profils/données métier des produits.
- Limites CAP-001 clarifiées : CAP-002, CAP-003, CAP-018, CAP-051, CAP-052 et CAP-053 restent hors scope et BLOQUÉS.
- Supabase Auth historique du CMS est documenté comme credential du plan de contrôle `/admin`, jamais comme identité membre ou point d'attache métier.

### Audit données

Points d'attache vérifiés dans les migrations existantes :

- `zumra_memberships.core_identity_reference` unique ;
- profil membre, groupes, membres, rôles, événements et paiements ZUMRA rattachés à la même référence Core ;
- `/api/zumra/me` requête avec `session.entity` ;
- client Supabase métier côté serveur en service role, sans persistance de session utilisateur Supabase.

Ces éléments prouvent uniquement la structure d'identité ; ils ne valident aucun CAP ZUMRA futur.

### Dev

Nouvelle branche propre issue de la production courante : `cap/001-finalize`.

Commits :

- `7efc07848c65cc1172217e67fe519b3d7b348681` — primitive testable de session portail ;
- `898e83cc7e387568b63fc140a29b3c390b9270e9` — `account.ts` utilise cette primitive ;
- `4634786f0439f46c7d063d64b17877a777de99c5` — tests d'intégrité/expiration du cookie ;
- `040da4f0fd91c8f75f5b645d0bf28449bab752f6` — `npm test` devient obligatoire avant `next build` ;
- `378882e265944574d3118e3eb1f829035d07bdb9` — sémantique explicite des erreurs d'identité ;
- `aaad39b3709fcaf634d1260be135d6c8ef8f9329` — `/api/genesis/account/me` utilise la primitive 401/503 ;
- `549b5cb1c08defffd4b04283769c7d86501c914a` — tests 401 / panne transitoire.

### Tests / Preview

- Les previews antérieurs à l'ajout final des tests étaient READY.
- Le head `549b5cb1c08defffd4b04283769c7d86501c914a` a reçu un statut Vercel `failure` dont la cible est explicitement `build-rate-limit`.
- Ce statut n'est pas interprété comme une erreur applicative, mais **aucune promotion n'est autorisée** sans un build final réellement exécuté et READY.

### Preuve durable

Dossier : `docs/capacites/proofs/CAP-001-2026-08-10.md`.

### Handoff

CAP-001 reste le seul gate actif, statut `EN DEV`. CAP-002 reste BLOQUÉ. Prochain geste : obtenir un preview final avec `npm test` + `next build`, puis production, puis compléter les critères restants avant toute validation.

## Format obligatoire des prochaines entrées

Pour chaque CAP, ajouter des sous-sections datées :

- **Spec** — décisions et contradictions résolues ;
- **Dev** — branche, commits, fichiers ;
- **Tests** — commandes/scénarios et résultats ;
- **Preview** — déploiement et contrôle ;
- **Prod** — commit, déploiement, URL/route et preuve ;
- **Validation** — critères cochés et validation métier si nécessaire ;
- **Handoff** — prochain geste exact.

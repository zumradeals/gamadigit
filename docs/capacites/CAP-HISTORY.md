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
- création de `AI-HANDOFF.md` et de la fiche CAP-001 prévue dans la même séquence documentaire.

### État au moment du verrouillage

- Branche production applicative : `cursor`.
- Dernier commit applicatif production avant la gouvernance CAP : `d906d8a721a9193e326fbfe57159c2ce9d494b07`.
- Déploiement production Vercel correspondant : `dpl_BVvMA4xfg1raB4naN4hK3nPp9fwx`, état READY au moment de la vérification.
- Gate actif : **CAP-001 — IDENTITÉ PERSONNE**.

## Format obligatoire des prochaines entrées

Pour chaque CAP, ajouter des sous-sections datées :

- **Spec** — décisions et contradictions résolues ;
- **Dev** — branche, commits, fichiers ;
- **Tests** — commandes/scénarios et résultats ;
- **Preview** — déploiement et contrôle ;
- **Prod** — commit, déploiement, URL/route et preuve ;
- **Validation** — critères cochés et validation métier si nécessaire ;
- **Handoff** — prochain geste exact.

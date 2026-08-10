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

## 2026-08-10 — Incident SSO : déconnexion centrale non propagée à GamaDrive

### Incident

Le test navigateur réel a montré qu'après une déconnexion de DG Afrique, une session locale GamaDrive déjà ouverte restait utilisable. Le lancement fédéré d'entrée était correct ; la propagation de sortie ne l'était pas.

Une première correction côté GamaDrive liait sa session locale à la session Core et la revérifiait périodiquement, mais une fenêtre d'environ 120 secondes restait possible. Le test utilisateur immédiat a donc continué d'échouer et a empêché toute déclaration prématurée de succès.

### Dépendances externes déployées

- GAMAD Core PR #81 : contrat de revérification de session Core liée, déployé. Il permet au satellite de détecter une session centrale révoquée sans recevoir son bearer.
- GamaDrive PR #3 : middleware de session fédérée sur l'ensemble des routes authentifiées, avec revérification périodique comme filet de sécurité.
- GAMAD Core PR #82 : ajout de `logout_url` au registre des environnements produit, déployé ; URL HTTPS exigée en production.
- GamaDrive PR #4 : `GET /federation/deconnexion-centrale`, déployé ; détruit la session locale sans appel Core puis redirige vers le lanceur DG Afrique.

Ces éléments appartiennent à leurs dépôts respectifs et ne valident aucun CAP DG futur sous le gate séquentiel.

### Dev DG Afrique

Branche : `fix/front-channel-logout`.

Commits :

- `e2757747d0035ba029ed5e1b8e5dd026d4ca767a` — lecture du `logout_url` PRODUCTION actif depuis le registre Core ;
- `8f8529f545065af282e49fd1c8e89952fb0264da` — exposition du registre local des satellites fédérés pour l'orchestration ;
- `adaf81dcde4e5f94336fa8ce7d7cc55f6ae2d8bd` — le logout DG ferme la session centrale, efface son cookie et retourne le prochain front-channel ;
- `d52287fcf24c63d4b480c28e716b91178633765c` — le navigateur suit le `nextLogoutUrl` Core-gouverné après déconnexion.

Principes :

- aucune URL de déconnexion GamaDrive codée en dur dans le flux de logout ;
- la valeur est lue dans le registre Core ;
- seuls les `logout_url` HTTPS sans credentials sont acceptés côté DG ;
- une panne/absence du registre n'empêche pas la fermeture de la session centrale ;
- GamaDrive étant le seul satellite réel raccordé, le flux ne chaîne actuellement qu'un front-channel ; un futur multi-satellite devra définir explicitement son chaînage avant activation.

### Preview

- Preview du code applicatif `d52287fcf24c63d4b480c28e716b91178633765c` : `dpl_BAd48avZF3QuRH7WykKXjh67V9eu` — READY.
- Preview de la branche complète, documentation incluse, `82559c872da4c2e28e7b75f476776272bac170aa` : `dpl_Eqg6N7FZ7JJyF9kwrzP5t7C2G3Jy` — READY.
- Comparaison avant promotion : branche `ahead=6`, `behind=0` par rapport à `cursor` ; fast-forward sans force.

### Prod

- `cursor` promu par fast-forward vers `82559c872da4c2e28e7b75f476776272bac170aa`.
- Déploiement Vercel production initial du correctif : `dpl_kPxMbRom8z9CeguAmiTjXVeNAgXv` — READY.
- Déploiement production courant vérifié après mises à jour documentaires : `dpl_4kekTkZZQnfVBbLSnikqEkxGBBKb` — READY, commit `75c722d735090484e1cdbea5f278cfa5984b21c3`.
- Build Next.js terminé sans erreur ; `/api/genesis/account/logout`, `/espace` et `/federation/continue/[satellite]` compilés.

La partie DG Afrique du canal front-channel est donc déployée. Elle reste volontairement fail-soft si le Core ne fournit aucun `logout_url` valide.

### Geste opérateur Core — terminé

L'autorité opérateur a déclaré l'environnement PRODUCTION de `PRD-GAMAD-002` par la voie gouvernée `AccesProduits::declarerEnvironnement()`, sous `AUT-GAMAD-001`, sans accès direct à la base.

Résultat rapporté et vérifié côté opérateur :

- `PRD-GAMAD-002` reste `ACTIF` et `federation_autorisee = 1` ;
- environnement PRODUCTION actif avec `api_base_url = https://gamadrive.dgafrique.com` ;
- `health_url = https://gamadrive.dgafrique.com/health` ;
- `logout_url = https://gamadrive.dgafrique.com/federation/deconnexion-centrale` ;
- `audience_federation = PRD-GAMAD-002` ;
- décision CAP-CORE-004 `PERMIS` ;
- journal opérationnel `ENVIRONNEMENT_PRODUIT_DECLARE`, décision `EXECUTEE` ;
- console/Core et services déclarés sains après l'opération ;
- aucun secret introduit dans les valeurs publiques déclarées.

Écart observé : il s'agissait de la première déclaration PRODUCTION persistée, donc aucune ancienne version n'a été clôturée. Cela ne change pas le contrat DG attendu : le registre porte désormais le `logout_url` actif requis.

### Validation navigateur encore requise

Tous les maillons techniques sont désormais en place. Il reste la preuve utilisateur finale :

`connexion DG → ouverture GamaDrive → déconnexion DG → accès direct immédiat à GamaDrive`.

Attendu : aucune session GamaDrive survivante ; le navigateur repasse par DG Afrique et requiert une nouvelle authentification centrale.

**Ne pas déclarer l'incident SSO clos avant ce test réel. CAP-001 reste le seul gate actif et n'est pas automatiquement VALIDÉ PROD par la résolution de cet incident.**

## Format obligatoire des prochaines entrées

Pour chaque CAP, ajouter des sous-sections datées :

- **Spec** — décisions et contradictions résolues ;
- **Dev** — branche, commits, fichiers ;
- **Tests** — commandes/scénarios et résultats ;
- **Preview** — déploiement et contrôle ;
- **Prod** — commit, déploiement, URL/route et preuve ;
- **Validation** — critères cochés et validation métier si nécessaire ;
- **Handoff** — prochain geste exact.

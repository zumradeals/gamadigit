# 04 — Reprise, archivage et frontière technique

## Référence historique figée le 11 novembre 2026

- Dépôt : `zumradeals/gamadigit`.
- Ancienne branche principale : `cursor` ; **aucune branche `main` avant cette refondation**.
- Point archivé : commit `3fc42be122958c5a0e242d4bce02d101ab31b8e7`.
- Arbre Git archivé : `37f6d72611c3c6d3fb5966928fb785ee67b1c985`.
- Branche d'archive complète : `archive/avant-boutique-autonome-2026-11-11`.
- Copie arborescente complète accessible sous `archives/legacy-2026-11-11/` dans le nouveau `main`.
- La branche `cursor` reste inchangée ; l'ancien déploiement doit rester isolé de la nouvelle branche.

## Inventaire de l'héritage identifié

**Potentiel de conservation après qualification :**
- structure de catégories, offres, fiches de logiciels et métadonnées ;
- notions de brouillon/publié/archivé et administration de catalogue ;
- mécanismes de publication, blog, sitemap, robots et SEO ;
- principes responsive, médias, formulaires et qualité CI.

**À exclure du nouveau produit actif :**
- portail institutionnel, réseaux et profils personnels de l'ancien produit ;
- authentification et comptes d'identité historiques ;
- fonctions transversales de l'ancienne super-application ;
- paiements ou données financiers d'activités sans lien avec cette boutique ;
- anciennes chartes, slogans, domaines et URLs publics.

**À reconstruire selon contrats propres :**
- panier, commandes et suivi commercial ;
- paiement et réconciliation ;
- délivrance numérique ;
- coûts et marges confidentiels ;
- assistance optionnelle et incidents.

## Règles de reprise

1. Archiver le projet complet avant toute suppression de l'arborescence de travail.
2. Ne pas importer directement des anciennes routes ou schémas tant que leurs dépendances n'ont pas été auditées.
3. Conserver l'ancien code **uniquement** en archive ; la nouvelle racine doit être autonome.
4. Migrer les données de catalogue seulement après validation de leur sémantique, de leurs droits et de leur qualité.
5. Ne pas réutiliser la base de données de production sans contrat de séparation et procédure de migration contrôlée.
6. Toute mise en production exige une qualification complète et une sauvegarde des données impliquées.
7. Ne pas basculer le domaine, les secrets, les paiements ou le déploiement de l'ancien système par une simple modification de branche.

## Limites du présent jalon

Le commit de refondation crée un **espace contractuel vierge** ; l'application exploitable sera construite ultérieurement. Ce dépôt n'est pas encore une boutique livrable. Ne pas activer de déploiement automatique pour `main` avant l'existence d'un produit testé.

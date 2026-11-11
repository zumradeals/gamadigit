# Registre de décisions — boutique autonome

Date de fondation : **2026-11-11**.

## Validées par le porteur de projet

- **DEC-001** — Nouvelle activité commerciale et nouvelle marque indépendantes de l'ancien portail.
- **DEC-002** — Positionnement **B : prix accessibles + accompagnement facultatif**.
- **DEC-003** — Plateforme **Mobile First**.
- **DEC-004** — Cibler d'abord la recherche et le marché **ivoiriens**.
- **DEC-005** — Réutiliser le dépôt `zumradeals/gamadigit` comme **héritage**, pas comme dépendance métier permanente.
- **DEC-006** — Archiver les anciens dossiers et fichiers avant leur remplacement ; conserver les briques utiles après audit.
- **DEC-007** — La boutique active ne fait partie d'aucun portail, réseau ou identité métier de l'ancien produit.

## Décisions d'architecture appliquées pour prévenir des pertes

- **ARCH-001** — L'ancien dépôt ne contenait pas `main` ; créer `main` pour la refondation et laisser `cursor` inchangée.
- **ARCH-002** — Figer un snapshot Git dans une branche d'archive et sous `archives/legacy-2026-11-11/`.
- **ARCH-003** — Démarrer avec des contrats et une racine neuve ; ne pas confondre documentation et application opérationnelle.
- **ARCH-004** — Aucun changement de domaine de production, d'identifiants, de base ou de déploiement à ce jalon.

## Non validées / à instruire

- Nom commercial (« LOGIBAS » évoqué auparavant **non validé**) et identité graphique.
- Domaine public et canaux de vente.
- Moyens de paiement, prestataires et logiques d'exécution.
- Catalogue de lancement exact et prix de vente.
- Arbitrages d'implémentation techniques.
- Règles fiscales, délais contractuels et modalités de retour.

Toute nouvelle décision doit préciser le contexte, la date, la portée, son statut et le contrat impacté.

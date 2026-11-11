# CAP-062 — LEDGER / TRAÇABILITÉ

- **Domaine :** Finance / Trust
- **Propriétaire d'exécution :** HYBRID
- **Statut :** principes présents ; intégration à préciser par flux

## Invariant

Chaque événement financier doit conserver au minimum : payeur/acteur, montant, devise, fournisseur, référence fournisseur, `purpose`, statut et dates. Les objets métier liés (adhésion, contribution, projet, service) doivent rester distinguables.

## Exigence ZUMRA

Une vue d'impact ne remplace jamais le ledger : toute affirmation « ce fonds a financé ce projet » doit pouvoir remonter à des écritures ou événements traçables.

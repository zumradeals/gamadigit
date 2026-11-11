# Capabilities — contrats de développement DG Afrique

Le document `DG_Afrique_Referentiel_Final_84_Capacites_V0.1` reste la **constitution fonctionnelle** : il décrit ce que le système doit pouvoir faire. Ce dossier transforme cette constitution en chantier séquentiel, testable et reprenable par une autre IA.

## Règle absolue de progression

DG Afrique avance **CAP-001 → CAP-084, un seul CAP à la fois**.

Un CAP n'autorise l'ouverture du suivant que lorsqu'il est marqué **`VALIDÉ PROD`** dans `CAP-MASTER-TRACKER.md`.

Du code peut déjà exister pour des CAP futurs. Ce code est considéré **préexistant / à auditer**, jamais automatiquement validé.

La procédure détaillée est dans `CAP-PRODUCTION-GATE.md`.

## Quand un CAP est-il prêt à être développé ?

Avant le développement, sa fiche doit préciser au minimum :

- finalité et invariants ;
- propriétaire métier et propriétaire d'exécution (`DG`, `CORE`, `SATELLITE`, `HYBRID`) ;
- objets et données ;
- états et transitions ;
- permissions / consentement ;
- API ou cas d'usage ;
- états UI ;
- événements et traçabilité ;
- critères d'acceptation testables ;
- dépendances et garde-fous.

Être « prêt à coder » ne signifie pas être « terminé ». Seul le gate production permet `VALIDÉ PROD`.

## Hiérarchie des sources

1. comportement réel déjà implémenté et testé ;
2. contrat GAMAD Core applicable ;
3. addenda métier de ce dossier ;
4. référentiel des 84 capacités V0.1 ;
5. design Claude comme représentation UX, jamais comme source de règle métier.

En cas de contradiction, on documente la décision ; on ne réinvente pas silencieusement la règle.

## Fichiers de pilotage obligatoires

- `CAPABILITY-INDEX.md` — registre constitutionnel des 84 capacités et domaine principal ;
- `CAP-MASTER-TRACKER.md` — **source de vérité du statut CAP-001 à CAP-084** ;
- `CAP-PRODUCTION-GATE.md` — conditions obligatoires avant de passer au CAP suivant ;
- `CAP-HISTORY.md` — historique durable : décisions, commits, tests, preview, prod, incidents, validations ;
- `OVERRIDES.md` — clarifications postérieures à V0.1 ;
- `TEMPLATE.md` — format minimal d'une fiche ;
- `specs/` — contrat détaillé du CAP actif et fiches préexistantes à réauditer à leur tour ;
- `../AI-HANDOFF.md` — point de reprise obligatoire pour toute autre IA.

## Gate actif

**CAP-001 — IDENTITÉ PERSONNE**.

Tant que CAP-001 n'est pas `VALIDÉ PROD`, CAP-002 et tous les suivants restent `BLOQUÉ`.

## Discipline de fin de session

Une session de travail n'est pas considérée terminée tant que :

1. `CAP-HISTORY.md` décrit ce qui a réellement changé ;
2. `CAP-MASTER-TRACKER.md` reflète le statut exact ;
3. `AI-HANDOFF.md` donne le prochain geste autorisé ;
4. la fiche du CAP actif contient les nouvelles preuves ou décisions.

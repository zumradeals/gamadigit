# CAP-002 — COMPTE DG AFRIQUE

- **Domaine :** Identity
- **Propriétaire d'exécution :** HYBRID — DG Afrique orchestre, GAMAD Core authentifie
- **Statut gate :** **EN SPEC**
- **Validation production :** NON
- **CAP précédent :** CAP-001 — **VALIDÉ PROD**
- **CAP suivant autorisé :** NON — CAP-003 reste BLOQUÉ

## État de départ

Cette fiche existait avant l'instauration du gate séquentiel. Du code de création de compte, vérification, connexion, session et espace membre existe déjà en production, mais **aucun de ces éléments n'est considéré validé CAP-002 tant que l'audit complet n'est pas terminé**.

## Invariants connus à réauditer

- Le compte DG Afrique est gratuit.
- Compte DG Afrique ≠ adhésion au Programme ZUMRA.
- L'identité canonique reste celle du GAMAD Core.
- DG Afrique peut conserver une session serveur/cookie signée, mais ne duplique pas le mot de passe Core.
- Une personne déjà connectée ne doit pas être renvoyée inutilement vers la connexion.
- Une panne transitoire du Core ne doit pas détruire une session encore valide.
- Une vraie session invalide doit ramener vers la porte de connexion.
- La création, vérification et connexion doivent rester une porte DG Afrique compréhensible, sans exposer la terminologie technique du Core.

## États UI à auditer

`visiteur → création ou connexion → vérification si nécessaire → connecté → Mon espace`

États particuliers : session expirée, identifiant non vérifié, erreur de livraison de vérification, authentification refusée, Core temporairement indisponible, destination de retour après connexion.

## Contrats/API déjà présents à auditer

- `/api/genesis/account/register`
- `/api/genesis/account/verify`
- `/api/genesis/account/resend`
- `/api/genesis/account/login`
- `/api/genesis/account/me`
- `/api/genesis/account/logout`
- page `/connexion`
- espace `/espace`

L'audit CAP-002 doit vérifier les contrats Core réellement consommés, les codes d'erreur, les permissions, la durée de session et les transitions UI avant toute modification.

## Critère historique minimal

```gherkin
GIVEN une personne authentifiée par GAMAD Core
WHEN elle ouvre Mon espace
THEN DG Afrique résout la même identité canonique
AND n'en crée aucune seconde
```

Ce critère est désormais couvert par CAP-001 ; CAP-002 doit compléter le contrat **Compte DG Afrique** avec création, vérification, connexion, session, déconnexion, récupération/erreurs si prévues par le Core, UX et preuves production.

## Prochaine action autorisée

**Audit de spécification uniquement avant développement :**

1. confronter le référentiel V0.1 au code réel du parcours compte ;
2. inventorier les endpoints Core réellement utilisés ;
3. documenter les états, données, permissions, erreurs, dépendances et garde-fous ;
4. définir les critères d'acceptation CAP-002 complets ;
5. identifier les écarts entre production actuelle et contrat attendu ;
6. seulement après cette spec, décider des changements de code nécessaires.

CAP-003 reste **BLOQUÉ** jusqu'à CAP-002 `VALIDÉ PROD`.

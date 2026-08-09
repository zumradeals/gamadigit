# CAP-002 — COMPTE DG AFRIQUE

- **Domaine :** Identity
- **Propriétaire d'exécution :** HYBRID — DG Afrique orchestre, GAMAD Core authentifie
- **Statut :** implémenté / à adapter au nouveau shell

## Invariants

- Le compte DG Afrique est gratuit.
- Compte DG Afrique ≠ adhésion au Programme ZUMRA.
- L'identité canonique reste celle du Core.
- DG Afrique peut conserver une session serveur/cookie signée, mais ne duplique pas le mot de passe Core.

## États UI

Visiteur → connexion / création ; connecté → home personnelle ; session expirée → retour à la connexion avec destination conservée si possible.

## Critères d'acceptation

```gherkin
GIVEN une personne authentifiée par GAMAD Core
WHEN elle ouvre Mon espace
THEN DG Afrique résout la même identité canonique et n'en crée aucune seconde
```

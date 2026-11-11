# CAP-001 — Relance du gate Vercel

- Date : 2026-08-10
- Heure : 11:28 UTC
- Branche : `cap/001-finalize`
- Motif : le précédent head avait été refusé par Vercel pour `build-rate-limit`. Un ancien statut GitHub d'échec ne se réévalue pas automatiquement après expiration de la fenêtre de quota ; ce commit documentaire déclenche donc une nouvelle tentative réelle sans modifier la logique applicative.
- Règle : aucune promotion vers `cursor` tant que cette nouvelle tentative n'exécute pas `npm test` puis `next build` avec un résultat `READY`.

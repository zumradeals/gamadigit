# AI HANDOFF — DG Afrique

> **Lire ce fichier avant toute modification.** Il doit permettre à une autre IA de reprendre sans accès à la conversation précédente.

## Projet canonique

- Dépôt : `zumradeals/gamadigit`
- Production : branche `cursor`, `https://dgafrique.com`
- Stack : Next.js 15, React 19, TypeScript, Tailwind, Supabase/PostgreSQL, GAMAD Core, GeniusPay
- Laravel V2 n'est plus la trajectoire active.

## Règle absolue de chantier

Le développement suit strictement **CAP-001 → CAP-084**.

1. lire `docs/capacites/CAP-MASTER-TRACKER.md` ;
2. prendre le premier CAP non `VALIDÉ PROD` ;
3. ne travailler que sur ce CAP ;
4. appliquer `docs/capacites/CAP-PRODUCTION-GATE.md` ;
5. maintenir fiche, preuve, historique, tracker et ce handoff ;
6. aucun CAP N+1 ne s'ouvre tant que CAP N n'est pas `VALIDÉ PROD`.

Du code futur peut déjà exister : il reste préexistant/non validé jusqu'à son tour.

## État officiel — 2026-08-10

### CAP-001 — IDENTITÉ PERSONNE

**VALIDÉ PROD.**

- preuve : `docs/capacites/proofs/CAP-001-2026-08-10.md`
- commit applicatif : `76e4d1266f7ad4a1ca4772292145d8e138e69747`
- preview : `dpl_5n97En7V4aDEeSTKgBdwzc6YPc56` READY
- production : `dpl_7pSY1rsS2x8EbhcNym1He1nHCZYx` READY
- validation utilisateur : « Mon espace OK »

À préserver : GAMAD Core est l'autorité canonique ; `session.entity` est le point d'attache ; Supabase métier ne crée pas d'identité membre parallèle.

### CAP-002 — COMPTE DG AFRIQUE

**EN DEV — seul gate actif. CAP-003 à CAP-084 restent BLOQUÉS.**

Branche DG : `cap/002-compte-dg-afrique`.

Référentiel V0.1 : compte gratuit, création, vérification, connexion, entrée dans Mon espace ; compte DG distinct de ZUMRA.

## Travaux CAP-002 déjà réalisés côté DG

Écarts corrigés sur la branche :

- renvoi de code aligné sur le contrat Core courant `identifiant_reference + destination` ;
- `?next=` local sûr repris après authentification ;
- reprise de vérification après reload via dossier local borné sans mot de passe ni code ;
- `VERIFICATION_NON_LIVREE` conserve les références du même compte pour permettre le renvoi ;
- limitation login Core 429 présentée proprement ;
- session glissante : DG sait maintenant lire l'attestation Core et renouveler son cookie uniquement jusqu'à l'échéance attestée.

Dernier head applicatif testé : `4b9e8c882d6885632927f20a62efb9d5f4dfe1d7`.

Preview : `dpl_AbwStXbszQuJtforAc7q2db9VC5a` — **READY**.

Build : **16 tests / 16 pass / 0 fail**, `npm test && next build` vert, compilation/types verts.

## Dépendance Core CAP-002 — état exact

Claude/Core a vérifié qu'aucune primitive existante ne répondait au besoin de connaître l'échéance glissée du bearer Core courant.

Contrat préparé dans `zumradeals/gamad-core` :

```http
GET /api/v1/sessions/current
Authorization: Bearer <jeton existant>
```

Réponse 200 `no-store` :

```json
{
  "entite": "IDN-...",
  "assurance": "AS1 — FACTEUR UNIQUE",
  "expire_le": "..."
}
```

Le `expire_le` est l'échéance réellement persistée après vérification/glissement. 401 si session absente/invalide/expirée/révoquée. Aucun nouveau jeton ni nouvelle session.

Commit Core préparé : **`bdab896`**, sur branche Claude dédiée.

Tests Core annoncés verts :

- `authentification_p3.php` — 28 assertions ;
- `sessions_current_p1.php` — 8/8 ;
- garde journal opérationnel verte ;
- OpenAPI, console auth et fédération verts.

`api_v1_p1.php` a un échec readiness matching/pgsql déclaré préexistant sur `main`, reproduit sans les changements CAP-002 et hors périmètre.

**Important : `bdab896` n'est PAS fusionné dans `main`, PAS déployé sur le VPS et n'a aucune preuve live.** Claude attend une autorisation explicite du dirigeant pour fusionner/déployer.

## Raccord DG déjà préparé

- `src/lib/gamad-core/account.ts` : `readCurrentUserSession()` appelle `GET /sessions/current` avec le bearer existant ;
- `src/lib/gamad-core/portal-session.ts` : `renewPortalSessionFromAttestation()` exige même identité, échéance future et non-régressive ;
- `/api/genesis/account/me` : résout l'identité, lit l'attestation puis réécrit le cookie signé avec l'`expire_le` Core ;
- DG ne calcule jamais 8 h et ne prolonge jamais au-delà de Core.

Ne pas promouvoir DG avant que la route Core soit live : sinon `/api/genesis/account/me` dépendrait d'un endpoint absent en production.

## Prochaine action exacte

1. obtenir l'autorisation dirigeant pour que Claude fusionne `bdab896` dans `gamad-core/main` ;
2. Claude déploie Core sur le VPS et revalide ses preuves sur checkout live ;
3. récupérer le rapport de déploiement exact ;
4. tester le preview DG `cap/002-compte-dg-afrique` contre le Core live ;
5. si vert, finaliser preuve/historique ;
6. comparer branche DG à `cursor` ;
7. fast-forward `force:false` uniquement si ahead-only ;
8. attendre Vercel production READY ;
9. tests navigateur CAP-002 : création → vérification → reload/reprise → renvoi → connexion → `next` → Mon espace → déconnexion ;
10. logs production + validation utilisateur ;
11. seulement alors CAP-002 → `VALIDÉ PROD` et CAP-003 → `EN SPEC`.

## Sécurité / discipline

- aucun secret dans docs/logs/messages ;
- ne jamais demander à l'utilisateur de coller un secret complet ;
- pas de force push ;
- production DG : branche dédiée → preview READY → compare → fast-forward `force:false` ;
- une preuve locale Core n'est pas une preuve production ;
- une route Core non déployée bloque la promotion DG ;
- les travaux ZUMRA, satellites, profil, compétences et autres CAP restent hors scope jusqu'à leur tour.

## SSO GamaDrive — incident clos mais CAP futurs non validés

Entrée et déconnexion centrale immédiate ont été validées navigateur. Core PR #81/#82, GamaDrive PR #3/#4 et DG front-channel sont en production. Cette preuve ne valide pas CAP-018/049/051/074.

## Fichiers obligatoires à maintenir

- `docs/capacites/CAP-PRODUCTION-GATE.md`
- `docs/capacites/CAP-MASTER-TRACKER.md`
- `docs/capacites/CAP-HISTORY.md`
- `docs/AI-HANDOFF.md`
- fiche du CAP actif
- dossier de preuve du CAP actif

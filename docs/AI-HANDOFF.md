# AI HANDOFF — DG Afrique

> **Lire ce fichier avant toute modification du projet.** Il doit permettre à une autre IA de reprendre le chantier sans accès à la conversation précédente.

## 1. Projet canonique

- Dépôt : `zumradeals/gamadigit`
- Branche de production : `cursor`
- Production : `https://dgafrique.com`
- Stack : Next.js 15, React 19, TypeScript, Tailwind, Supabase/PostgreSQL, GAMAD Core, GeniusPay.
- Laravel V2 n'est plus la trajectoire active.

## 2. Règle de chantier absolue

Le développement suit strictement **CAP-001 → CAP-084**.

Avant toute action :

1. lire `docs/capacites/CAP-MASTER-TRACKER.md` ;
2. prendre le premier CAP qui n'est pas `VALIDÉ PROD` ;
3. ne travailler que sur ce CAP ;
4. appliquer `docs/capacites/CAP-PRODUCTION-GATE.md` ;
5. mettre à jour la fiche, la preuve, `CAP-HISTORY.md`, `CAP-MASTER-TRACKER.md` et ce handoff avant toute fermeture ;
6. aucun CAP N+1 ne s'ouvre tant que CAP N n'est pas `VALIDÉ PROD`.

Du code peut déjà exister pour des CAP futurs. Il reste **préexistant / non validé** jusqu'à son tour.

## 3. État officiel au 2026-08-10 11:58 UTC

### CAP-001 — IDENTITÉ PERSONNE

**VALIDÉ PROD.**

- fiche : `docs/capacites/specs/CAP-001-identite-personne.md`
- preuve finale : `docs/capacites/proofs/CAP-001-2026-08-10.md`
- commit applicatif validé : `76e4d1266f7ad4a1ca4772292145d8e138e69747`
- preview final : `dpl_5n97En7V4aDEeSTKgBdwzc6YPc56` — READY
- production : `dpl_7pSY1rsS2x8EbhcNym1He1nHCZYx` — READY
- tests : 8/8 pass, 0 fail ; `npm test && next build` vert
- contrôle runtime post-déploiement : aucune erreur trouvée sur `/espace` et `/api/genesis/account/me` dans la fenêtre inspectée
- validation utilisateur finale : **« Mon espace OK »**, 2026-08-10 11:58 UTC

Architecture CAP-001 à préserver : GAMAD Core est l'autorité canonique de l'identité personne ; `session.entity` est le point d'attache ; Supabase métier ne crée pas d'identité membre parallèle ; Supabase Auth historique de `/admin` reste un credential du plan de contrôle CMS.

### CAP-002 — COMPTE DG AFRIQUE

**EN SPEC — seul gate actif.**

- fiche active : `docs/capacites/specs/CAP-002-compte-dg-afrique.md`
- CAP-003 et tous les suivants restent BLOQUÉS.
- Ne pas reprendre ZUMRA, Apprendre, projets, opportunités, satellites ou contribution tant que CAP-002 n'est pas VALIDÉ PROD.

## 4. Prochaine action exacte — CAP-002

Commencer par l'audit, pas par du code :

1. confronter le référentiel V0.1 au parcours compte réel ;
2. inventorier les routes/pages/API : `/connexion`, `/espace`, `/api/genesis/account/register`, `verify`, `resend`, `login`, `me`, `logout` ;
3. auditer les contrats Core réellement consommés et les codes d'erreur ;
4. documenter données, états, permissions, UX, durée de session, vérification, erreurs, retours après connexion et logout ;
5. identifier les écarts entre production actuelle et contrat attendu ;
6. compléter la fiche CAP-002 avec critères d'acceptation complets ;
7. seulement ensuite décider des modifications de code ;
8. feature branch → preview réel → tests → production → preuve utilisateur → VALIDÉ PROD ;
9. seulement alors ouvrir CAP-003.

## 5. Session et identité — faits déjà validés à ne pas casser

- session portail signée, HttpOnly, Secure, SameSite=Lax ;
- cookie falsifié/expiré refusé ;
- Core 401 = session invalide + cookie effacé ;
- panne Core non-401 = 503 réessayable, session conservée ;
- `/api/genesis/account/me` résout l'identité canonique ;
- aucune seconde identité membre Supabase ;
- ne jamais afficher token, mot de passe ou secret.

## 6. SSO GamaDrive — incident clos

GamaDrive est le seul satellite réel raccordé à ce jour.

Dépendances en production : Core PR #81/#82, GamaDrive PR #3/#4, et DG Afrique lit le `logout_url` Core puis effectue le front-channel lors de la déconnexion centrale.

Preuve utilisateur :

`connexion DG → GamaDrive → retour DG → déconnexion DG → accès direct immédiat GamaDrive`

Résultat : l'ancienne session GamaDrive ne survit plus.

Cette preuve **ne valide pas** CAP-018, CAP-049, CAP-051 ou CAP-074 ; ils restent BLOQUÉS jusqu'à leur tour.

## 7. ZUMRA et travaux futurs

Des écrans et APIs existent déjà pour adhésion, paiement initial, réseau, groupes, invitations et responsabilités. Ils sont préexistants et non validés sous le gate séquentiel.

Règles métier déjà retenues à préserver lors de leur tour : compte DG indépendant de ZUMRA ; activation après confirmation serveur du paiement initial ; contribution mensuelle distincte ; groupe vers 5 membres / 5 responsabilités ; aucun catalogue/matching fictif.

## 8. Sécurité et discipline Git/Vercel

- ne jamais écrire de secret dans docs, commits ou logs visibles ;
- ne jamais demander à l'utilisateur de coller un secret complet ;
- pas de jeton fédéré dans une URL ;
- pas de force push ni d'opération destructive sans autorisation explicite ;
- production : branche dédiée → preview READY → comparaison → fast-forward `force:false` vers `cursor` ;
- une limite plateforme ou un build non exécuté n'est jamais une preuve verte ;
- une validation utilisateur réelle doit être consignée quand le CAP a un comportement visible.

## 9. Note de continuité

Un fichier temporaire `.noop` a été créé par erreur sur `cursor` lors de la préparation de la clôture documentaire, puis supprimé immédiatement. Aucun code, donnée ou comportement applicatif n'a été modifié par cet incident de staging. Les commits concernés sont purement documentaires.

## 10. Fichiers obligatoires à maintenir

- `docs/capacites/CAP-PRODUCTION-GATE.md`
- `docs/capacites/CAP-MASTER-TRACKER.md`
- `docs/capacites/CAP-HISTORY.md`
- `docs/AI-HANDOFF.md`
- fiche du CAP actif
- dossier de preuve du CAP actif

Si ces fichiers ne reflètent pas l'état réel de fin de session, le travail n'est pas considéré terminé.

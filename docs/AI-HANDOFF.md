# AI HANDOFF — DG Afrique

> **Lire ce fichier avant toute modification du projet.** Il doit permettre à une autre IA de reprendre le chantier sans accès à la conversation précédente.

## 1. Projet canonique

- Dépôt : `zumradeals/gamadigit`
- Branche de production : `cursor`
- Production : `https://dgafrique.com`
- Stack : Next.js 15, React 19, TypeScript, Tailwind, Supabase/PostgreSQL, GAMAD Core, GeniusPay.
- Laravel V2 n'est plus la trajectoire active de DG Afrique.

## 2. Règle de chantier absolue

Le développement suit strictement **CAP-001 → CAP-084**.

Avant toute action :

1. lire `docs/capacites/CAP-MASTER-TRACKER.md` ;
2. trouver le premier CAP qui n'est pas `VALIDÉ PROD` ;
3. ne travailler que sur ce CAP ;
4. appliquer `docs/capacites/CAP-PRODUCTION-GATE.md` ;
5. lire le dossier de preuve du CAP actif ;
6. mettre à jour `CAP-HISTORY.md` et ce fichier avant de terminer la session.

**Aucun CAP N+1 ne doit être ouvert tant que CAP N n'est pas VALIDÉ PROD.**

Du code peut déjà exister pour des CAP futurs. Il reste préexistant / non validé jusqu'à son tour.

## 3. Gate actif

**CAP-001 — IDENTITÉ PERSONNE**

- Statut : `EN DEV`.
- Branche active : `cap/001-finalize`.
- Fiche : `docs/capacites/specs/CAP-001-identite-personne.md`.
- Preuve : `docs/capacites/proofs/CAP-001-2026-08-10.md`.
- CAP-002 reste **BLOQUÉ**.

Ne pas continuer ZUMRA, Apprendre, projets, satellites ou un autre module avant la clôture CAP-001.

## 4. Architecture d'identité à préserver

- GAMAD Core / CAP-CORE-001 est l'autorité canonique de l'identité personne.
- DG Afrique ne crée pas de seconde identité membre canonique dans Supabase.
- La session portail contient un token Core, `entity`, assurance et expiration dans un cookie signé HttpOnly/Secure/SameSite=Lax.
- `/api/genesis/account/me` résout la même `entity` via Core `GET /identites/{entity}`.
- Core `401` signifie session invalide : réponse 401 et cookie portail effacé.
- Une panne Core non-401 signifie indisponibilité temporaire : 503 mais session conservée.
- Les identifiants techniques et tokens ne sont pas exposés inutilement dans l'UI.

### Supabase

Le stockage métier ZUMRA existant utilise `core_identity_reference` comme point d'attache. Le client métier est serveur/service-role sans session utilisateur Supabase.

L'ancien CMS `/admin` utilise encore Supabase Auth (`auth.users`). CAP-001 le borne explicitement au **plan de contrôle CMS** : ce credential ne doit jamais devenir l'identité canonique d'un membre ni la clé d'une adhésion, d'un groupe, d'un projet ou d'un satellite.

## 5. SSO GamaDrive — incident clos

GamaDrive est actuellement le seul satellite réel raccordé. Le chantier interne GamaDrive reste hors de ce dépôt.

Dépendances déployées :

- Core PR #81 : revérification de session centrale liée ;
- GamaDrive PR #3 : middleware fédéré sur toutes les routes authentifiées + filet périodique ;
- Core PR #82 : `logout_url` gouverné dans l'environnement produit ;
- GamaDrive PR #4 : `GET /federation/deconnexion-centrale` ;
- DG Afrique : lecture du `logout_url` Core et navigation front-channel après logout central.

Le Core porte maintenant pour `PRD-GAMAD-002` en PRODUCTION :

`logout_url = https://gamadrive.dgafrique.com/federation/deconnexion-centrale`

### Preuve utilisateur production

Le 2026-08-10 vers 00:25 UTC, le scénario suivant a été testé dans le même navigateur :

`connexion DG → GamaDrive → retour DG → déconnexion DG → accès direct immédiat GamaDrive`

Résultat confirmé par l'utilisateur : **tout est OK** ; l'ancienne session satellite ne survit plus.

L'incident est clos, mais cette preuve **ne valide aucun CAP satellite futur**. CAP-018, CAP-049, CAP-051, CAP-074 restent BLOQUÉS.

## 6. CAP-001 — travail déjà réalisé sur `cap/001-finalize`

Commits :

- `7efc07848c65cc1172217e67fe519b3d7b348681` — extraction `portal-session.ts` ;
- `898e83cc7e387568b63fc140a29b3c390b9270e9` — `account.ts` utilise la primitive ;
- `4634786f0439f46c7d063d64b17877a777de99c5` — tests cookie ;
- `040da4f0fd91c8f75f5b645d0bf28449bab752f6` — `npm test` obligatoire avant build ;
- `378882e265944574d3118e3eb1f829035d07bdb9` — primitive `identity-state.ts` ;
- `aaad39b3709fcaf634d1260be135d6c8ef8f9329` — route `/me` reliée à cette primitive ;
- `549b5cb1c08defffd4b04283769c7d86501c914a` — tests 401 / 503.

Audit Core et Supabase consigné dans la fiche et le dossier de preuve.

## 7. Blocage actuel : preview final Vercel

Le statut Vercel du head `549b5cb1c08defffd4b04283769c7d86501c914a` est `failure` avec une cible explicite `build-rate-limit`.

Ce n'est **pas** une preuve d'échec du code. Mais le gate interdit toute promotion tant qu'un build portant **tous** les tests finaux n'a pas réellement été exécuté et marqué `READY`.

Des previews antérieurs de la même branche étaient READY avant les derniers tests ; ils ne suffisent pas.

## 8. Prochaine action exacte

1. Ne pas ouvrir CAP-002.
2. Vérifier si la limite Vercel permet à nouveau un build du head de `cap/001-finalize`.
3. Obtenir la preuve que `npm test` passe avant `next build`.
4. Exiger preview final `READY`.
5. Comparer `cap/001-finalize` à `cursor` ; la branche doit être uniquement en avance, sans divergence inattendue.
6. Fast-forward vers `cursor` sans force.
7. Attendre le déploiement production `READY`.
8. Contrôler `/espace` et `/api/genesis/account/me` dans un parcours membre réel sans exposer d'identifiant/token.
9. Contrôler les logs de production pour erreurs et absence de fuite sensible.
10. Compléter `proofs/CAP-001-2026-08-10.md`, la fiche, l'historique, le registre maître et ce handoff.
11. Si toutes les cases sont satisfaites : CAP-001 → `VALIDÉ PROD`, CAP-002 → `EN SPEC`.
12. Sinon : CAP-001 reste actif et CAP-002 reste BLOQUÉ.

## 9. Rollback CAP-001

Le changement CAP-001 est un refactoring/test du support de session et de la décision 401/503. Le rollback applicatif connu est un revert des commits CAP-001 ou, si nécessaire, retour au commit production antérieur `75c722d735090484e1cdbea5f278cfa5984b21c3`. Aucun rollback de données Core/Supabase n'est requis par ces changements.

## 10. ZUMRA et travaux futurs

Des écrans ZUMRA existent déjà : profil, adhésion, paiement initial, réseau, groupe, invitation et responsabilités. Ils ne sont pas validés sous le gate séquentiel et ne doivent pas être poursuivis avant leur CAP.

Règles métier déjà retenues à préserver lors de leur audit : compte DG indépendant de ZUMRA ; activation après confirmation serveur du paiement initial ; contribution mensuelle distincte ; groupe vers 5 membres / 5 responsabilités ; aucun catalogue/matching fictif.

## 11. Sécurité et discipline

- Ne jamais écrire de secret dans docs, commits, logs visibles ou réponses.
- Ne jamais demander à l'utilisateur de coller un secret complet.
- Ne jamais mettre un jeton fédéré dans une URL.
- Pas de force push ni d'opération destructive sans autorisation explicite.
- Production : feature branch → preview réel → vérification → fast-forward sûr vers `cursor`.
- Une limite de plateforme ou un build non exécuté n'est jamais transformé en preuve verte.

## 12. Fichiers obligatoires à maintenir

- `docs/capacites/CAP-MASTER-TRACKER.md`
- `docs/capacites/CAP-HISTORY.md`
- `docs/AI-HANDOFF.md`
- `docs/capacites/specs/CAP-001-identite-personne.md`
- `docs/capacites/proofs/CAP-001-2026-08-10.md`

Si ces fichiers ne reflètent pas l'état réel de fin de session, le travail n'est pas considéré terminé.

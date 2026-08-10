# CAP-001 — IDENTITÉ PERSONNE

- **Famille :** Fondations humaines et ZUMRA
- **Domaine :** Identity
- **Propriétaire d'exécution :** HYBRID — GAMAD Core fournit l'identité canonique ; DG Afrique la consomme et la relie à ses expériences métier
- **Statut gate :** EN DEV
- **Validation production :** NON
- **CAP suivant autorisé :** NON — CAP-002 reste BLOQUÉ
- **Dossier de preuve courant :** `../proofs/CAP-001-2026-08-10.md`

## Source fonctionnelle V0.1

Le référentiel `DG_Afrique_Referentiel_Final_84_Capacites_V0.1` définit CAP-001 ainsi :

- **Finalité :** permettre à une personne d'exister de manière persistante dans l'écosystème numérique.
- **Capacité :** DG Afrique peut créer et utiliser une identité personnelle canonique fournie par GAMAD Core ; cette identité devient le point d'attache stable des autres capacités.
- **Points clés :** relier le compte DG Afrique, le profil, les compétences, les apprentissages, ZUMRA, les projets, les services, les opportunités et les futures applications ; éviter de recréer une identité différente pour chaque service.
- **Garde-fou :** une identité Core peut servir plusieurs expériences sans confondre leurs données métier.

## Limite de CAP-001

CAP-001 porte sur **l'identité canonique persistante de la personne**.

Il ne valide pas encore :

- le parcours complet de création/connexion du compte DG Afrique — CAP-002 ;
- le profil de capacités — CAP-003 ;
- le lanceur ou la portabilité vers les satellites — CAP-018 / CAP-051 ;
- le consentement ou la séparation détaillée des contextes — CAP-052 / CAP-053.

Ces CAP peuvent déjà avoir du code préexistant, mais restent BLOQUÉS.

## Invariants

1. Une personne possède une identité canonique stable fournie par GAMAD Core.
2. DG Afrique ne crée pas une seconde autorité d'identité membre parallèle dans Supabase.
3. Les données métier DG Afrique peuvent référencer l'identité canonique sans devenir elles-mêmes l'identité.
4. Deux expériences métier différentes peuvent utiliser la même identité sans fusionner automatiquement leurs données métier.
5. Une session DG Afrique doit résoudre la même entité canonique auprès du Core pendant sa durée de validité.
6. Une indisponibilité transitoire du Core ne doit pas être interprétée comme la disparition de l'identité.
7. Un refus d'authentification réel / une session Core invalide ne doit pas être masqué.
8. Les secrets, mots de passe et jetons ne sont jamais des identifiants métier ni des éléments affichables.
9. Un credential technique du plan de contrôle, par exemple le Supabase Auth historique du CMS `/admin`, ne doit jamais devenir l'identité canonique ou la clé métier d'un membre.

## Contrat Core audité

Le code actuel de `CAP-CORE-001 / CTR-01` confirme que :

- la référence canonique est résolue indépendamment du produit ;
- le Core garde une identité minimale, son état, sa source, son assurance et son histoire ;
- il ne possède pas le profil métier, la réputation ou le dossier universel ;
- les produits conservent les données d'usage.

DG Afrique consomme la livraison HTTP `GET /identites/{reference}` sous session Core.

Références auditées :

- `zumradeals/gamad-core:core/registre-identites/src/Ctr01.php`
- `zumradeals/gamad-core:apps/console-laravel/app/Http/Controllers/Ctr01Controller.php`

## Comportement DG Afrique audité

Le code actuel :

- conserve dans une session portail signée `token`, `entity`, `assurance` et `expiresAt` ;
- rejette un cookie altéré, malformé ou expiré ;
- lit l'identité canonique avec `GET /identites/{entity}` auprès du Core ;
- expose via `/api/genesis/account/me` une réponse authentifiée qui contient l'entité de session et l'identité canonique ;
- supprime le cookie sur un vrai `401` du Core ;
- conserve la session et renvoie une indisponibilité temporaire sur une erreur Core non-401.

La primitive de cookie est isolée dans `src/lib/gamad-core/portal-session.ts` pour être testable sans dépendre du reste de Next.js. La décision 401/503 est isolée dans `src/lib/gamad-core/identity-state.ts` et utilisée directement par `/api/genesis/account/me`.

## Objets et données

### Autorité canonique

- identité personne Core ;
- référence canonique stable (`entity` côté session DG) ;
- informations canoniques retournées par le Core selon son contrat.

### Session portail — support technique, pas identité métier

- jeton Core ;
- entité canonique ;
- niveau d'assurance ;
- expiration.

### Données DG/Supabase — points d'attache observés

Les tables métier peuvent stocker une référence vers l'identité Core, mais ne doivent pas attribuer silencieusement une nouvelle identité personnelle canonique.

Inventaire structurel audité dans les migrations actuelles :

- `zumra_memberships.core_identity_reference` — unique ;
- `zumra_member_profiles.core_identity_reference` — clé primaire et FK vers l'adhésion ;
- `zumra_groups.founder_core_identity_reference` ;
- `zumra_group_members.core_identity_reference` ;
- `zumra_group_roles.core_identity_reference` ;
- `zumra_group_events.actor_core_identity_reference` et sujet éventuel ;
- `zumra_payments.core_identity_reference`.

L'API `/api/zumra/me` requête les données avec `session.entity`. Cette observation constitue une preuve de point d'attache, **pas une validation fonctionnelle des CAP ZUMRA futurs**.

### Supabase Auth historique du CMS

La migration initiale utilise `auth.users` pour `public.profiles.user_id` et `media_assets.created_by`, et `src/lib/admin-auth.ts` utilise Supabase Auth pour le back-office CMS.

Décision CAP-001 : ce mécanisme est borné au **plan de contrôle CMS `/admin`**. Il est un credential opérateur historique, pas l'identité membre de l'écosystème. Il ne doit pas servir de clé aux adhésions, groupes, projets, satellites ou autres objets membre. Le parcours membre utilise GAMAD Core et `session.entity`.

## États utiles

- `IDENTITE_RESOLUE` — session valide et identité canonique lue ;
- `SESSION_ABSENTE` — aucune session exploitable ;
- `SESSION_INVALIDE` — Core refuse la session ;
- `IDENTITE_TEMPORAIREMENT_INDISPONIBLE` — identité connue par la session mais Core momentanément inaccessible.

CAP-001 ne définit pas encore tous les écrans de connexion/création : CAP-002 les prendra en charge.

## Permissions et confidentialité

- L'identité canonique n'autorise pas à elle seule l'accès à toutes les données métier.
- Chaque contexte garde ses propres autorisations.
- Ne jamais afficher dans l'UI un jeton de session ou un secret.
- Les références techniques ne doivent être exposées que si un besoin utilisateur réel le justifie.
- La session maître DG reste host-only côté portail ; CAP-001 ne demande pas de partager son cookie avec les satellites.

## API / cas d'usage CAP-001

1. Résoudre l'identité canonique d'une session DG Afrique valide via `/api/genesis/account/me` → Core `GET /identites/{entity}`.
2. Réutiliser la même référence canonique comme point d'attache des objets métier DG Afrique.
3. Distinguer une session invalide d'une indisponibilité temporaire du service d'identité.
4. Refuser localement un cookie portail falsifié ou expiré avant toute résolution d'identité.

## UI

CAP-001 est essentiellement une capacité de fondation. Elle n'introduit pas un écran d'identité technique.

Comportement visible attendu :

- `/espace` peut afficher l'expérience membre à partir de l'identité résolue ;
- une référence Core ou un token ne doit pas être mis en avant dans l'interface ;
- une session invalide renvoie vers la porte de connexion ;
- une panne temporaire doit afficher une indisponibilité réessayable sans prétendre que l'identité a disparu.

Les formulaires complets de création/connexion sont audités sous CAP-002.

## Événements

DG Afrique ne crée pas d'événement métier d'identité propre à CAP-001. Le cycle canonique de l'identité appartient au Core. Dans ce CAP, DG observe :

- résolution réussie ;
- session absente/invalide ;
- indisponibilité temporaire.

Aucun événement local ne doit prétendre modifier l'identité canonique.

## Dépendances

- **Core :** CAP-CORE-001 / CTR-01 pour l'identité canonique ; session Core pour l'accès authentifié.
- **DG Afrique :** cookie portail signé et endpoint `/api/genesis/account/me`.
- **Supabase :** stockage métier uniquement pour les objets déjà existants ; service role serveur sans session utilisateur membre.
- **CAP futurs :** CAP-002 compte, CAP-003 profil, CAP-018 satellites, CAP-051 portabilité, CAP-052 séparation des contextes, CAP-053 consentement restent BLOQUÉS.

## Garde-fous

- pas de second identifiant canonique membre dans Supabase ;
- pas de token ou mot de passe comme clé métier ;
- pas de fusion automatique des données métier entre contextes ;
- pas de validation rétroactive des CAP futurs à partir de preuves structurelles observées ici ;
- pas de promotion production sans preview final READY du head CAP-001.

## Critères d'acceptation à vérifier en production

### AC-001 — Stabilité canonique

```gherkin
GIVEN une personne disposant d'un compte Core valide
WHEN DG Afrique résout son identité à plusieurs reprises avec une session valide
THEN la même identité canonique est retournée
AND aucune nouvelle identité personnelle parallèle n'est créée par DG Afrique
```

### AC-002 — Point d'attache métier

```gherkin
GIVEN une identité canonique résolue
WHEN DG Afrique charge des données métier reliées à cette personne
THEN ces données utilisent la référence canonique comme point d'attache
AND les données métier restent distinctes de l'identité elle-même
```

### AC-003 — Session invalide

```gherkin
GIVEN une session que le Core refuse en 401
WHEN DG Afrique tente de résoudre l'identité
THEN la session portail est considérée invalide
AND le cookie de session est supprimé
```

### AC-004 — Panne transitoire

```gherkin
GIVEN une session encore structurellement valide
WHEN le Core est momentanément indisponible sans répondre 401
THEN DG Afrique signale une indisponibilité temporaire
AND ne détruit pas la session uniquement à cause de cette panne
```

### AC-005 — Intégrité du cookie

```gherkin
GIVEN un cookie de session altéré ou expiré
WHEN DG Afrique le lit
THEN il est rejeté
AND aucune identité canonique n'est résolue à partir de ce cookie
```

### AC-006 — Absence de seconde autorité membre

```gherkin
GIVEN le parcours d'une personne membre dans DG Afrique
WHEN on audite les mécanismes d'identité
THEN GAMAD Core reste l'autorité canonique
AND Supabase Auth n'est pas utilisé comme identité concurrente du membre
```

## Preuves requises avant VALIDÉ PROD

- [x] Contrat Core de l'identité personne audité et référencé dans le dossier de preuve.
- [x] Inventaire des points d'attache DG Afrique/Supabase vérifié structurellement.
- [ ] AC-001 confirmé après déploiement final du CAP-001.
- [x] AC-002 vérifié structurellement sur un objet métier réel sans valider son CAP fonctionnel futur.
- [ ] AC-003 : test automatisé ajouté ; doit passer dans le build final puis être déployé.
- [ ] AC-004 : test automatisé ajouté ; doit passer dans le build final puis être déployé.
- [ ] AC-005 : tests automatisés ajoutés ; doivent passer dans le build final puis être déployés.
- [x] AC-006 confirmé par audit code/configuration pour le parcours membre ; Supabase Auth du CMS est borné explicitement au plan de contrôle.
- [x] Aucun secret/token ajouté aux tests ou au dossier de preuve.
- [ ] Build/tests applicables verts sur le head final CAP-001.
- [ ] Preview final READY.
- [ ] Déploiement production sain du head final CAP-001.
- [x] Validation utilisateur du test navigateur de déconnexion centrale notée comme preuve complémentaire de cohérence de session.
- [ ] `CAP-HISTORY.md`, `CAP-MASTER-TRACKER.md` et `AI-HANDOFF.md` finalisés après production.

## Incident externe courant

Le head `549b5cb1c08defffd4b04283769c7d86501c914a` a reçu un statut Vercel `failure` dont la cible indique explicitement `build-rate-limit`. Ce statut ne constitue ni un preview vert ni une preuve d'erreur applicative. Aucune promotion n'est permise tant que Vercel n'a pas exécuté le build final.

## Rollback

Avant promotion, le rollback est simplement l'abandon de la branche. Après promotion, une régression CAP-001 peut être annulée par revert des commits CAP-001 ou retour au commit production antérieur `75c722d735090484e1cdbea5f278cfa5984b21c3`, sans modifier les données Core/Supabase.

## Prochaine action autorisée

**CAP-001 uniquement.**

1. Obtenir un build final après levée de la limite Vercel.
2. Exiger `npm test` vert puis `next build` vert.
3. Contrôler le preview et le diff.
4. Fast-forward sans force vers `cursor`.
5. Vérifier la production.
6. Compléter les preuves AC restantes et la documentation durable.
7. Marquer CAP-001 `VALIDÉ PROD` uniquement si toutes les conditions sont réunies.
8. Seulement alors ouvrir CAP-002.

# CAP-001 — IDENTITÉ PERSONNE

- **Famille :** Fondations humaines et ZUMRA
- **Domaine :** Identity
- **Propriétaire d'exécution :** HYBRID — GAMAD Core fournit l'identité canonique ; DG Afrique la consomme et la relie à ses expériences métier
- **Statut gate :** EN SPEC
- **Validation production :** NON
- **CAP suivant autorisé :** NON — CAP-002 reste BLOQUÉ

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
- la portabilité vers les satellites — CAP-051 ;
- le consentement ou la séparation détaillée des contextes — CAP-052 / CAP-053.

Ces CAP peuvent déjà avoir du code préexistant, mais restent BLOQUÉS.

## Invariants

1. Une personne possède une identité canonique stable fournie par GAMAD Core.
2. DG Afrique ne crée pas une seconde autorité d'identité parallèle dans Supabase.
3. Les données métier DG Afrique peuvent référencer l'identité canonique sans devenir elles-mêmes l'identité.
4. Deux expériences métier différentes peuvent utiliser la même identité sans fusionner automatiquement leurs données métier.
5. Une session DG Afrique doit résoudre la même entité canonique auprès du Core pendant sa durée de validité.
6. Une indisponibilité transitoire du Core ne doit pas être interprétée comme la disparition de l'identité.
7. Un refus d'authentification réel / une session Core invalide ne doit pas être masqué.
8. Les secrets, mots de passe et jetons ne sont jamais des identifiants métier ni des éléments affichables.

## Comportement DG Afrique observé à auditer

Le code actuel :

- conserve dans une session portail signée `token`, `entity`, `assurance` et `expiresAt` ;
- rejette un cookie altéré ou expiré ;
- lit l'identité canonique avec `GET /identites/{entity}` auprès du Core ;
- expose via `/api/genesis/account/me` une réponse authentifiée qui contient l'entité de session et l'identité canonique ;
- supprime le cookie sur un vrai `401` du Core ;
- conserve la session et renvoie une indisponibilité temporaire sur une erreur Core non-401.

Ces éléments sont **des preuves de code, pas encore des preuves de production CAP-001**.

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

### Données DG/Supabase

Les tables métier peuvent stocker une référence vers l'identité Core, mais ne doivent pas attribuer silencieusement une nouvelle identité personnelle canonique.

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

## Cas d'usage CAP-001

1. Résoudre l'identité canonique d'une session DG Afrique valide.
2. Réutiliser la même référence canonique comme point d'attache des objets métier DG Afrique.
3. Distinguer une session invalide d'une indisponibilité temporaire du service d'identité.

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

### AC-006 — Absence de seconde autorité

```gherkin
GIVEN le parcours d'une personne dans DG Afrique
WHEN on audite les mécanismes d'identité
THEN GAMAD Core reste l'autorité canonique
AND Supabase Auth n'est pas utilisé comme identité concurrente de la personne
```

## Preuves requises avant VALIDÉ PROD

- [ ] Contrat Core de l'identité personne audité et référencé dans l'historique.
- [ ] Inventaire des tables DG Afrique qui stockent une référence d'identité vérifié.
- [ ] AC-001 vérifié en production sans exposer de donnée sensible.
- [ ] AC-002 vérifié sur au moins un objet métier réel ou, si aucun objet CAP-001-compatible n'est encore ouvert, preuve structurelle documentée sans valider un CAP futur.
- [ ] AC-003 vérifié de façon sûre.
- [ ] AC-004 vérifié par test contrôlé ou preuve automatisée suffisamment fidèle ; ne pas provoquer une panne réelle volontaire du Core en production.
- [ ] AC-005 couvert par test automatisé et comportement production cohérent.
- [ ] AC-006 confirmé par audit de configuration/code.
- [ ] Aucun secret/token dans les logs ou preuves.
- [ ] Build/tests applicables verts.
- [ ] Déploiement production sain.
- [ ] `CAP-HISTORY.md`, `CAP-MASTER-TRACKER.md` et `AI-HANDOFF.md` mis à jour.

## Preuves déjà disponibles — non suffisantes pour validation

- `src/lib/gamad-core/account.ts` contient la session signée, sa vérification d'intégrité/expiration et la lecture canonique auprès du Core.
- `src/app/api/genesis/account/me/route.ts` distingue `401` d'une indisponibilité transitoire.
- Le produit a déjà été utilisé avec une identité Core dans des parcours réels, mais les preuves doivent maintenant être reconstituées selon le gate officiel.

## Prochaine action autorisée

**Auditer CAP-001 uniquement.**

1. Lire le contrat Core d'identité personne.
2. Relever tous les points d'attache de l'identité dans DG Afrique/Supabase sans ouvrir les fonctionnalités des CAP futurs.
3. Identifier les écarts aux invariants ci-dessus.
4. Corriger uniquement les écarts CAP-001.
5. Exécuter le gate preview → production → preuves.
6. Marquer CAP-001 `VALIDÉ PROD` uniquement si toutes les conditions sont réunies.

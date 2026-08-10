# CAP-002 — COMPTE DG AFRIQUE

- **Famille :** Fondations humaines et ZUMRA
- **Domaine :** Identity
- **Propriétaire d'exécution :** HYBRID — DG Afrique orchestre l'expérience compte ; GAMAD Core crée l'identité, vérifie l'identifiant humain et authentifie
- **Statut gate :** **EN DEV**
- **Validation production :** NON
- **CAP précédent :** CAP-001 — **VALIDÉ PROD**
- **CAP suivant autorisé :** NON — CAP-003 reste BLOQUÉ
- **Branche DG active :** `cap/002-compte-dg-afrique`
- **Dépendance Core préparée :** `zumradeals/gamad-core`, branche Claude dédiée, commit `bdab896` — testé localement mais NON fusionné / NON déployé au moment de cette mise à jour

## Source fonctionnelle V0.1

Le référentiel `DG_Afrique_Referentiel_Final_84_Capacites_V0.1` définit CAP-002 ainsi :

- **Finalité :** donner à une personne un accès personnel à l'application DG Afrique.
- **Capacité :** une personne peut créer gratuitement un compte DG Afrique, se connecter, vérifier son accès et entrer dans Mon espace.
- **Points clés :** le compte DG Afrique reste distinct de l'adhésion au Programme ZUMRA ; l'utilisateur peut entrer dans l'écosystème avant d'avoir choisi un parcours précis.
- **Garde-fou / résultat :** le compte est une porte d'accès, pas une adhésion automatique à tous les programmes.

## Limite de CAP-002

CAP-002 porte uniquement sur la porte d'accès personnelle DG Afrique : création, vérification, connexion, session portail, retour vers la destination utile et déconnexion.

Il ne valide pas CAP-003 profil, CAP-004 compétences, CAP-007 ZUMRA, CAP-018 lanceur satellite, CAP-051 portabilité d'identité ni les autres CAP futurs. Leur code préexistant peut être traversé pendant un test sans être validé par ricochet.

## Invariants

1. Le compte DG Afrique est gratuit.
2. Compte DG Afrique ≠ adhésion ZUMRA.
3. GAMAD Core reste l'autorité d'identité, de vérification de l'identifiant humain et d'authentification.
4. DG Afrique ne persiste jamais le mot de passe ni le code de vérification.
5. EMAIL doit être vérifié avant authentification normale.
6. Une session réellement invalide revient à la connexion ; une panne transitoire ne détruit pas une session encore valide.
7. `next` n'accepte qu'un chemin local sûr.
8. Une vérification interrompue doit pouvoir reprendre sans recréer l'identité lorsque le dossier local de reprise existe.
9. La déconnexion ferme Core, efface le cookie portail et exécute le front-channel satellite gouverné lorsqu'il existe.
10. DG ne calcule jamais lui-même une prolongation de session : le cookie ne peut être renouvelé que jusqu'à une échéance attestée par Core.

## Contrats Core audités

### Création

`POST /v1/comptes` derrière `gamad.api` avec `nom`, `type_identifiant`, `identifiant`, `mot_de_passe`.

Pour EMAIL/TELEPHONE le Core crée un défi et livre le code au canal humain. Le code brut ne traverse pas la frontière Core → navigateur.

Erreurs structurantes : `COMPTE_NON_CREATABLE`, `VERIFICATION_NON_LIVREE`, refus d'autorisation et indisponibilités du socle/journal.

### Vérification

`POST /v1/comptes/verifications` derrière `gamad.api`.

Refus utiles : `VERIFICATION_INCONNUE`, `VERIFICATION_INACTIVE`, `VERIFICATION_EXPIREE`, `TROP_DE_TENTATIVES`, `CODE_INVALIDE`.

### Renvoi

`POST /v1/comptes/verifications/renvoi` derrière `gamad.api`.

Contrat courant :

```json
{
  "identifiant_reference": "RID-...",
  "destination": "personne@example.com"
}
```

Le Core vérifie la destination, le producteur, impose le délai de renvoi et le quota horaire.

### Connexion

`POST /v1/sessions` avec `identifiant`, `type_identifiant`, `secret`.

Refus d'authentification générique en 401. Le Core applique 8 h d'inactivité glissantes avec plafond absolu 30 jours.

### Session courante — contrat CAP-002 préparé côté Core

Aucune primitive officielle adaptée n'existait avant ce chantier. Le Core a préparé sur le commit `bdab896` :

```http
GET /api/v1/sessions/current
Authorization: Bearer <jeton déjà ouvert>
```

Réponse attendue :

```json
{
  "entite": "IDN-...",
  "assurance": "AS1 — FACTEUR UNIQUE",
  "expire_le": "2026-08-10T20:00:00+00:00"
}
```

Propriétés du contrat :

- passe par le middleware `gamad.api` normal ;
- `200` + `Cache-Control: no-store` pour une session valide ;
- `401` si absente/invalide/expirée/révoquée ;
- `expire_le` est l'échéance réellement persistée après glissement ;
- aucune nouvelle session, aucun second token, aucune exposition du bearer.

Core a annoncé les preuves locales suivantes sur `bdab896` : 28 assertions `authentification_p3.php`, 8/8 `sessions_current_p1.php`, garde journal verte, OpenAPI/console/fédération verts. Un échec `api_v1_p1.php` readiness matching/pgsql est déclaré préexistant sur `main` et hors périmètre. **Ce contrat n'est pas encore une preuve production tant qu'il n'est pas fusionné et déployé sur le VPS.**

`DELETE /v1/sessions/current` reste la fermeture de session.

## Écarts DG trouvés et état

### GAP-002-A — payload renvoi obsolète — CORRIGÉ SUR BRANCHE

DG envoie maintenant exactement `identifiant_reference + destination`. Test de régression présent.

### GAP-002-B — `?next=` perdu — CORRIGÉ SUR BRANCHE

`safeAccountReturnPath()` accepte uniquement un chemin local DG, refuse `//`, origine/schéma externe et boucle `/connexion`, puis le parcours login/vérification reprend cette destination.

### GAP-002-C — vérification interrompue — CORRIGÉ SUR BRANCHE

DG conserve un dossier local borné contenant uniquement identité Core opaque, RID, référence de vérification, email et échéances. Aucun mot de passe ni code. Le dossier peut permettre un renvoi après expiration de l'ancien code et expire lui-même après 7 jours.

`VERIFICATION_NON_LIVREE` conserve désormais les références de reprise du compte déjà créé afin d'éviter une seconde création.

Limite assumée : sans contrat Core supplémentaire, la reprise cross-device après perte totale du dossier local n'est pas fournie par CAP-002.

### GAP-002-D — expiration glissante Core / cookie DG — RACCORDÉ SUR BRANCHE, ATTEND CORE PROD

DG contient maintenant :

- `readCurrentUserSession()` → `GET /sessions/current` avec le bearer déjà ouvert ;
- `renewPortalSessionFromAttestation()` → garde pure qui exige même identité, échéance future et non-régressive ;
- `/api/genesis/account/me` → résout l'identité, lit l'attestation Core, puis réécrit le cookie signé uniquement jusqu'à `expire_le` attesté.

DG n'ajoute aucune durée locale, ne calcule pas 8 h et ne dépasse jamais la valeur Core.

Ce raccord ne doit pas être promu en production avant déploiement du contrat Core, sinon `/api/genesis/account/me` dépendrait d'une route absente sur le Core live.

## Sécurité

- mutations compte protégées same-origin ;
- création/vérification/renvoi Core via identité produit serveur ;
- secret produit et mot de passe humain jamais exposés ;
- réponses compte/session `no-store` ;
- aucun open redirect ;
- aucune activation ZUMRA automatique ;
- cookie portail signé HttpOnly/Secure/SameSite=Lax ;
- renouvellement de cookie uniquement sur attestation Core cohérente.

## Critères d'acceptation

- **AC-002-01** création gratuite sans adhésion ZUMRA automatique.
- **AC-002-02** EMAIL non vérifié inutilisable pour connexion ; bon code → vérifié.
- **AC-002-03** renvoi conforme au contrat Core et borné par ses limites.
- **AC-002-04** reprise après reload sans mot de passe/code persisté.
- **AC-002-05** `VERIFICATION_NON_LIVREE` reprend le même compte.
- **AC-002-06** connexion ouvre session Core et cookie sécurisé puis Mon espace.
- **AC-002-07** retour `next` local sûr ; aucune redirection externe.
- **AC-002-08** utilisateur déjà connecté ne repasse pas inutilement par le formulaire.
- **AC-002-09** Core 401 invalide le cookie ; panne non-401 conserve la session et propose réessai.
- **AC-002-10** déconnexion centrale révoque Core, efface DG et lance le front-channel gouverné.
- **AC-002-11** activité compte DG : le cookie est renouvelé uniquement jusqu'à l'`expire_le` courant attesté par Core, jamais par calcul local.

## Tests DG actuels

Dernier head applicatif testé : `4b9e8c882d6885632927f20a62efb9d5f4dfe1d7`.

Preview Vercel : `dpl_AbwStXbszQuJtforAc7q2db9VC5a` — **READY**.

- `npm test && next build` ;
- **16 tests / 16 pass / 0 fail** ;
- tests CAP-001 conservés ;
- tests CAP-002 : retour sûr, renvoi, reprise, durée dossier, renouvellement sur attestation, refus identité incohérente, refus échéance régressive/expirée ;
- compilation Next.js réussie ;
- types/lint réussis ;
- génération statique réussie.

## Gate actuel et prochaine action

**CAP-002 reste EN DEV. CAP-003 reste BLOQUÉ.**

Prochaine séquence obligatoire :

1. autorisation dirigeant pour que Claude fusionne `bdab896` dans `gamad-core/main` et déploie le Core sur le VPS ;
2. preuve Core live de `GET /api/v1/sessions/current` ;
3. test d'intégration DG preview → Core live ;
4. finaliser docs/preuves ;
5. comparer branche DG à `cursor` ;
6. fast-forward production seulement si preview et intégration sont verts ;
7. tests navigateur CAP-002 ;
8. logs production ;
9. validation utilisateur ;
10. seulement alors CAP-002 → `VALIDÉ PROD` et CAP-003 → `EN SPEC`.

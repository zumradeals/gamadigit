# CAP-002 — COMPTE DG AFRIQUE

- **Famille :** Fondations humaines et ZUMRA
- **Domaine :** Identity
- **Propriétaire d'exécution :** HYBRID — DG Afrique orchestre l'expérience compte ; GAMAD Core crée l'identité, vérifie l'identifiant humain et authentifie
- **Statut gate :** **EN SPEC**
- **Validation production :** NON
- **CAP précédent :** CAP-001 — **VALIDÉ PROD**
- **CAP suivant autorisé :** NON — CAP-003 reste BLOQUÉ
- **Branche active :** `cap/002-compte-dg-afrique`

## Source fonctionnelle V0.1

Le référentiel `DG_Afrique_Referentiel_Final_84_Capacites_V0.1` définit CAP-002 ainsi :

- **Finalité :** donner à une personne un accès personnel à l'application DG Afrique.
- **Capacité :** une personne peut créer gratuitement un compte DG Afrique, se connecter, vérifier son accès et entrer dans Mon espace.
- **Points clés :** le compte DG Afrique reste distinct de l'adhésion au Programme ZUMRA ; l'utilisateur peut entrer dans l'écosystème avant d'avoir choisi un parcours précis.
- **Garde-fou / résultat :** le compte est une porte d'accès, pas une adhésion automatique à tous les programmes.

## Limite de CAP-002

CAP-002 porte sur la **porte d'accès personnelle DG Afrique** : création, vérification, connexion, session portail, retour vers la destination utile et déconnexion.

Il ne valide pas :

- le contenu détaillé du profil de capacités — CAP-003 ;
- les compétences — CAP-004 ;
- ZUMRA — CAP-007 et suivants ;
- le lanceur satellite en tant que capacité — CAP-018 ;
- la portabilité d'identité — CAP-051.

Du code de ces CAP peut être traversé pendant un test de compte sans être validé par ricochet.

## Invariants CAP-002

1. Le compte DG Afrique est gratuit.
2. Compte DG Afrique ≠ adhésion ZUMRA.
3. GAMAD Core reste l'autorité de création de l'identité, de vérification de l'identifiant humain et d'authentification.
4. DG Afrique ne conserve jamais le mot de passe en base, cookie, journal ou URL.
5. Le code de vérification est livré au canal humain par le Core et n'est jamais retourné en clair par le Core au navigateur via DG Afrique.
6. Une adresse EMAIL doit être vérifiée avant de servir à l'authentification normale.
7. Une personne déjà connectée ne doit pas voir inutilement l'écran de connexion.
8. Une session réellement invalide doit revenir à la porte de connexion ; une panne transitoire ne doit pas supprimer une session encore valide.
9. Une destination locale sûre demandée avant authentification doit être reprise après connexion ; aucune redirection externe arbitraire ne doit être acceptée.
10. Une création de compte dont la vérification n'est pas terminée doit pouvoir être reprise tant que le défi est exploitable, sans créer une seconde identité.
11. La déconnexion DG ferme la session Core, efface le cookie portail et exécute le front-channel satellite déclaré lorsque nécessaire.
12. La durée visible de session DG doit rester cohérente avec le contrat de session Core, sans inventer une permanence supplémentaire.

## Contrats Core audités

### Création de compte

`POST /v1/comptes` derrière `gamad.api`.

Entrée actuelle :

- `nom` ;
- `type_identifiant` (`EMAIL`, `TELEPHONE`, `USERNAME`) ;
- `identifiant` ;
- `mot_de_passe` — minimum 6 caractères dans le contrat Compte GAMAD actuel.

Le produit authentifié porte la demande. Pour EMAIL/TELEPHONE, le Core crée un défi puis livre le code au canal humain. Le code brut est retiré de la réponse produit avant retour HTTP.

Erreurs structurantes observées :

- `COMPTE_NON_CREATABLE` — 409 si le moyen de connexion existe déjà ;
- `VERIFICATION_NON_LIVREE` — le compte existe mais le premier code n'a pas été livré ;
- erreurs de socle / journal / création incomplète — 503 ;
- création non autorisée — 403.

### Vérification

`POST /v1/comptes/verifications` derrière `gamad.api`.

Le producteur du défi doit être le produit appelant. EMAIL et TELEPHONE restent `NON_VERIFIE` tant que le code n'est pas accepté. Un identifiant non vérifié ne peut pas être résolu pour authentification normale.

Refus possibles observés : `VERIFICATION_INCONNUE`, `VERIFICATION_INACTIVE`, `VERIFICATION_EXPIREE`, `TROP_DE_TENTATIVES`, `CODE_INVALIDE`, plus indisponibilités de registre/journal.

### Renvoi

`POST /v1/comptes/verifications/renvoi` derrière `gamad.api`.

**Contrat Core actuel confirmé :**

```json
{
  "identifiant_reference": "RID-...",
  "destination": "personne@example.com"
}
```

Le Core vérifie que la destination correspond au RID, que le producteur est le même, impose 60 secondes entre deux émissions et limite à 5 vérifications par heure.

### Connexion / session

`POST /v1/sessions` avec `identifiant`, `type_identifiant` et `secret`.

Le Core ne révèle pas si l'identifiant ou le secret est faux : refus générique 401. La session actuelle est glissante : 8 h d'inactivité, plafond absolu 30 jours. Chaque vérification valide côté Core prolonge son `expire_le` jusqu'au plafond.

`DELETE /v1/sessions/current` révoque la session Core courante et ferme les jetons fédérés encore liés.

## Parcours DG Afrique audité

### APIs existantes

- `/api/genesis/account/captcha`
- `/api/genesis/account/register`
- `/api/genesis/account/verify`
- `/api/genesis/account/resend`
- `/api/genesis/account/login`
- `/api/genesis/account/me`
- `/api/genesis/account/logout`

### UI existante

- `/connexion` : connexion / création / vérification dans un seul écran ;
- `/espace` : espace membre ;
- l'utilisateur déjà porteur d'un cookie portail signé et non expiré est redirigé de `/connexion` vers `/espace` ;
- `/espace` reprend une fédération satellite en attente via son cookie dédié ;
- `/api/genesis/account/me` distingue 401 réel et panne transitoire conformément à CAP-001.

## Écarts de production identifiés pendant l'audit

### GAP-002-A — Renvoi DG incompatible avec le contrat Core actuel

DG envoie actuellement :

```json
{
  "identifiant": "...",
  "type_identifiant": "EMAIL",
  "identifiant_reference": "RID-..."
}
```

Le Core attend `identifiant_reference + destination`. Le bouton « Renvoyer le code » n'est donc pas contractuellement aligné.

**Décision :** corriger DG pour envoyer exactement le contrat Core actuel et ajouter un test de régression.

### GAP-002-B — Retour `?next=` perdu après connexion

Des parcours protégés, notamment une invitation ZUMRA, peuvent envoyer vers `/connexion?next=<chemin local>`. `AccountLogin` pousse aujourd'hui systématiquement `/espace` après succès.

**Décision :** accepter uniquement une destination locale sûre, refuser `//`, schémas/hosts externes et boucles `/connexion`, puis reprendre cette destination après login/vérification. Sans `next`, conserver `/espace`, ce qui préserve aussi la reprise fédérée existante.

Cette correction valide seulement le comportement de porte d'accès CAP-002 ; elle ne valide pas le CAP métier de la destination.

### GAP-002-C — Vérification interrompue non reprise de façon robuste

L'état `pending` (identité, RID, référence de vérification, expiration) vit uniquement dans l'état React. Un rechargement ou une fermeture de page le perd. Or un EMAIL non vérifié ne peut pas ouvrir de session et une nouvelle création sur le même email retourne `COMPTE_NON_CREATABLE`.

Le cas `VERIFICATION_NON_LIVREE` est également imparfait : le Core retourne le compte/RID/défi créé, mais la couche DG transforme aujourd'hui l'erreur en exception et perd ces références, alors que l'UI indique qu'un renvoi devrait permettre de reprendre.

**Décision CAP-002 côté DG :**

- conserver un dossier de vérification côté navigateur sans mot de passe ni code ;
- durée bornée par `expiresAt` ;
- restaurer ce dossier après rechargement ;
- l'effacer après vérification réussie, expiration explicite ou changement volontaire de compte ;
- préserver le dossier retourné par le Core lorsque la création existe mais que la livraison initiale a échoué, afin de permettre le renvoi.

Ce dossier contient uniquement des références opaques déjà délivrées au navigateur et la destination saisie ; il n'est ni une session authentifiée ni une preuve d'identité.

**Limite connue :** sans nouveau contrat Core, une reprise depuis un autre navigateur/appareil après perte totale de ce dossier local n'est pas possible. Ne pas inventer une route Core. Si le produit exige plus tard cette récupération cross-device, un contrat Core dédié sera nécessaire.

### GAP-002-D — Session Core glissante, cookie DG actuellement figé à l'expiration initiale

Au login, DG fixe l'expiration du cookie portail à `expire_le` reçu à l'ouverture. Le Core prolonge ensuite la session à chaque vérification valide, mais son middleware HTTP courant n'expose pas la nouvelle échéance glissante à DG.

**Conséquence :** le navigateur DG peut supprimer son cookie après l'échéance initiale (~8 h) même si le Core aurait prolongé la session jusqu'au plafond de 30 jours.

**Décision :** ne pas falsifier une nouvelle date côté DG. CAP-002 nécessite soit :

- un contrat Core minimal qui expose l'échéance courante de la session vérifiée (réponse ou en-tête authentifié), afin que DG puisse renouveler son cookie à la vraie échéance ;
- soit une décision métier explicite disant que le portail DG reste volontairement limité à 8 h absolues malgré le Core glissant.

En l'absence de cette décision/primitive, CAP-002 ne pourra pas être déclaré `VALIDÉ PROD` sur la promesse « session glissante 8 h / plafond 30 jours ».

## États UX CAP-002

- `VISITEUR`
- `CREATION_EN_COURS`
- `VERIFICATION_EN_ATTENTE`
- `VERIFICATION_A_RENVOYER`
- `CONNEXION_EN_COURS`
- `CONNECTE`
- `SESSION_INVALIDE`
- `SERVICE_TEMPORAIREMENT_INDISPONIBLE`

L'utilisateur ne doit jamais voir les références Core, RID, jetons ou noms de contrats techniques comme contenu principal.

## Données manipulées par DG

### Création / vérification

- nom complet ;
- email V1 ;
- mot de passe uniquement en mémoire de formulaire / requête vers le serveur DG puis Core ; jamais persisté ;
- référence d'identité Core, RID, référence de vérification, expiration ;
- code à 6 chiffres uniquement présenté pour vérification, jamais journalisé.

### Session

- token Core dans cookie portail signé HttpOnly/Secure/SameSite=Lax ;
- entité canonique ;
- assurance ;
- expiration connue.

## Sécurité et permissions

- toutes les mutations compte DG refusent les requêtes cross-origin via la garde same-origin ;
- la création/vérification/renvoi Core se fait avec l'identité produit DG côté serveur ;
- le secret produit Core ne franchit jamais le serveur ;
- le mot de passe humain ne doit jamais être loggé ;
- pas d'open redirect via `next` ;
- aucune inscription DG ne doit activer ZUMRA automatiquement ;
- les réponses compte/session sont `no-store`.

## Critères d'acceptation CAP-002

### AC-002-01 — Création gratuite et distincte de ZUMRA

```gherkin
GIVEN un visiteur sans compte
WHEN il crée un compte DG Afrique avec un email disponible
THEN le Core crée une identité/compte sans paiement
AND aucune adhésion ZUMRA n'est créée automatiquement
AND DG passe à l'étape de vérification
```

### AC-002-02 — Vérification avant authentification email

```gherkin
GIVEN un compte créé avec EMAIL non vérifié
WHEN la personne tente l'authentification normale avant vérification
THEN aucune session utilisateur n'est ouverte
WHEN le bon code est confirmé
THEN l'email devient vérifié
AND la personne peut ouvrir sa session DG
```

### AC-002-03 — Renvoi conforme et borné

```gherkin
GIVEN une vérification en attente
WHEN la personne demande un nouveau code
THEN DG appelle le contrat Core actuel avec identifiant_reference + destination
AND les refus de délai/volume sont présentés sans créer un autre compte
```

### AC-002-04 — Reprise après rechargement

```gherkin
GIVEN un compte créé et une vérification encore exploitable
WHEN la page de connexion est rechargée
THEN DG reprend l'étape de vérification sans redemander de créer le compte
AND aucun mot de passe ni code n'a été persisté dans le dossier de reprise
```

### AC-002-05 — Livraison initiale échouée

```gherkin
GIVEN que le Core a créé le compte mais n'a pas livré le premier code
WHEN DG reçoit VERIFICATION_NON_LIVREE avec les références de reprise
THEN l'utilisateur reste sur le même compte
AND peut demander un nouveau code selon les limites Core
AND DG ne tente pas de créer une seconde identité
```

### AC-002-06 — Connexion

```gherkin
GIVEN un email vérifié et un mot de passe correct
WHEN la personne se connecte
THEN DG ouvre une session Core
AND écrit un cookie portail sécurisé
AND entre dans Mon espace
```

### AC-002-07 — Retour après authentification

```gherkin
GIVEN un utilisateur envoyé à /connexion avec une destination locale sûre
WHEN son authentification réussit
THEN il revient vers cette destination
AND une URL externe ou ambiguë ne peut pas être injectée comme redirection
```

### AC-002-08 — Déjà connecté

```gherkin
GIVEN une session portail structurellement valide
WHEN la personne ouvre /connexion
THEN elle est redirigée vers /espace sans second formulaire de connexion
```

### AC-002-09 — Session invalide vs panne transitoire

```gherkin
GIVEN une session utilisateur
WHEN le Core répond 401
THEN le cookie portail est invalidé et la porte de connexion est reprise
WHEN le Core est temporairement indisponible sans 401
THEN DG conserve la session locale et propose de réessayer
```

### AC-002-10 — Déconnexion centrale

```gherkin
GIVEN une session DG ouverte
WHEN la personne clique Se déconnecter
THEN la session Core est révoquée
AND le cookie DG est supprimé
AND le front-channel satellite gouverné est exécuté lorsqu'il existe
```

### AC-002-11 — Durée de session cohérente

```gherkin
GIVEN une session Core active
WHEN son expiration glisse selon le contrat Core
THEN le cookie portail ne doit pas expirer avant la session Core uniquement parce qu'il conserve une ancienne échéance
AND DG ne doit jamais prolonger au-delà d'une échéance réellement attestée par le Core
```

## Plan de développement autorisé

1. corriger le payload de renvoi et le tester ;
2. sécuriser et utiliser `next` ;
3. rendre la vérification en attente reprenable côté DG sans secret ;
4. préserver les références de reprise sur `VERIFICATION_NON_LIVREE` ;
5. ajouter des tests CAP-002 sur les décisions pures / contrats DG ;
6. obtenir la décision ou primitive Core pour l'expiration glissante avant validation finale ;
7. preview → tests navigateur → production → preuves ;
8. seulement après `VALIDÉ PROD`, ouvrir CAP-003.

## Gate actuel

La spec est auditée. **CAP-002 reste EN SPEC jusqu'au commit de cette fiche, puis peut passer EN DEV sur cette branche. CAP-003 reste BLOQUÉ.**

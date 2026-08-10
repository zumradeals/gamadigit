# AI HANDOFF — DG Afrique

> **Lire ce fichier avant toute modification du projet.** Il doit permettre à une autre IA de reprendre le chantier sans accès à la conversation précédente.

## 1. Projet canonique

- Dépôt : `zumradeals/gamadigit`
- Branche de production : `cursor`
- Production : `https://dgafrique.com`
- Stack actuelle : Next.js 15, React 19, TypeScript, Tailwind, Supabase/PostgreSQL, GAMAD Core, GeniusPay.
- Laravel V2 n'est plus la trajectoire active de DG Afrique.

## 2. Règle de chantier prioritaire

Le développement suit désormais **strictement CAP-001 → CAP-084**.

Avant toute action :

1. lire `docs/capacites/CAP-MASTER-TRACKER.md` ;
2. trouver le premier CAP qui n'est pas `VALIDÉ PROD` ;
3. ne travailler que sur ce CAP ;
4. appliquer `docs/capacites/CAP-PRODUCTION-GATE.md` ;
5. mettre à jour `docs/capacites/CAP-HISTORY.md` et ce fichier avant de terminer la session.

**Aucun CAP N+1 ne doit être ouvert tant que CAP N n'est pas VALIDÉ PROD.**

Du code peut déjà exister pour des CAP futurs. Il ne doit pas être supprimé automatiquement, mais il est considéré comme **préexistant / non validé** jusqu'à l'ouverture officielle du CAP.

## 3. Gate actif

**CAP-001 — IDENTITÉ PERSONNE**

Statut : `EN SPEC`.

Fiche : `docs/capacites/specs/CAP-001-identite-personne.md`.

Ne pas commencer CAP-002 avant que CAP-001 ait ses preuves de production et soit marqué `VALIDÉ PROD` dans le registre maître.

## 4. Architecture d'identité à préserver

- GAMAD Core est la source canonique de l'identité et de l'authentification.
- DG Afrique ne doit pas remplacer cette identité par Supabase Auth.
- Supabase sert aux données métier DG Afrique/ZUMRA, pas à devenir une seconde autorité d'identité.
- La session portail DG Afrique contient une session Core signée dans un cookie HttpOnly sécurisé.
- `/api/genesis/account/me` relit l'identité canonique auprès du Core.
- Un `401` Core invalide réellement la session ; une panne transitoire ne doit pas déconnecter l'utilisateur.
- Les identifiants techniques Core ne doivent pas être exposés inutilement dans l'UI utilisateur.

## 5. Satellites et incident SSO en attente de preuve finale

Principe produit :

> Le Core authentifie ; DG Afrique orchestre ; les satellites exécutent.

- DG Afrique est la porte visible d'accès aux satellites.
- GamaDrive est le premier et, à ce stade, seul satellite réel fédéré en production.
- Le chantier interne GamaDrive appartient à un autre flux de travail ; ne pas développer ses fonctionnalités depuis ce dépôt.
- Les satellites ne doivent présenter ni login ni logout indépendant à l'utilisateur.

### Dépendances déployées hors de ce dépôt

- Core PR #81 : revérification de la session centrale liée à une session satellite.
- GamaDrive PR #3 : session Laravel bornée par la session Core + revérification périodique (~120 s), appliquée aux routes authentifiées.
- Core PR #82 : champ gouverné `logout_url` sur les environnements produit.
- GamaDrive PR #4 : `GET /federation/deconnexion-centrale`, qui ferme uniquement la session locale puis retourne vers le lanceur DG.

### Travail DG Afrique déployé

Le flux est en production sur `cursor` :

1. DG lit dans le registre Core le `logout_url` de l'environnement `PRODUCTION` actif du satellite ;
2. DG ferme la session Core utilisateur et efface le cookie portail ;
3. l'API logout retourne `nextLogoutUrl` ;
4. le navigateur navigue vers ce front-channel ;
5. GamaDrive ferme sa session Laravel locale puis revient au lanceur DG ;
6. sans session centrale, le lanceur doit revenir à l'authentification DG.

Commits applicatifs :

- `e2757747d0035ba029ed5e1b8e5dd026d4ca767a`
- `8f8529f545065af282e49fd1c8e89952fb0264da`
- `adaf81dcde4e5f94336fa8ce7d7cc55f6ae2d8bd`
- `d52287fcf24c63d4b480c28e716b91178633765c`

Production vérifiée : `cursor` au commit `75c722d735090484e1cdbea5f278cfa5984b21c3`, déploiement Vercel `dpl_4kekTkZZQnfVBbLSnikqEkxGBBKb` — READY.

Ne pas coder en dur l'URL de logout du satellite dans le flux DG. La valeur doit venir du registre Core.

### Geste opérateur Core terminé

L'environnement PRODUCTION de `PRD-GAMAD-002` est désormais déclaré par la voie gouvernée `AccesProduits::declarerEnvironnement()` sous l'autorité `AUT-GAMAD-001`.

Valeurs actives rapportées :

- `api_base_url = https://gamadrive.dgafrique.com`
- `health_url = https://gamadrive.dgafrique.com/health`
- `logout_url = https://gamadrive.dgafrique.com/federation/deconnexion-centrale`
- `audience_federation = PRD-GAMAD-002`

Le produit reste ACTIF et fédérable. La décision CAP-CORE-004 a été `PERMIS` et l'opération a été journalisée comme `ENVIRONNEMENT_PRODUIT_DECLARE` / `EXECUTEE`. L'opérateur a indiqué qu'il s'agissait de la première déclaration persistée de cet environnement, donc aucune version précédente n'a été clôturée.

### Test navigateur obligatoire restant

`connexion DG → ouverture GamaDrive → déconnexion DG → accès direct immédiat à GamaDrive`

Résultat attendu : GamaDrive ne conserve aucune session utilisateur ; le navigateur repasse par DG et demande une authentification centrale.

Ne considérer l'incident SSO clos qu'après cette preuve réelle. Le fallback périodique GamaDrive reste utile mais n'est pas la preuve du logout immédiat.

## 6. ZUMRA

Des écrans ZUMRA existent déjà et ont été refondus : profil, adhésion, paiement initial, réseau, groupe, invitation et responsabilités.

Ils ne sont **pas automatiquement VALIDÉS** sous le nouveau système CAP. Lors du passage des CAP ZUMRA, auditer le comportement réel, les APIs, les règles de paiement, les responsabilités et les preuves de production.

Règles métier déjà retenues à préserver lors de l'audit :

- le compte DG Afrique est indépendant de l'adhésion ZUMRA ;
- l'adhésion devient active uniquement après confirmation serveur du paiement initial ;
- la contribution mensuelle est distincte du paiement d'adhésion ;
- une Zumra en formation progresse vers 5 membres et 5 responsabilités fondatrices ;
- ne pas inventer de catalogue public ou de matching tant qu'aucune API réelle ne le fournit.

## 7. Expérience utilisateur

- Ne pas exposer inutilement le mot interne `GAMAD` dans le portail public/membre.
- Préférer les concepts visibles : DG Afrique, ZUMRA, GamaDrive, services, apprentissage, projets, etc.
- Le portail doit être simple pour un utilisateur non technique.
- Les écrans doivent s'appuyer sur des données réelles ; pas de montants, matching, réputation ou statistiques fictives.
- Le design Claude est une source d'inspiration UX, pas une source de règles métier.

## 8. Sécurité

- Ne jamais écrire de secret dans les docs, commits, logs visibles ou réponses.
- Ne jamais demander à l'utilisateur de coller un secret complet dans une conversation.
- Ne pas placer les jetons fédérés dans les URLs.
- Ne pas utiliser de force push ou d'opération destructive sans autorisation explicite.
- Pour la production : feature branch → preview → vérification → fast-forward sûr vers `cursor`.

## 9. État technique de référence au 2026-08-10

- Production applicative front-channel : `cursor` au commit `75c722d735090484e1cdbea5f278cfa5984b21c3`.
- Déploiement production vérifié : `dpl_4kekTkZZQnfVBbLSnikqEkxGBBKb` — READY.
- Le registre Core porte désormais le `logout_url` PRODUCTION actif de GamaDrive.
- Gate fonctionnel : **CAP-001 reste NON VALIDÉ PROD** tant que son gate complet n'est pas satisfait.

## 10. Reprise exacte

Si une IA reprend maintenant :

1. ne pas ouvrir CAP-002 ;
2. faire exécuter le test navigateur de déconnexion immédiate ;
3. consigner le résultat dans `CAP-HISTORY.md` ;
4. si le test est vert, clôturer l'incident SSO ;
5. reprendre ensuite le gate CAP-001 et ses preuves restantes ;
6. ne marquer CAP-001 `VALIDÉ PROD` que lorsque son propre gate complet est satisfait.

## 11. Fichiers à maintenir à chaque session

- `docs/capacites/CAP-MASTER-TRACKER.md`
- `docs/capacites/CAP-HISTORY.md`
- `docs/AI-HANDOFF.md`
- la fiche du CAP actif dans `docs/capacites/specs/`

Si ces fichiers ne reflètent pas l'état réel de fin de session, le travail n'est pas considéré terminé.

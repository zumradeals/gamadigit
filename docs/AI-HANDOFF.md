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

## 5. Satellites

Principe produit :

> Le Core authentifie ; DG Afrique orchestre ; les satellites exécutent.

- DG Afrique est la porte visible d'accès aux satellites.
- GamaDrive est le premier satellite fédéré en production.
- Le chantier interne GamaDrive appartient à un autre flux de travail ; ne pas développer ses fonctionnalités depuis ce dépôt.
- DG Afrique ne doit gérer que son registre, son lanceur et son expérience d'accès quand les CAP correspondants seront ouverts.
- Le modèle cible est une connexion/déconnexion centrale : les satellites ne doivent pas exposer une seconde logique d'identité comme produit indépendant.

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

## 9. État technique de référence au 2026-08-09

Dernier commit applicatif production avant la mise en place de cette gouvernance :

`d906d8a721a9193e326fbfe57159c2ce9d494b07`

Dernier déploiement applicatif contrôlé :

`dpl_BVvMA4xfg1raB4naN4hK3nPp9fwx` — READY.

Les commits documentaires de gouvernance CAP peuvent avancer après ce point sans changer le comportement applicatif.

## 10. Reprise exacte

Si une IA reprend maintenant :

1. ne pas continuer ZUMRA, GamaDrive, Apprendre ou un autre module ;
2. auditer CAP-001 contre le référentiel, le Core et le comportement production ;
3. compléter sa fiche ;
4. identifier les écarts ;
5. corriger uniquement les écarts CAP-001 ;
6. tester en preview ;
7. déployer ;
8. exécuter les tests de production ;
9. consigner les preuves ;
10. seulement ensuite marquer CAP-001 `VALIDÉ PROD` et ouvrir CAP-002.

## 11. Fichiers à maintenir à chaque session

- `docs/capacites/CAP-MASTER-TRACKER.md`
- `docs/capacites/CAP-HISTORY.md`
- `docs/AI-HANDOFF.md`
- la fiche du CAP actif dans `docs/capacites/specs/`

Si ces fichiers ne reflètent pas l'état réel de fin de session, le travail n'est pas considéré terminé.

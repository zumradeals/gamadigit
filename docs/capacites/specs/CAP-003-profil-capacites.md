# CAP-003 — PROFIL DE CAPACITÉS

- **Famille :** Fondations humaines et ZUMRA
- **Domaine :** Profil métier DG Afrique
- **Propriétaire d'exécution :** DG Afrique
- **Statut gate :** **EN DEV**
- **CAP précédent :** CAP-002 — **VALIDÉ PROD**
- **CAP suivant :** CAP-004 — BLOQUÉ
- **Branche :** `cap/003-profil-capacites`

## Source fonctionnelle V0.1

Le référentiel définit CAP-003 ainsi :

- **Finalité :** décrire une personne par ce qu'elle est capable de faire, ce qu'elle souhaite apprendre et ce qu'elle cherche à accomplir.
- **Capacité :** le profil devient une source structurée de capacités plutôt qu'une simple fiche biographique.
- **Points clés :** identité et localisation ; activité actuelle ; compétences existantes ; compétences recherchées ; domaines d'intérêt et intentions.
- **Garde-fou :** le profil doit rester utile à l'orientation, sans réduire la personne à un score.

## Interprétation produit

Le profil appartient au **compte DG Afrique**, pas au Programme ZUMRA.

Une personne doit pouvoir créer et enrichir son profil immédiatement après avoir créé son compte DG, même si elle ne rejoint jamais ZUMRA. ZUMRA peut ensuite consommer les informations utiles de ce profil mais ne doit pas être la condition d'existence du profil.

L'identité canonique (nom/référence) reste fournie par GAMAD Core. DG Afrique conserve uniquement les données métier du profil, attachées à `core_identity_reference`.

## Limites de CAP-003

CAP-003 structure les grandes dimensions du profil mais ne cherche pas encore à résoudre en profondeur :

- CAP-004 — modèle riche de COMPÉTENCES ;
- CAP-005 — moteur APPRENTISSAGE ;
- CAP-023/024 — graphe complet de capacités et profil comme source généralisée ;
- CAP-026 — modèle riche d'INTENTION ;
- CAP-029/030/031 — découverte, matching et explicabilité.

Pour CAP-003, compétences, apprentissages, domaines et intentions restent des listes structurées simples. Leur sémantique avancée viendra à leur CAP.

## Audit de l'existant

Avant CAP-003, les données pertinentes existaient dans `zumra_member_profiles`, avec localisation, téléphone, compétences, apprentissages, activité, formation, secteurs, intentions et préférences.

Problème architectural : `zumra_member_profiles.core_identity_reference` possède une FK vers `zumra_memberships.core_identity_reference`. Le profil ne pouvait donc exister qu'après création d'une adhésion ZUMRA.

De plus, `/api/zumra/me` retournait le profil uniquement après avoir trouvé une adhésion et `/api/zumra/enroll` créait adhésion + profil ensemble.

**GAP-003-A : profil DG dépendant de ZUMRA — CORRIGÉ.**

## Architecture retenue

Nouvelle table métier canonique : `public.dg_person_profiles`.

Principes :

1. clé = `core_identity_reference` fournie par GAMAD Core ;
2. aucune identité personnelle parallèle dans Supabase ;
3. aucune FK vers `zumra_memberships` ;
4. profil disponible pour tout compte DG authentifié ;
5. RLS activée, accès applicatif via API serveur ;
6. profils ZUMRA existants recopiés automatiquement à la migration ;
7. pont de compatibilité temporaire vers `zumra_member_profiles` uniquement pour les membres ZUMRA existants ;
8. existence d'un profil DG ≠ adhésion ou consentement ZUMRA ;
9. les intentions libres DG ne sont jamais remplacées par les choix contrôlés du formulaire d'adhésion ZUMRA ;
10. aucun score ou pourcentage de valeur personnelle n'est affiché.

## Données CAP-003

- nom canonique affiché depuis Core ;
- pays ;
- ville/localité ;
- activité actuelle ;
- compétences existantes (liste simple) ;
- indication « je commence sans compétence particulière » ;
- objectifs d'apprentissage (liste simple) ;
- domaines d'intérêt (liste simple) ;
- intentions / ce que la personne cherche à accomplir (liste simple) ;
- consentement à recevoir des orientations/recommandations ;
- champs historiques compatibles : téléphone, formation, mode de participation.

Aucun score global de personne ou de valeur humaine n'est calculé ni présenté.

## Parcours principal attendu

1. personne connectée → Mon espace ;
2. ouvre **Mon profil** ;
3. voit son nom issu de l'identité DG/Core ;
4. renseigne librement situation, savoir-faire, apprentissages, domaines et intentions ;
5. enregistre ;
6. revient plus tard et retrouve les données ;
7. ces données apparaissent dans Mon espace même sans adhésion ZUMRA ;
8. cliquer sur « Rejoindre ZUMRA » reste une action séparée.

## Critères d'acceptation minimum

- **AC-003-01** un compte DG non membre ZUMRA peut avoir un profil.
- **AC-003-02** le profil est rattaché uniquement à la référence Core de la session.
- **AC-003-03** l'identité affichée provient de Core et n'est pas recréée dans Supabase Auth.
- **AC-003-04** localisation, activité, savoir-faire, apprentissages, domaines et intentions sont enregistrables et relisibles.
- **AC-003-05** l'absence de compétence peut être exprimée sans rendre le profil invalide.
- **AC-003-06** aucun score global de personne n'est créé ou affiché.
- **AC-003-07** le profil existant d'un membre ZUMRA est repris lors de la migration.
- **AC-003-08** ZUMRA peut réutiliser les champs partagés sans devenir propriétaire du profil DG ni écraser les intentions libres DG.
- **AC-003-09** lecture et mutation exigent une session Core réellement valide ; mutation protégée same-origin.
- **AC-003-10** parcours principal validé en production sur `dgafrique.com`.

## État d'implémentation

- migration `20260811234000_dg_person_profiles.sql` créée et appliquée au projet Supabase `gamadigit` ;
- table `dg_person_profiles` confirmée avec RLS, clé primaire Core et aucune FK vers ZUMRA ;
- profils ZUMRA existants backfillés ;
- contrat `src/lib/profile/capability-profile.ts` créé ;
- API indépendante `/api/genesis/profile` créée ;
- cette API vérifie la session actuelle auprès du Core et renouvelle le cookie uniquement à l'échéance attestée ;
- écran `/espace/profil` raccordé ;
- Mon espace charge `/api/genesis/profile` indépendamment de `/api/zumra/me` ;
- `/api/zumra/me` ne transforme pas un profil DG en adhésion : sans membership il retourne seulement `enrolled:false` ;
- pour un vrai membre ZUMRA, `/api/zumra/me` réutilise les champs partagés du profil DG tout en conservant les intentions propres à ZUMRA ;
- `/api/zumra/enroll` synchronise les champs partagés sans écraser les intentions libres du profil DG ;
- aucun pourcentage de complétude n'est présenté comme score du profil.

## Tests automatisés

Le head code `543bd401c4dc0609f2d88c43ed64fc21600ae04a` passe **27/27 tests** : CAP-001 et CAP-002 restent verts, plus 9 tests CAP-003 couvrant indépendance ZUMRA, liaison à l'identité Core, session Core live, conservation des champs, séparation des consentements/intention et absence de scoring.

## Gate

**CAP-003 reste EN DEV tant que le parcours principal n'a pas été validé sur `dgafrique.com`. CAP-004 reste BLOQUÉ.**

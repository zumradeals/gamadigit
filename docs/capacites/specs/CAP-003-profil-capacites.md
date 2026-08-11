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

Pour CAP-003, les compétences, apprentissages, domaines et intentions peuvent rester des listes structurées simples. Leur sémantique avancée viendra à leur CAP.

## Audit de l'existant

Avant CAP-003, les données pertinentes existaient dans `zumra_member_profiles`, avec : localisation, téléphone, compétences, apprentissages, activité, formation, secteurs, intentions et préférences.

Problème architectural : `zumra_member_profiles.core_identity_reference` possède une FK vers `zumra_memberships.core_identity_reference`. Le profil ne peut donc exister qu'après création d'une adhésion ZUMRA.

De plus, `/api/zumra/me` retournait le profil uniquement après avoir trouvé une adhésion et `/api/zumra/enroll` créait adhésion + profil ensemble.

**GAP-003-A : profil DG dépendant de ZUMRA — BLOQUANT, correction en cours.**

## Architecture retenue

Nouvelle table métier canonique : `public.dg_person_profiles`.

Principes :

1. clé = `core_identity_reference` fournie par GAMAD Core ;
2. aucune identité personnelle parallèle dans Supabase ;
3. aucune FK vers `zumra_memberships` ;
4. profil disponible pour tout compte DG authentifié ;
5. RLS activée, accès applicatif via API serveur ;
6. profils ZUMRA existants recopiés automatiquement à la migration ;
7. pont de compatibilité maintenu temporairement vers `zumra_member_profiles` pour ne pas casser ZUMRA avant son CAP officiel.

## Données CAP-003

- nom canonique affiché depuis Core quand disponible ;
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

Aucun score global de personne ou de valeur humaine n'est calculé.

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
- **AC-003-03** l'identité affichée provient de Core quand disponible et n'est pas recréée dans Supabase Auth.
- **AC-003-04** localisation, activité, savoir-faire, apprentissages, domaines et intentions sont enregistrables et relisibles.
- **AC-003-05** l'absence de compétence peut être exprimée sans rendre le profil vide/invalide.
- **AC-003-06** aucun score global n'est créé.
- **AC-003-07** le profil existant d'un membre ZUMRA est repris sans perte lors de la migration.
- **AC-003-08** ZUMRA peut lire le profil DG sans devenir son propriétaire.
- **AC-003-09** mutation protégée same-origin et session obligatoire.
- **AC-003-10** parcours principal validé en production sur `dgafrique.com`.

## État d'implémentation

- migration `20260811234000_dg_person_profiles.sql` créée et appliquée avec succès au projet Supabase `gamadigit` ;
- profils ZUMRA existants backfillés ;
- contrat `src/lib/profile/capability-profile.ts` créé ;
- API indépendante `/api/genesis/profile` créée ;
- `/api/zumra/me` lit désormais le profil canonique DG, y compris pour un utilisateur non enrôlé ;
- `/api/zumra/enroll` synchronise le profil vers la table DG et conserve le pont legacy ZUMRA ;
- écran `/espace/profil` en cours de raccord final.

## Gate

**CAP-003 reste EN DEV. CAP-004 reste BLOQUÉ.**

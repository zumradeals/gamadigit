# AI HANDOFF — DG Afrique

> **Lire ce fichier avant toute modification.** Il doit permettre à une autre IA de reprendre sans accès à la conversation précédente.

## Projet canonique

- Dépôt : `zumradeals/gamadigit`
- Production : branche `cursor`, `https://dgafrique.com`
- Stack : Next.js 15, React 19, TypeScript, Tailwind, Supabase/PostgreSQL, GAMAD Core, GeniusPay
- Laravel V2 n'est plus la trajectoire active.

## Règle de chantier

Le développement suit **CAP-001 → CAP-084**.

1. lire `docs/capacites/CAP-MASTER-TRACKER.md` ;
2. prendre le premier CAP non `VALIDÉ PROD` ;
3. ne travailler que sur ce CAP ;
4. appliquer `docs/capacites/CAP-PRODUCTION-GATE.md` ;
5. maintenir fiche, preuve, historique, tracker et ce handoff ;
6. aucun CAP N+1 ne s'ouvre tant que CAP N n'est pas `VALIDÉ PROD`.

Du code futur peut déjà exister : il reste préexistant/non validé jusqu'à son tour.

### Règle de profondeur adoptée le 2026-08-11

Le gate ne recherche plus la perfection exhaustive avant de progresser. Un CAP peut être validé lorsque le **parcours principal réel**, les **invariants sécurité/données critiques**, les **tests automatisés utiles** et la **production** sont verts. Les raffinements UX et cas rares non bloquants vont au backlog d'amélioration continue.

## État officiel — 2026-08-11

### CAP-001 — IDENTITÉ PERSONNE

**VALIDÉ PROD.**

Preuve : `docs/capacites/proofs/CAP-001-2026-08-10.md`.

### CAP-002 — COMPTE DG AFRIQUE

**VALIDÉ PROD.**

Preuve finale : `docs/capacites/proofs/CAP-002-2026-08-10.md`.

Production applicative finale :

- commit `da39eb0dc7a2916c464e3e652591426fd7182535` ;
- Vercel `dpl_FwwqzsHCSyccApqPS5DhfBPHGuAH` — READY ;
- **18/18 tests verts** ;
- aliases `dgafrique.com` et `www.dgafrique.com`.

Core :

- PR #83 fusionnée ;
- `gamad-core/main` `67b2ca74c7b4e9e510d1bb4a0fa5f094e56d952b` ;
- `GET /api/v1/sessions/current` live ;
- DG renouvelle son cookie uniquement à l'`expire_le` attesté par Core.

Tests utilisateur réels validés : connexion, Mon espace, déconnexion, `next=/formations`, redirection d'un utilisateur déjà connecté, création + email + vérification + première connexion d'un nouveau compte.

Incident trouvé puis corrigé : un vieux cookie de retour GamaDrive pouvait rediriger une nouvelle identité vers le satellite. Création de compte et déconnexion effacent désormais cet état ; le lien GamaDrive dans Mon espace utilise `prefetch={false}`. Validation utilisateur finale : **« Mon espace DG OK »**.

Le re-test manuel spécifique reload/renvoi d'un second code reste un backlog non bloquant ; les contrats correspondants sont couverts automatiquement.

### CAP-003 — PROFIL DE CAPACITÉS

**EN SPEC — seul gate actif. CAP-004 à CAP-084 restent BLOQUÉS.**

Source V0.1 :

- **Finalité :** décrire une personne par ce qu'elle est capable de faire, ce qu'elle souhaite apprendre et ce qu'elle cherche à accomplir.
- **Capacité :** le profil devient une source structurée de capacités plutôt qu'une simple fiche biographique.
- **Points clés :** identité et localisation ; activité actuelle ; compétences existantes ; compétences recherchées ; domaines d'intérêt et intentions.
- **Garde-fou :** le profil doit rester utile à l'orientation sans réduire la personne à un score.

Important : CAP-003 décrit le **profil comme structure utile d'orientation**. CAP-004 reste responsable de la sémantique approfondie des compétences ; CAP-005 de l'apprentissage ; CAP-026 des intentions ; CAP-023/024 du graphe/profil-source à leur tour. CAP-003 ne doit pas avaler ces CAP futurs.

## Architecture à préserver

- GAMAD Core reste l'autorité canonique d'identité/authentification.
- `session.entity` / référence d'identité Core est le point d'attache stable.
- Supabase/PostgreSQL porte les données métier DG/ZUMRA, pas une identité membre parallèle.
- Supabase Auth historique reste un plan de contrôle admin/CMS, pas l'identité canonique membre.
- DG Afrique est le portail/orchestrateur ; les satellites restent autonomes.
- Ne pas modifier GamaDrive sans autorisation spécifique.
- Éviter de modifier GAMAD Core hors nécessité explicite ; CAP-003 devrait rester côté DG métier.

## Discipline Git / prod

- branche dédiée pour le CAP actif ;
- preview + tests ;
- comparaison avec `cursor` ;
- fast-forward `force:false` uniquement si ahead-only ;
- attendre Vercel READY ;
- test production du parcours principal ;
- documenter puis `VALIDÉ PROD`.

## Sécurité

- aucun secret dans docs/logs/messages ;
- ne jamais demander à l'utilisateur de coller un secret complet ;
- pas de force push ;
- ne pas fabriquer de données critiques pour faire passer un test ;
- ne pas réduire un profil humain à une note ou un score global.

## Prochain geste exact

1. créer la branche `cap/003-profil-capacites` depuis `cursor` après clôture CAP-002 ;
2. auditer le profil déjà présent dans le code et les tables Supabase métier ;
3. séparer ce qui appartient réellement à CAP-003 de CAP-004/005/026 et des CAP futurs ;
4. écrire `docs/capacites/specs/CAP-003-profil-capacites.md` ;
5. implémenter uniquement les écarts nécessaires au parcours principal ;
6. tests → preview → production → validation rapide ;
7. seulement ensuite CAP-004 s'ouvre.

## Fichiers obligatoires à maintenir

- `docs/capacites/CAP-PRODUCTION-GATE.md`
- `docs/capacites/CAP-MASTER-TRACKER.md`
- `docs/capacites/CAP-HISTORY.md`
- `docs/AI-HANDOFF.md`
- fiche du CAP actif
- dossier de preuve du CAP actif

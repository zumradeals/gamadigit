# Mission Claude Code — DG Afrique, recentrage V1

## Bonne nouvelle

La réécriture Laravel V2 est annulée. **Le `dgafrique.com` actuel devient la base définitive de la Super App.** Ton design JSX n'est pas abandonné : il devient la source visuelle et UX de la refonte progressive du produit réel.

Le dépôt canonique est `zumradeals/gamadigit`, branche `cursor`. Stack assumée : Next.js 15, React 19, TypeScript, Tailwind, Supabase/PostgreSQL, GAMAD Core et GeniusPay.

## Ton rôle

Agis comme **architecte produit + architecte UX + design-system engineer**, pas comme simple maquettiste et pas comme inventeur d'un nouveau backend.

### Avant toute modification

1. Lire le code actuel de `gamadigit` et identifier ce qui fonctionne réellement.
2. Lire `docs/architecture/ADR-2026-08-09-v1-superapp.md`.
3. Lire `docs/capacites/README.md`, `CAPABILITY-INDEX.md`, `OVERRIDES.md` et les specs critiques.
4. Lire `docs/design/claude-phase0/COVERAGE.md` et `ADAPTATION-NEXTJS.md`.
5. Pour les satellites, considérer CAP-CORE-022 comme contrat réel de fédération ; ne construire aucun login GAMAD dans GamaDrive.

## Méthode

- **Pas de big bang.** Préserver le portail en production et remplacer écran par écran.
- Ton ancien handoff Laravel est une archive ; adapte les composants React vers TSX/Next.js.
- Ne remplace jamais Auth Core, ZUMRA, GeniusPay ou Supabase réel par des mocks.
- Commencer par une matrice `écran actuel → capacités → données → écran Claude → risques → migration`.
- Extraire progressivement un App Shell et un design system compatibles avec les composants existants.
- Garder les routes publiques et le SEO actuels stables.
- Les 84 capacités sont des contrats, pas un menu.
- Chaque nouvelle page doit indiquer quelles capacités elle matérialise.

## ZUMRA — mise à jour essentielle

ZUMRA est un **réseau social d'action** : fil, relations, commentaires, partage et messagerie peuvent exister s'ils servent apprentissage, besoins, groupes et projets.

Le cycle financier est central :

`adhésion initiale → membre actif → contribution mensuelle → capacité financière communautaire → projets amorcés → résultats/preuves → partenaires éventuels`.

La contribution mensuelle n'est pas une taxe décorative. Elle doit permettre au membre de comprendre ce que la communauté peut financer avec ses propres moyens avant les partenaires. Elle reste distincte d'un investissement et ne promet aucun rendement.

Conçois les écrans manquants : **Ma contribution**, **Capacité/Fonds communautaire**, **Projets soutenus**, **Décaissements / preuves / impact**, avec transparence progressive et sans inventer la gouvernance non décidée.

## Satellites

DG Afrique est le portail humain d'ouverture. Pour GamaDrive :

- l'utilisateur s'authentifie dans DG Afrique ;
- DG demande au Core l'ouverture `PRD-GAMAD-002` ;
- le satellite vérifie le jeton avec sa propre session de service ;
- aucun mot de passe GAMAD ne transite par GamaDrive.

Conçois dans DG Afrique un espace **Satellites / Mes outils** et l'expérience `Ouvrir GamaDrive`, sans absorber GamaDrive dans le code du portail.

## Première livraison attendue

Ne redessine pas tout immédiatement. Livre d'abord :

1. audit architecture/UX du portail actuel ;
2. matrice de migration ;
3. proposition de structure de domaines compatible avec le repo ;
4. adaptation du design system au Tailwind existant ;
5. première vague d'intégration sûre (shell + home connectée ou autre tranche verticale justifiée) ;
6. liste précise des écrans supplémentaires nécessaires pour ZUMRA contributions et satellites.

Objectif : **donner plus de pouvoir au produit qui existe déjà**, pas refaire DG Afrique ailleurs.

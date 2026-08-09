# ADR-2026-08-09 — DG Afrique V1 devient la Super App canonique

## Décision

La réécriture Laravel dite « V2 » est annulée. Le produit canonique reste `dgafrique.com`, développé dans `zumradeals/gamadigit` sur la stack existante : **Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase/PostgreSQL et GAMAD Core**.

La cible fonctionnelle reste ambitieuse : DG Afrique devient progressivement le **portail applicatif / Super App** capable d'orchestrer les 84 capacités du référentiel, le Programme ZUMRA, les projets, les opportunités et les satellites. Le changement est architectural et produit ; il n'exige pas un changement immédiat de framework.

## Invariants

1. **GAMAD Core reste la source canonique d'identité et de fédération.** DG Afrique ne crée pas un second système d'identité.
2. **Supabase est assumé comme plateforme de données métier** pour la phase actuelle. Supabase Auth n'est pas introduit pour remplacer le Core.
3. **Les comportements déjà éprouvés sont conservés** : compte DG Afrique/Core, session, dossier ZUMRA, paiement d'adhésion GeniusPay, activation, groupes ZUMRA, contenus publics et opportunités.
4. **Le design livré par Claude est conservé** comme source visuelle et UX. Les instructions Laravel/Inertia du handoff sont obsolètes ; les composants React doivent être adaptés à Next.js/TypeScript.
5. **Pas de big bang.** Chaque écran et domaine est migré progressivement avec parité fonctionnelle et possibilité de retour.
6. **Les 84 capacités ne deviennent jamais 84 entrées de menu.** Elles servent de contrats fonctionnels et de matrice de développement.
7. **DG Afrique orchestre ; le Core fournit les primitives ; les satellites gardent leurs données métier.**
8. **La fédération satellite utilise CAP-CORE-022.** DG Afrique est le portail humain qui déclenche l'ouverture d'un satellite pour une session Core authentifiée.
9. **La contribution mensuelle ZUMRA est un mécanisme stratégique central.** Elle alimente une capacité financière communautaire destinée à amorcer des projets avant l'arrivée éventuelle de partenaires externes. Elle reste distincte du paiement initial d'adhésion et d'un investissement.
10. Une future migration self-hosted n'est envisagée que lorsqu'elle devient économiquement et opérationnellement justifiée.

## Architecture produit cible

```text
GAMAD Core
  identité · sessions · fédération · primitives transversales
        │
        ▼
DG Afrique / gamadigit
  portail public + application personnelle + orchestration
        │
        ├── Identity / Profile
        ├── Capabilities / Learning / Discovery
        ├── ZUMRA / Social / Contributions
        ├── Projects / Opportunities / Accompaniment
        ├── Organizations / Partners
        └── Satellites
              └── GamaDrive, puis autres produits fédérés
```

## Stratégie de migration UX

- Le site public reste disponible pendant toute la refonte.
- Les nouvelles primitives visuelles sont intégrées dans un espace partagé, puis utilisées écran par écran.
- Les mocks Claude sont des contrats de forme, jamais une source de vérité.
- Les pages existantes conservent leurs vraies données Core/Supabase/GeniusPay.
- Un écran n'est remplacé qu'après vérification de ses états : visiteur, connecté, vide, chargement, erreur, permissions et états métier.

## Dépôt Laravel `dg-afrique`

Il n'est plus la cible produit. Il ne doit pas recevoir de nouvelles fonctionnalités DG Afrique tant qu'une décision ultérieure explicite ne le réactive pas. Aucune suppression destructive n'est requise.

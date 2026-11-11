# Adaptation du design Claude au Next.js actuel

Le kit original ciblait Laravel + Inertia. Cette cible est annulée.

## À conserver

- design system ;
- `components/`, `features/`, `layouts/`, `pages/` comme grammaire UX ;
- séparation primitive visuelle / feature métier ;
- props explicites, composants sans accès direct aux mocks ;
- progressive disclosure ;
- états de capacités et recommandations expliquées ;
- accessibilité et animations minimales.

## À remplacer

- Inertia / Ziggy → App Router Next.js, `Link`, Server Components et Client Components lorsque nécessaire ;
- props Inertia → données chargées côté serveur / services existants ;
- Laravel controllers → Route Handlers et bibliothèques serveur Next.js déjà présentes ;
- mocks → Core, Supabase et contenus réels ;
- instruction « ne pas introduire de backend Next.js » → obsolète : le portail en possède déjà un et l'utilise pour protéger les secrets.

## Architecture recommandée

```text
src/
  app/                 routes Next.js
  components/          primitives / shell / composants partagés
  domains/
    identity/
    capabilities/
    learning/
    discovery/
    zumra/
    projects/
    opportunities/
    satellites/
    finance/
    organizations/
  lib/                  clients Core, Supabase, GeniusPay, helpers purs
```

Les domaines ne doivent pas répliquer ce qui existe déjà dans `src/lib`; la migration consiste à clarifier progressivement les frontières, pas à déplacer du code pour le plaisir.

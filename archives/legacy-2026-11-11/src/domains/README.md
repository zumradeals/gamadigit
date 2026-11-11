# Domaines applicatifs

Ce dossier est la cible progressive pour clarifier les frontières métier sans réécriture massive. Il ne faut pas déplacer du code stable tant qu'un domaine n'est pas activement refactoré.

Domaines cibles : `identity`, `profiles`, `capabilities`, `learning`, `discovery`, `zumra`, `projects`, `opportunities`, `satellites`, `finance`, `organizations`, `notifications`.

Chaque domaine peut exposer : types, requêtes serveur, actions, règles pures et adaptateurs UI. Les clients techniques partagés (GAMAD Core, Supabase, GeniusPay) restent dans `src/lib` tant qu'un déplacement n'apporte pas une frontière plus nette.

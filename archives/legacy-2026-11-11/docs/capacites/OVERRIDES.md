# Addenda au référentiel V0.1

Ces clarifications ont priorité sur une lecture littérale du référentiel lorsqu'elles décrivent une décision métier plus récente ou un comportement déjà éprouvé.

## OVR-001 — ZUMRA est un réseau social d'action

Les capacités CAP-019 à CAP-022 et CAP-055 à CAP-059 peuvent être développées progressivement. ZUMRA peut avoir fil d'activité, relations entre membres, commentaires, partage et messagerie. Le garde-fou reste l'absence de mécanique d'attention ou de classement de valeur humaine : le social sert l'apprentissage, les besoins, les projets et l'action collective.

## OVR-002 — Adhésion initiale et contribution mensuelle sont deux flux distincts

Le paiement initial d'adhésion au Programme ZUMRA active le statut membre. La contribution mensuelle intervient ensuite comme flux périodique distinct. Un paiement de contribution ne doit jamais activer une adhésion en attente.

## OVR-003 — La contribution finance d'abord la capacité d'action communautaire

La contribution mensuelle n'est pas une simple cotisation administrative. Son objectif stratégique premier est d'alimenter une capacité financière collective permettant d'amorcer et de financer des projets de la communauté **avant** que des partenaires externes s'y intéressent.

L'utilisateur doit pouvoir comprendre que sa contribution sert à produire des résultats : fonds collectés, engagements, projets soutenus, décaissements et preuves d'usage doivent devenir lisibles selon les permissions et règles de gouvernance.

Cette contribution :

- n'achète pas un rang social ;
- n'est pas un investissement automatique ;
- ne promet pas de rendement individuel ;
- reste distincte du financement explicite d'un projet ou d'une opération d'investissement future.

## OVR-004 — Le comportement en retard n'est pas encore inventé

Les états `not_started`, `up_to_date`, `grace`, `late` existent déjà dans le domaine ZUMRA. Aucune règle nouvelle de suspension automatique de l'adhésion ne doit être codée sans décision métier explicite.

## OVR-005 — Fédération des satellites

CAP-CORE-022 est réellement implémentée dans GAMAD Core. DG Afrique est le portail utilisateur : il peut, sous session Core, déclencher l'ouverture d'un satellite. Le satellite vérifie le jeton avec ses propres identifiants de raccordement et crée/résout sa session locale. Le mot de passe GAMAD ne transite jamais par le satellite.

## OVR-006 — Stack canonique

Le produit canonique est le dépôt `gamadigit` / `dgafrique.com`. Les références du handoff Claude à Laravel, Inertia, Ziggy ou à l'absence d'un backend Next.js sont désormais obsolètes. Next.js Server Components / Route Handlers peuvent continuer à porter l'orchestration serveur de DG Afrique.

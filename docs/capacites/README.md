# Capabilities — contrats de développement DG Afrique

Le document `DG_Afrique_Referentiel_Final_84_Capacites_V0.1` reste la **constitution fonctionnelle** : il décrit ce que le système doit pouvoir faire. Ce dossier ajoute la couche nécessaire au développement direct.

## Règle

Une capacité n'est considérée « prête à coder » que lorsqu'une fiche d'implémentation précise au minimum :

- finalité et invariants ;
- propriétaire métier et propriétaire d'exécution (`DG`, `CORE`, `SATELLITE`, `HYBRID`) ;
- objets et données ;
- états et transitions ;
- permissions / consentement ;
- API ou cas d'usage ;
- états UI ;
- événements et traçabilité ;
- critères d'acceptation testables ;
- dépendances et garde-fous.

## Hiérarchie des sources

1. comportement réel déjà implémenté et testé ;
2. contrat GAMAD Core applicable ;
3. addenda métier de ce dossier ;
4. référentiel des 84 capacités V0.1 ;
5. design Claude comme représentation UX, jamais comme source de règle métier.

En cas de contradiction, on documente la décision ; on ne réinvente pas silencieusement la règle.

## Fichiers

- `CAPABILITY-INDEX.md` — registre des 84 capacités et domaine principal ;
- `OVERRIDES.md` — clarifications postérieures à V0.1 ;
- `TEMPLATE.md` — format d'une fiche prête à coder ;
- `specs/` — premières capacités critiques transformées en contrats de développement.

## Priorité actuelle

1. identité / compte / profil ;
2. Programme ZUMRA et contribution mensuelle ;
3. projets et capacité financière communautaire ;
4. satellites et ouverture fédérée ;
5. home personnalisée, découverte et graphe de capacités ;
6. social utile, apprentissage et opportunités.

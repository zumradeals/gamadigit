# Gate production obligatoire des capacités

## Règle absolue

DG Afrique avance **un CAP à la fois, dans l'ordre CAP-001 → CAP-084**.

Aucun CAP `N+1` ne peut être ouvert tant que le CAP `N` n'est pas marqué **VALIDÉ PROD** dans `CAP-MASTER-TRACKER.md`.

Le fait qu'un code, un écran, une API ou une base existe déjà pour un CAP futur ne vaut **jamais** validation. Ce code est considéré comme **préexistant / à auditer** jusqu'au tour officiel du CAP.

## Statuts autorisés

1. `BLOQUÉ` — le CAP précédent n'est pas VALIDÉ PROD.
2. `EN SPEC` — contrat fonctionnel et critères d'acceptation en cours.
3. `EN DEV` — implémentation autorisée sur branche de travail.
4. `EN PREVIEW` — build et parcours de préproduction à vérifier.
5. `EN PROD À VALIDER` — déployé en production mais preuves incomplètes.
6. `VALIDÉ PROD` — toutes les preuves sont réunies ; le CAP suivant peut être ouvert.

Aucun autre libellé ne doit être utilisé dans le registre maître.

## Conditions obligatoires pour passer à VALIDÉ PROD

Un CAP ne peut être marqué `VALIDÉ PROD` que si toutes les cases suivantes sont satisfaites :

- [ ] La fiche `docs/capacites/specs/CAP-XXX-*.md` décrit finalité, invariants, données, états, permissions, API/cas d'usage, UI, événements, dépendances et garde-fous.
- [ ] Les contradictions avec le comportement existant, le Core ou les overrides sont documentées et résolues explicitement.
- [ ] L'implémentation est isolée et relue par rapport à la fiche du CAP.
- [ ] Les tests automatisés pertinents passent.
- [ ] Le build/typecheck/lint applicable passe.
- [ ] Un preview ou environnement de vérification a été contrôlé quand le CAP touche l'interface ou un parcours utilisateur.
- [ ] Le déploiement production est `READY` / sain.
- [ ] Les critères d'acceptation du CAP sont vérifiés **en production** avec des preuves datées.
- [ ] Les erreurs, logs et données sensibles ont été contrôlés ; aucun secret ne doit être exposé.
- [ ] Le comportement de rollback ou de retour arrière est connu.
- [ ] `CAP-HISTORY.md` est mis à jour avec les décisions, commits, tests et preuves.
- [ ] `AI-HANDOFF.md` est mis à jour avec l'état de reprise exact.
- [ ] Pour un comportement visible ou métier, la validation utilisateur requise est obtenue et notée.

## Preuve minimale de production

Chaque validation doit consigner au minimum :

- date/heure UTC ;
- commit de production ;
- URL ou route testée, sans secret ;
- scénario exécuté ;
- résultat attendu ;
- résultat observé ;
- preuve technique disponible (statut HTTP, test, log non sensible, compteur, capture décrite) ;
- éventuelle validation métier utilisateur.

## Discipline de développement

- Une seule branche fonctionnelle de CAP active à la fois.
- Les travaux purement documentaires transverses sont permis s'ils n'implémentent pas un CAP futur.
- Aucun contournement du gate pour « gagner du temps ».
- Aucun CAP futur ne doit être déclaré terminé rétroactivement sans repasser ses critères de production.
- Les satellites peuvent évoluer dans leurs dépôts respectifs, mais leur intégration DG Afrique reste soumise au CAP DG concerné.

## Source de vérité

Le statut de progression officiel est **uniquement** `docs/capacites/CAP-MASTER-TRACKER.md`.

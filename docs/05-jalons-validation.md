# 05 — Jalons de refondation et gates de qualité

## V0 — Archivage + contrats (ce jalon)

- Snapshot historique complet référencé et récupérable.
- Racine active indépendante des modules historiques.
- Vision B et priorités locales documentées.
- Contrats commerciaux initialisés.
- Aucun déploiement automatique ni destruction de l'ancien système.

**Critère de validation :** retrouver l'intégralité des anciens fichiers dans l'archive, constater que `cursor` n'a pas bougé, et relire les décisions.

## V1 — Catalogue maîtrisé

- Catégories et offres publiables, fiches mobile, recherche et gestion de prix.
- Modèle administrable sans modifier le code pour chaque article.
- Contraintes de publication, variantes et confidentialité des coûts.
- URLs/SEO testés, prix FCFA représentés correctement.

**Gate :** navigation mobile, contrat catalogue, tests et absence de données internes en public.

## V2 — Commande transactionnelle

- Panier, achat invité, récapitulatif contractuel, création de commande et suivi.
- Gestion des paiements avec états explicites et confirmation côté serveur.
- Gestion des incidents et absence de doubles débits/livraisons.

**Gate :** tests d'idempotence, d'échec et de répétition, contrôle des habilitations.

## V3 — Livraison et services

- Remise numérique sécurisée et traçable.
- Assistance facultative et conditions distinctes.
- SAV, remboursements et journaux d'audit.

**Gate :** preuve de livraison et de traitement des incidents pour chaque commande.

## V4 — Croissance et optimisation

- Contenus SEO, indexation mesurée, acquisition sociale, conversion et reporting.
- Tests d'usage sur téléphones courants et budgets de performance.
- Analyse des marges nettes par référence/canal.

**Gate :** indicateurs vérifiables, aucun chiffre commercial inventé.

## Décisions ouvertes (ne pas présumer)

Nom et domaine, identité graphique, premier catalogue concret, règles tarifaires, modes de règlement, procédures de livraison, obligations légales, prestataires, structure des rôles détaillée et choix techniques définitifs.

Un gate terminé ne signifie pas qu'une maquette est un système. Les interfaces, règles métier, preuves de test et conditions d'exploitation sont vérifiées séparément.

# Boutique numérique autonome — refondation 2026

**Statut : conception contractuelle, pas encore application livrable.**

Ce dépôt devient le socle d'une **nouvelle marque indépendante** consacrée à la vente de logiciels, abonnements et prestations d'accompagnement facultatives.

- Positionnement validé : **prix accessibles + accompagnement facultatif**.
- Marché initial : **Côte d'Ivoire** ; extension francophone envisagée ultérieurement.
- Priorité : **Mobile First** ; achat fluide sans création obligatoire de compte.
- Nom commercial : **non validé**. Aucun nom provisoire ne doit être publié comme marque définitive.
- Ancien projet : conservé intégralement dans `archives/legacy-2026-11-11/` et sur la branche `archive/avant-boutique-autonome-2026-11-11`.
- Ancienne branche de production `cursor` : **non modifiée**.

## Contrats de référence

1. [Vision et positionnement](docs/01-vision-et-positionnement.md)
2. [Contrats métier](docs/02-contrats-metier.md)
3. [Mobile First et acquisition organique](docs/03-parcours-mobile-seo.md)
4. [Stratégie de reprise et archivage](docs/04-reprise-et-archivage.md)
5. [Jalons et critères de validation](docs/05-jalons-validation.md)
6. [Architecture PHP + MySQL + cPanel](docs/06-architecture-php-mysql-cpanel.md)
7. [Contrat de déploiement cPanel](docs/07-deploiement-cpanel.md)
8. [Registre des décisions](docs/DECISIONS.md)

## Règles de cohérence

- Le projet actif n'est **ni un portail ni un module** de l'ancien écosystème.
- Aucune identité, connexion, donnée, marque ou dépendance métier ne doit être réutilisée implicitement.
- Les fichiers d'archives sont **en lecture historique uniquement** : ne pas les importer dans l'application active ni les compiler.
- Seuls les éléments explicitement qualifiés et reconstruits peuvent intégrer le nouveau produit.
- Git et ces contrats documentés font foi ; toute évolution doit être consignée par commit.
- Ne pas confondre **vision**, **conception** et **implémentation**.
- Ne pas présenter le dépôt comme un système de commerce opérationnel tant que les critères de recette ne sont pas satisfaits.

## État de la refondation

La racine active a été volontairement nettoyée. **Stack technique validée : PHP + MySQL, hébergement cPanel.** Aucune commande, paiement ou livraison n'est encore implémenté(e). Le premier livrable est une base contractuelle auditable. L'application sera reconstruite par lots validés, sans mettre en risque le site historique.

## Architecture retenue

Application PHP modulaire **rendue côté serveur**, MySQL transactionnel et interface HTML/CSS avec JavaScript léger. **PHP 8.4 privilégié ; PHP 8.3 patché comme minimum.** PDO, configuration privée, authentification propre, sans serveur applicatif séparé ni processus permanent. Aucun framework PHP, moteur JavaScript ou service externe n'est décidé comme dépendance obligatoire.

La cible est un **hébergement cPanel standard**. Le projet ne doit pas exiger Docker, VPS, Node.js en production ni orchestration de services. L'ensemble des archives, du code métier, des secrets et des journaux devra rester **hors du répertoire web public**. Consulter les deux contrats techniques associés pour les modalités de déploiement.

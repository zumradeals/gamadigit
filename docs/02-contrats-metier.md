# 02 — Contrats métier de la boutique (V1)

## Principes invariants

- Les prix et totaux sont calculés et validés par le serveur ; jamais à partir d'un montant envoyé par le navigateur.
- Les montants FCFA sont stockés en **entiers**, jamais en flottants. Une éventuelle conversion fournisseur est historisée au moment du calcul.
- Chaque commande conserve un **instantané immuable** des offres, quantités, prix, services et conditions acceptés.
- Le coût fournisseur, la marge et les secrets de délivrance ne sont **jamais publics**.
- Aucun produit n'est livré sur la seule foi d'une déclaration de paiement côté client.
- Les opérations financières et de livraison sont **idempotentes**, journalisées et réconciliables.
- L'achat invité doit être possible sans compte client obligatoire.
- Une assistance payante exige un consentement explicite et un prix présenté avant validation.

## Objet : Produit

Identifiant interne, code de référence, éditeur, nom, catégorie, description, médias, compatibilité, conditions d'utilisation, statut publication (`draft`, `published`, `archived`), slug pérenne, données SEO.

**Invariant :** un produit n'est pas nécessairement une offre achetable ; il regroupe des variantes.

## Objet : Offre

Identifiant, produit de référence, édition/version, durée, quantité d'utilisateurs ou d'appareils, type de fourniture, prix TTC/HT selon régime réellement applicable (non présumé), devise, disponibilité, mode/délai de livraison, conditions, validité du tarif, statut.

**Invariant :** deux offres différant par leur durée, portée ou nature doivent rester identifiables comme deux variantes distinctes.

## Objet : Prix et coût interne

Prix public, coût d'approvisionnement, frais variables estimés, période d'effet, historique des modifications, auteur/justification. Les marges sont calculées au niveau de l'offre **et** vérifiées à la commande avec les coûts effectifs.

**Invariant :** aucune majoration forfaitaire ne vaut preuve de rentabilité.

## Objet : Panier / devis transactionnel

Lignes d'offres, quantités, options choisies, prix calculés, expiration éventuelle du devis. Le panier n'est pas une commande définitive ni une preuve d'achat.

## Objet : Commande

Identifiant unique, coordonnées nécessaires à la livraison, lignes et conditions figées, totaux, référence de paiement, statut commercial, historique des transitions, horodatages.

Cycle cible indicatif : `created` → `awaiting_payment` → `paid` → `fulfilling` → `delivered` → `completed`.
Branches exceptionnelles : `cancelled`, `disputed`, `refunded` selon règles explicites. Les statuts de paiement, de commande et de délivrance sont **séparés** afin d'éviter les contradictions.

## Objet : Paiement

Référence commande, prestataire/moyen, montant et devise attendus, références externes, statut propre (`pending`, `confirmed`, `failed`, `reversed`), preuve de confirmation serveur, rapprochement et historique d'événements.

**Invariant :** un même événement reçu deux fois ne double ni encaissement ni délivrance.

## Objet : Délivrance numérique

Lien à la commande et à son offre, type de livrable, canal de remise, moment, preuve de délivrance, statut et résolution d'incidents. Ne jamais exposer de clés ou d'identifiants confidentiels en URL publique, en journaux non protégés ou dans le dépôt.

## Objet : Accompagnement

Service distinct, prix et périmètre, créneau éventuel, consentement, livraison/preuve d'exécution, possibilité de réclamation. L'acheteur peut refuser sans perdre le droit de commander le produit de base.

## Objet : Incident, remboursement et journal

Demande client, qualification, responsable habilité, issue, montants remboursés, références de remboursement et audit sans effacement silencieux. Conservation et minimisation des données selon obligations applicables.

## Autorisations minimales

- Visiteur : consulter les offres publiées et acheter en invité.
- Client identifié (optionnel) : consulter **ses seules** commandes.
- Opérateur : traiter les commandes qui lui sont autorisées, sans exposer les marges hors habilitation.
- Administrateur commercial : gérer produits, offres, commandes et support selon droits.
- Administrateur financier : accès limité aux coûts/marges, remboursements et rapprochement.

**À décider avant implémentation :** modalités de paiement réelles, workflow de délivrance, nature des identifiants clients, politique fiscale, niveaux d'accès exacts et SLA.

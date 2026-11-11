# 03 — Parcours Mobile First et référencement organique

## Mobile First : conception abstraite

Le téléphone est l'écran principal de conception. Le bureau est une adaptation enrichie, pas la source du parcours.

### Navigation publique cible

- Accueil orienté produit et recherche.
- Catégories de logiciels.
- Résultats de recherche filtrables.
- Fiche produit puis choix d'offre précise.
- Panier / commande invité.
- Paiement puis suivi de livraison.
- Aide, conditions commerciales, confidentialité et contact.

Aucune partie du parcours d'achat n'exige de visiter un espace portail ou d'adhérer à un réseau tiers.

### Parcours d'achat canonique

1. Trouver un produit par recherche ou catégorie.
2. Lire son édition, sa durée, les appareils couverts, son prix et ses conditions.
3. Sélectionner une offre (avec service additionnel **désactivé par défaut**).
4. Vérifier le récapitulatif et les coordonnées de livraison.
5. Choisir un moyen de paiement disponible, comprendre son statut.
6. Recevoir la confirmation et suivre la délivrance.

Échecs prévus : indisponibilité, paiement interrompu, paiement tardif, doublon de notification, contestation, livraison impossible, assistance ou remboursement.

### Exigences d'expérience

- Navigation et lecture sans zoom sur téléphone courant.
- Recherche disponible dès l'accueil ; catégories explicites.
- Prix et action principale identifiables sans ambiguïté.
- Formulaires courts, erreurs précises, états de chargement et reprises.
- Accessibilité clavier/lecteur d'écran et contraste lisible.
- Interfaces légères ; images optimisées ; pas de scripts marketing qui bloquent l'achat.
- Suivi mesurable et respectueux des données personnelles.

## Référencement et acquisition — Côte d'Ivoire d'abord

- Une URL stable, descriptive et indexable par produit et catégorie réellement publiés.
- Contenu original : usages, compatibilité, variantes, prix, modalités, questions fréquentes.
- Titres, métadonnées, canoniques, sitemap, données structurées adaptées **aux informations réelles**.
- Pages publiques rendues lisibles par les robots, sans dépendre d'une connexion.
- Articles utiles ciblant les recherches locales à intention d'achat, sans duplication artificielle.
- Maîtrise des redirections, produits retirés, erreurs 404/410 et disponibilité.
- Pages légales, contact réel, délais d'exécution et service client lisibles.

Objectif : gagner une notoriété organique mesurable. **Aucune promesse de première position Google.**

## Mesure du tunnel

Événements logiques (sans imposer d'outil) : `product_view`, `offer_select`, `checkout_started`, `payment_confirmed`, `fulfilled`, `refunded`. Distinguer visiteurs, commandes, paiements et ventes effectivement finalisées. Éviter de remonter des secrets ou données sensibles dans l'analytique.

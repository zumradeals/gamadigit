# 06 — Contrat d'architecture PHP / MySQL / cPanel

**Statut : conception technique initiale.** Décision de stack validée le 11 novembre 2026. Ce contrat guide l'implémentation ; il ne prouve pas qu'un site ou une base de données existe déjà.

## 1. Objectif technique et limites

Construire une **boutique autonome**, Mobile First, rapide à comprendre et à héberger sur un cPanel mutualisé standard, sans dépendance aux services/identités/applications d'un autre projet.

### Choix fermes

- **PHP natif**, application modulaire monolithique, pages HTML rendues par le serveur.
- **MySQL**, moteur transactionnel InnoDB, encodage UTF-8 (`utf8mb4`), PDO et requêtes préparées.
- **HTML + CSS + JavaScript progressif minimal** ; le visiteur doit lire les pages produits même si les scripts optionnels ne s'exécutent pas.
- **cPanel mutualisé** comme cible d'installation. Aucun service Node.js permanent, VPS, Docker, conteneur, moteur de files ou serveur distinct imposé.
- **PHP 8.4 préféré / 8.3 minimum maintenu avec correctifs**, sous réserve de la version réellement disponible sur l'hébergeur ; ne jamais fonctionner avec une version arrivée en fin de support de sécurité.
- Aucun framework supplémentaire n'est autorisé ou requis à ce stade. Toute bibliothèque externe doit être justifiée et réversible.

### Séparation non négociable

- **Vision** : enseigne ivoirienne indépendante, prix accessibles, accompagnement facultatif.
- **Métier** : règles de catalogue, prix, commande, paiement, livraison, remboursements.
- **Application** : cas d'usage, autorisations, validation, transactions et transitions d'états.
- **Infrastructure** : PDO/MySQL, courriels, stockage, prestataires de paiement et adaptateurs.
- **Présentation** : routes, contrôleurs HTTP, modèles de pages HTML, CSS et actions progressives.

Aucune page HTML ne calcule les marges, ne valide seule les paiements ou ne décide de délivrer un produit.

## 2. Structure cible du code actif (à créer progressivement)

```text
app/
  bootstrap.php           # initialisation contrôlée, configuration, erreurs
  Http/                   # routage, contrôleurs, validation requêtes
  Domain/
    Catalog/              # produits, variantes, publication, recherche
    Pricing/              # prix publics, coûts et règles de calcul
    Orders/               # panier, instantanés, transitions de commande
    Payments/             # paiement, confirmation, idempotence
    Delivery/             # délivrance et preuves
    Support/              # incidents et assistance optionnelle
  Infrastructure/         # PDO, stockage, notifications, adaptateurs
  Views/                  # gabarits HTML du site et du back-office
config/
  example.php             # exemple sans secret, versionné
database/
  migrations/             # migrations SQL numérotées et réversibles si possible
public/
  index.php               # seul point d'entrée web dynamique
  .htaccess               # routage et protections compatibles hébergement
  assets/                 # CSS, JS léger, images publiques optimisées
storage/                  # journaux et fichiers PRIVÉS, hors document root
tests/                    # validation métier, sécurité et intégration
docs/                     # contrats et procédures
archives/                 # héritage Git, jamais publié sur Internet
```

Structure **cible**, pas inventaire de fichiers existants. On ne crée un module que lorsqu'il a un cas d'usage et un contrat testable.

## 3. Modèle de stockage MySQL

- Identifiants internes stables, contraintes de clés et d'unicité ; relations explicites.
- Prix FCFA stockés en **entiers** ; jamais en flottants.
- Produits séparés des offres commercialisables (édition, durée, portée, conditions).
- Commandes et lignes avec **snapshot commercial immuable** à validation.
- Paiements, remboursements et livraisons dans des registres distincts ; références externes uniques.
- Historique des changements de prix/coûts, opérations administrateur et transitions sensibles.
- Transactions InnoDB sur allocation de livrable, confirmation de paiement, émission de remboursement et commandes critiques.
- Migrations SQL versionnées dans Git, puis appliquées à la recette et à la production de manière contrôlée ; import initial via les outils cPanel autorisés.

Aucune clé d'activation n'est exposée en clair dans le catalogue, dans des URL publiques, dans les messages de diagnostic ou dans les dépôts.

## 4. Règles HTTP, identité, paiements

- Router PHP central : routes publiques pour le catalogue, routes protégées pour administration et suivi privé.
- Entrées validées côté serveur ; échappement HTML à l'affichage ; protection CSRF sur les actions à session.
- Sessions en cookies `HttpOnly`, `Secure` sous HTTPS, `SameSite` approprié ; rotation d'identifiant à la connexion.
- Mots de passe hachés par une fonction PHP dédiée et actuelle ; jamais stockage réversible.
- Contrôle d'accès serveur à chaque opération, pas seulement masquage de boutons.
- Paiement accepté uniquement après **preuve vérifiée côté serveur** provenant du prestataire choisi (ou validation administrative traçable si mode manuel contractuellement autorisé).
- Notification de paiement potentiellement répétée : clé d'idempotence et transition transactionnelle atomique.
- Délivrance sécurisée après paiement confirmé ; le traitement asynchrone éventuel doit rester compatible cPanel (tâches planifiées cPanel si nécessaire, pas de daemon obligatoire).

Les prestataires et méthodes de paiement ne sont pas encore choisis.

## 5. Performance et SEO Mobile First

- HTML utile dès la réponse serveur, page produit accessible sans script lourd.
- URLs lisibles, une canonique par produit, fil d'Ariane, métadonnées et sitemap issus des offres publiées.
- Requêtes indexées, pagination catalogue, pas de requêtes multiples inutiles.
- Images responsives optimisées, CSS léger, JavaScript non bloquant.
- Pas d'indexation des écrans d'administration, de suivi client ou des pages privées.
- Prix et disponibilité affichés en cohérence avec les données transactionnelles.

## 6. Testabilité et durabilité

- Règles métier isolées de PHP/HTML et de PDO autant que possible pour tests sans interface graphique.
- Tests des transitions de commande, calculs de prix, double notification et autorisations.
- Validation manuelle des parcours mobiles et de paiement sur un environnement de recette.
- Procédure d'installation et de restauration versionnée.
- Aucune activation sur le domaine public avant tests de sécurité, référencement, sauvegarde et retour arrière.

## 7. Hors périmètre V1

Multi-tenant, microservices, applications mobiles natives, intégration de l'identité ancienne, moteurs de recommandation complexes, abonnements internes multi-entreprises ou intégrations imposées d'avance. Toute extension future doit passer par une décision contractuelle distincte.

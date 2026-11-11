# 07 — Contrat de déploiement cPanel

**Cible : hébergement mutualisé cPanel avec PHP et MySQL.** Cette page décrit la procédure attendue, pas une installation déjà effectuée.

## Précontrôles indispensables

1. Compte cPanel et nom de domaine disponibles.
2. Version PHP compatible et **corrigée** (8.4 souhaitée, 8.3 minimum), extensions utiles : `pdo_mysql`, `mbstring`, `openssl`, `fileinfo` selon fonctionnalités retenues.
3. MySQL disponible avec transactions InnoDB ; utilisateur de base de données à droits minimaux.
4. HTTPS opérationnel et redirection depuis HTTP.
5. Possibilité de conserver des répertoires **hors de la racine web** et de configurer le document root du domaine ou un point d'entrée public.
6. Sauvegarde/restauration de fichiers et base testables ; emplacement de logs privé.
7. Pour des paiements automatiques : réception d'HTTPS callbacks/notifications et, si nécessaire, accès aux tâches planifiées cPanel.

Ne pas présumer des versions disponibles sur un hébergement non audité.

## Mise en place : variante recommandée

Si le domaine permet un document root configurable :
- Projet déployé dans un dossier privé du compte (par exemple `~/boutique-app/`).
- Document root du domaine pointant sur **`~/boutique-app/public/`**.
- `app/`, `config/`, `database/`, `storage/`, `docs/` et `archives/` hors de l'espace HTTP.
- Seuls `public/index.php`, `public/.htaccess` et `public/assets/` sont accessibles au navigateur.

### Variante pour domaine principal à `public_html` fixe

- Conserver le code métier, la configuration et les données privées dans un dossier **frère** de `public_html` (par ex. `~/boutique-private/`).
- Déployer **seulement** le contenu compilé/copied de `public/` vers `public_html/`.
- Configurer le point d'entrée public pour charger le bootstrap privé via un chemin explicite et documenté, sans exposer le code.
- **Jamais** transférer le dépôt complet ni `archives/` dans `public_html`.

Ces deux variantes seront testées sur l'hébergeur réel ; ne pas inventer de chemin absolu tant que son compte n'est pas connu.

## Séquence d'installation et de mise à jour

1. Sauvegarder les fichiers applicatifs et exporter la base concernée.
2. Sélectionner une version PHP maintenue avec **MultiPHP Manager** si cette fonctionnalité est disponible.
3. Créer la base et l'utilisateur via **MySQL Databases / Manage My Databases** dans cPanel ; accorder les droits strictement nécessaires.
4. Créer le fichier de configuration privé à partir de son exemple, sans envoyer de secrets dans Git ou un journal.
5. Appliquer les migrations SQL versionnées sur une base de recette, puis sur production après validation.
6. Déployer les fichiers du projet actif sans `archives/` ni `docs/` web-publics.
7. Vérifier l'URL publique, HTTPS, les sessions, les pages produit, la commande, la base et les journaux privés.
8. Tester à froid le retour arrière : restauration du code et de la base sous procédure définie.
9. Ouvrir la production uniquement quand les critères de V1/V2/V3 requis pour vendre sont verts.

**phpMyAdmin** sert à consulter/importer/modifier la base, mais la création des bases et utilisateurs se fait dans l'interface de gestion MySQL de cPanel, pour préserver l'intégration des permissions/sauvegardes cPanel.

## Exigences de maintenance

- Fichiers de configuration réels non versionnés et non téléchargeables.
- Logs sans mots de passe, secrets, numéros de paiement sensibles ni clés de licence.
- Restrictions d'accès au back-office, durcissement de la session et contrôle des tentatives répétées.
- Sauvegardes régulières et tests de restauration.
- Version PHP et correctifs de sécurité vérifiés lors de chaque maintenance.
- Aucune commande de déploiement qui écrase la base de données ou la branche historique.

## Interdits opérationnels

- Utiliser `public_html` comme copie brute du dépôt Git complet.
- Déployer une installation dont les secrets, migrations, archives ou logs sont lisibles via HTTP.
- Déclencher une livraison sur un retour client de type « paiement réussi » non vérifié côté serveur.
- Activer les anciens services ou domaines historiques par commodité.
- Confondre un site PHP qui affiche des fiches avec une boutique dont paiements et livraisons sont sûrs.

# GamaDigit

GamaDigit rassemble les solutions numériques destinées aux particuliers, professionnels, entreprises et organisations.

> **Le numérique qui fait avancer vos projets.**

GamaDigit est un satellite de l’écosystème GAMAD.

## Familles d’offres

1. Création web et applications
2. Design et communication
3. Hébergement et infrastructure
4. Logiciels et abonnements
5. Formation et accompagnement
6. Solutions numériques pour entreprises

## Stack

- Next.js avec App Router
- React et TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL et RLS
- Lucide pour les icônes

## Fonctionnalités déjà posées

- accueil responsive ;
- navigation desktop et mobile ;
- pages des six familles ;
- premières offres minimales ;
- blog et articles ;
- contact, WhatsApp et formulaire de devis ;
- sitemap et robots ;
- logo vectoriel, favicon et charte V1 ;
- schéma Supabase avec politiques de sécurité ;
- authentification du back-office ;
- tableau de bord et écrans de lecture pour services, articles, prospects et paramètres.

## Installation locale

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ouvrir ensuite `http://localhost:3000`.

## Supabase

Consulter [`docs/04-installation-supabase.md`](docs/04-installation-supabase.md) pour :

- appliquer les migrations ;
- charger les données initiales ;
- créer le premier administrateur ;
- configurer les variables d’environnement.

## Commandes qualité

```bash
npm run typecheck
npm run build
```

## Documentation

- [`docs/01-vision-produit.md`](docs/01-vision-produit.md)
- [`docs/02-architecture-information.md`](docs/02-architecture-information.md)
- [`docs/03-charte-graphique.md`](docs/03-charte-graphique.md)
- [`docs/04-installation-supabase.md`](docs/04-installation-supabase.md)

## État actuel

Le socle public et la fondation du back-office sont en place. Le prochain lot concerne les formulaires CRUD sécurisés et la connexion des contenus publics à Supabase.

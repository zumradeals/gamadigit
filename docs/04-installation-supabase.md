# Installation Supabase — GamaDigit

## 1. Créer le projet

Créer un projet Supabase dédié à GamaDigit. Ne pas réutiliser la base de l’ancien site Autodesk-CI.

## 2. Appliquer le schéma

Exécuter dans l’éditeur SQL, dans cet ordre :

1. `supabase/migrations/20260806214500_initial_schema.sql`
2. `supabase/seed.sql`

Le premier fichier crée les tables, fonctions, déclencheurs et politiques RLS. Le second ajoute les six familles initiales et les catégories du blog.

## 3. Configurer l’application

Copier `.env.example` vers `.env.local` et renseigner :

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE-PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=VOTRE_CLE_PUBLIQUE
NEXT_PUBLIC_WHATSAPP_NUMBER=2250718713781
```

La clé `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais être exposée au navigateur. Elle sera ajoutée uniquement si une opération serveur en a réellement besoin.

## 4. Créer le premier administrateur

Dans Supabase Auth, créer un utilisateur avec une adresse e-mail et un mot de passe fort. Récupérer ensuite son UUID puis exécuter :

```sql
insert into public.profiles (user_id, display_name, role)
values ('UUID_UTILISATEUR', 'Administrateur GamaDigit', 'admin');
```

## 5. Vérifications

- `/admin/connexion` affiche le formulaire de connexion ;
- le compte sans profil est refusé ;
- le compte avec rôle `admin` accède au tableau de bord ;
- le formulaire public enregistre une ligne dans `public.leads` ;
- un visiteur non authentifié ne peut ni lire les prospects, ni modifier les contenus.

## 6. Sécurité

- activer la double authentification pour les comptes administrateurs quand elle sera configurée ;
- ne jamais committer `.env.local` ;
- vérifier les politiques RLS après chaque nouvelle table ;
- limiter le nombre de comptes administrateurs ;
- le rôle `editor` est réservé à un lot ultérieur avec des politiques RLS spécifiques.

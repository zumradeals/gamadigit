# CAP-004 — COMPÉTENCES

- **Famille :** Fondations humaines et ZUMRA
- **Domaine :** Compétences personnelles
- **Propriétaire d'exécution :** DG Afrique
- **Statut gate :** **EN SPEC**
- **CAP précédent :** CAP-003 — **VALIDÉ PROD**
- **CAP suivant :** CAP-005 — BLOQUÉ
- **Branche :** `cap/004-competences`

## Source fonctionnelle V0.1

### Finalité

Permettre à une personne de déclarer et d'enrichir ce qu'elle sait faire.

### Capacité

DG Afrique peut enregistrer des compétences issues de l'expérience, de la pratique, d'une formation ou d'autres formes de preuve.

### Points clés

- une compétence n'exige pas automatiquement un diplôme ;
- exemples du référentiel : développement web, agriculture, commerce, soudure, comptabilité, design, mécanique, gestion de projet.

### Garde-fou / résultat

Le système reconnaît plusieurs chemins d'acquisition d'une compétence.

## Situation héritée de CAP-003

CAP-003 a introduit le profil DG canonique `public.dg_person_profiles`.

Les compétences y sont actuellement représentées par :

- colonne `skills text[]` ;
- contrat TypeScript `skills: string[]` ;
- maximum 20 valeurs ;
- saisie libre par virgules / retours ligne ;
- affichage sous forme de libellés ;
- option `no_skills_yet` pour une personne qui commence sans compétence déclarée.

Ce modèle simple était volontairement suffisant pour CAP-003 mais ne porte aucune structure propre à une compétence.

## GAP CAP-004

### GAP-004-A — compétence = simple chaîne

Une valeur comme `développement web` n'a aujourd'hui :

- aucun identifiant stable ;
- aucun libellé normalisé distinct du texte saisi ;
- aucune origine d'acquisition ;
- aucune description ou contexte ;
- aucune distinction entre déclaration personnelle et preuve éventuelle.

### GAP-004-B — enrichissement impossible

Le référentiel demande de pouvoir **déclarer et enrichir** une compétence. Le tableau `skills text[]` ne permet pas d'enrichir individuellement une compétence sans modifier le modèle entier du profil.

## Interprétation produit retenue

CAP-004 doit transformer la compétence en **objet métier individuel minimal**, tout en restant simple pour l'utilisateur.

Une compétence CAP-004 doit au minimum pouvoir porter :

- un identifiant technique stable ;
- un libellé déclaré ;
- une origine d'acquisition facultative ;
- un contexte/description facultatif ;
- une date de création et une date de modification ;
- le rattachement à `core_identity_reference`.

La personne doit pouvoir ajouter, modifier et retirer ses propres compétences sans toucher aux autres dimensions de son profil.

## Origines d'acquisition minimales

CAP-004 doit reconnaître plusieurs chemins sans hiérarchie de valeur :

- `experience` — expérience professionnelle ou personnelle ;
- `practice` — pratique / apprentissage par la pratique ;
- `training` — formation ;
- `education` — cursus / diplôme ;
- `self_taught` — autodidacte ;
- `other` — autre chemin.

L'origine est facultative. Une compétence ne devient jamais invalide parce qu'aucun diplôme ou justificatif n'est fourni.

## Frontières explicites

CAP-004 ne doit pas absorber :

- **CAP-005 APPRENTISSAGE** — ce que la personne veut apprendre ;
- **CAP-006 TRANSMISSION** — ce qu'elle est prête à enseigner/transmettre ;
- **CAP-023/024** — graphe complet et profil comme source généralisée ;
- **CAP-035 MÉMOIRE D'EXPÉRIENCE** — historique riche d'expériences ;
- **CAP-036 PREUVE DE CAPACITÉ** — justificatifs / preuves ;
- **CAP-060 RÉPUTATION** — notation ou réputation.

En particulier, CAP-004 **ne crée aucun score de niveau**, aucune note de compétence et aucune validation sociale.

## Compatibilité CAP-003 / ZUMRA

- `dg_person_profiles.skills` reste temporairement disponible pendant la migration ;
- les compétences structurées deviennent la source canonique CAP-004 ;
- une projection simple de leurs libellés peut alimenter les écrans hérités qui attendent `string[]` ;
- ZUMRA peut consommer ces libellés sans posséder le modèle de compétences ;
- aucune adhésion ZUMRA n'est requise pour posséder des compétences.

## Parcours principal cible

1. utilisateur connecté → Mon profil ;
2. section **Mes compétences** ;
3. voit ses compétences existantes ;
4. ajoute une compétence avec un libellé ;
5. peut indiquer facultativement comment il l'a acquise et un court contexte ;
6. enregistre ;
7. revient plus tard et retrouve la compétence ;
8. peut la modifier ou la supprimer ;
9. Mon espace continue d'afficher les compétences simplement.

## Critères d'acceptation minimum

- **AC-004-01** une compétence est un objet métier distinct et stable.
- **AC-004-02** elle appartient à une identité Core via `core_identity_reference`.
- **AC-004-03** ajout, lecture, modification et suppression sont possibles pour la personne authentifiée.
- **AC-004-04** l'origine d'acquisition est facultative et accepte plusieurs chemins.
- **AC-004-05** aucun diplôme n'est obligatoire.
- **AC-004-06** aucun score, niveau forcé ou réputation n'est créé.
- **AC-004-07** les anciennes valeurs `skills text[]` sont reprises sans perte.
- **AC-004-08** Mon espace et les consommateurs existants continuent de recevoir une projection simple des libellés.
- **AC-004-09** une compétence n'entraîne aucune adhésion ZUMRA.
- **AC-004-10** parcours principal validé en production.

## Audit technique initial

Constaté au démarrage CAP-004 :

- `src/lib/profile/capability-profile.ts` expose encore `skills: string[]` ;
- `src/components/profile/capability-profile-form.tsx` saisit les compétences dans une zone texte puis découpe par virgules/retours ligne ;
- `public.dg_person_profiles.skills` est un tableau texte issu de CAP-003 ;
- Mon espace et ZUMRA consomment actuellement des libellés simples.

## Prochain geste

Auditer tous les consommateurs de `skills`, puis proposer une migration additive vers une table `dg_person_skills` sans supprimer immédiatement `dg_person_profiles.skills`. La migration doit être réversible, préserver les données existantes et fournir une projection simple aux écrans hérités.

## Gate

**CAP-004 reste EN SPEC. CAP-005 reste BLOQUÉ.**

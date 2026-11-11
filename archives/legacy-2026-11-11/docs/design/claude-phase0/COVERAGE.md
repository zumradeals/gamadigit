# Audit du handoff Claude — couverture fonctionnelle

Le handoff Phase 0 est conservé comme source de design. Il a été conçu avant la décision de garder Next.js et avant plusieurs clarifications métier récentes.

## Très bien couvert visuellement

- App Shell unifié visiteur / connecté ;
- home personnalisée / prochaine action ;
- profil de capacités ;
- graphe et équilibre disponible / recherché ;
- Explorer / pôles ;
- projets et maturité ;
- ZUMRA réseau / espace de groupe ;
- Carte ZUMRA en lecture ;
- progressive disclosure, états vides et recommandations expliquées.

## Couverture partielle ou absente à compléter

1. **Adhésion ZUMRA réelle** — le kit prévoyait `pending_payment` sans écran de paiement ; DG Afrique possède déjà le vrai flux GeniusPay.
2. **Contribution mensuelle / fonds communautaire / transparence** — non conçu dans le kit ; devient une priorité produit.
3. **Satellites / GamaDrive / ouverture fédérée** — prévu en placeholder ; le Core possède maintenant un contrat réel CAP-CORE-022 à refléter dans l'UX.
4. **Social ZUMRA** — fil, commentaires, partage et messagerie doivent être conçus comme réseau social d'action, pas seulement comme placeholders.
5. **Apprendre, Opportunités, Notifications, Moi** — à relier aux fonctions existantes ou à construire progressivement.

## Règle d'intégration

On ne remplace jamais une fonction réelle par un mock Claude. On transpose le composant visuel autour du contrat et des données existantes.

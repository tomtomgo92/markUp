# MarkUp

Calculateur de TJM et de rentabilité de projets. Construisez un ou plusieurs scénarios de
pricing, comparez-les côte à côte, et visualisez l'impact des marges sur le coût et le prix de
vente en temps réel.

Disponible sur [markup.thatmuch.fr](https://markup.thatmuch.fr).

## Stack

- React 18 (JSX) + Vite 5
- [`@thatmuch/designsystem`](https://www.npmjs.com/package/@thatmuch/designsystem) pour les
  composants UI, `lucide-react` / `react-icons` pour les icônes
- Vitest pour les tests unitaires (`src/utils/finance.js`)
- Aucun store global : l'état vit dans `App.jsx` et est persisté dans `localStorage` /
  encodé dans l'URL pour le partage

## Démarrer

```bash
npm install
npm run dev      # serveur de dev Vite
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build de production
npm test         # tests unitaires (vitest)
```

## Structure

```
public/                 # CNAME, .nojekyll
src/
  assets/fonts/          # polices NeueMachina
  components/
    <Name>.jsx           # un composant par fichier
    <Name>.css           # feuille de style associée
    ui/                  # primitives partagées (ConfirmButton, ResultCard)
  utils/
    finance.js           # calculs de marge/coût + formatters
    finance.test.js
  App.jsx                # état des scénarios, persistance localStorage + URL
  main.jsx               # point d'entrée
```

Voir [CLAUDE.md](./CLAUDE.md) pour les conventions de code détaillées.

## Déploiement

Tout push sur `main` déclenche `.github/workflows/deploy.yml`, qui build le projet et déploie
`dist/` sur GitHub Pages (domaine personnalisé via `public/CNAME`).

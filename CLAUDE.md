# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # start the Vite dev server
npm run build    # vite build (no type-check — this is plain JS, not TypeScript)
npm run preview  # preview the production build
npm test         # vitest — runs *.test.js files (e.g. src/utils/finance.test.js)
```

There is no lint script configured. `npm run build` (bundle) and `npm test` (unit tests) are the
correctness gates.

## Stack

SPA built with **React 18.2 (JSX, not TypeScript)** on **Vite 5**. No router — single page,
view-state toggled with local `useState`. No Zustand/Redux, no Tailwind/Shadcn, React Compiler
not enabled. UI is plain CSS-per-component plus the **`@thatmuch/designsystem`** npm package
(external dependency, not authored in this repo); icons from `lucide-react` and `react-icons`.

## Architecture

```
public/                 # CNAME, .nojekyll — served as-is by GitHub Pages
src/
  assets/fonts/          # NeueMachina font files
  components/
    <Name>.jsx           # one component per file, no per-component folder
    <Name>.css           # sibling stylesheet, imported directly in the .jsx
    ui/                  # smaller shared primitives (ConfirmButton, ResultCard)
  utils/
    finance.js           # pricing/margin math (pvFromCost, costFromPv) + formatters
    finance.test.js       # vitest unit tests for finance.js
  App.jsx                # root component: scenario state, localStorage + URL persistence
  App.css
  main.jsx               # entry point (ReactDOM.createRoot)
  index.css              # global styles
index.html               # Vite HTML entry, loads src/main.jsx
.github/workflows/deploy.yml  # build + deploy dist/ to GitHub Pages on push to main
```

There is no `index.ts`/`index.scss` barrel pattern, no `pages/` or `docs/` split, and no design
tokens authored locally — those live upstream in `@thatmuch/designsystem`. Each component imports
its own `.css` file directly (`import './Foo.css'`), and components are flat files in
`src/components`, not folders.

The app itself is a TJM/pricing calculator ("markUp"): the user builds one or more pricing
**scenarios** (`ScenarioCard` / `ScenarioTable` / `ScenarioItemRow`), can compare them
(`ComparisonView`), and see margin/cost math computed by `src/utils/finance.js`. State lives only
in `App.jsx` (`scenarios`, `showComparison`) and is persisted to `localStorage` and optionally
encoded into the URL (`?data=...`) for sharing.

## Component conventions

Reference implementations: `ScenarioCard`, `Header`, `Footer` in `src/components`. New components
follow the same shape:

```jsx
import './Foo.css';

const Foo = ({ variant = 'primary', className = '', children, ...rest }) => {
  const classes = ['tm-foo', `tm-foo--${variant}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

export default Foo;
```

- Plain JSX, no TypeScript — no prop-type interfaces, no `import type`.
- Class composition is always `[...].filter(Boolean).join(' ')`, never manual string
  concatenation.
- Each component default-exports a single component and imports its own sibling `.css` file
  directly — there is no barrel file (`index.ts`) and no SCSS token layer in this repo.
- Stable callbacks passed down to child components (e.g. `ScenarioCard`) use `useCallback` to
  avoid unnecessary re-renders — see `addScenario`/`updateScenario`/`removeScenario` in
  `App.jsx`.

## State & performance

- Local state only (`useState`/`useEffect`/`useRef`); no global store.
- React Compiler is not enabled — `useCallback`/`useMemo` are used deliberately in `App.jsx` to
  keep child components (`Header`, `ScenarioCard`) from re-rendering on unrelated state changes;
  follow that pattern rather than memoizing everything by default.

## Commit messages

Conventional Commits format (`type(scope): description`), plain text only — no markdown bold,
italics, or inline code in the commit message. Imperative mood, no trailing period, title ≤ 50
chars (hard limit 72). Body separated from title by a blank line, bullet points only (no prose
paragraphs), wrapped at 72 chars, focused on what changed and why without repeating the title.

## Versioning

Semantic Versioning (`MAJOR.MINOR.PATCH`), driven by the Conventional Commit types already used
in this repo:

- `feat` → bump `MINOR`
- `fix`, `refactor`, `docs`, `chore`, `style` → bump `PATCH` (or no release)
- A `BREAKING CHANGE` footer / `!` after the type → bump `MAJOR`

Release steps (manual, no automation tooling installed):

1. Bump `version` in `package.json` to match the new number.
2. Move the `[Unreleased]` section of `CHANGELOG.md` under a new `## [X.Y.Z] - YYYY-MM-DD`
   heading, leaving a fresh empty `[Unreleased]` section above it.
3. Commit (`chore(release): vX.Y.Z`), then tag: `git tag -a vX.Y.Z -m "vX.Y.Z"`.
4. Push the commit and tag: `git push && git push --tags`.

Before `v1.0.0`, breaking changes are tolerated within `0.x` minor bumps (no public API
stability guarantee yet).

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`: installs, runs `npm run build`, and
deploys `dist/` to GitHub Pages. The custom domain is pinned via `public/CNAME`
(`markup.thatmuch.fr`).

## 2026-03-05 - [React List Virtualization Pattern]
**Learning:** Extracting list items into memoized components (`React.memo`) and using `useRef` to maintain stable callback references in the parent component effectively prevents unnecessary re-renders of the entire list when a single item updates.
**Action:** When optimizing large lists or tables where rows have complex interactions, extract the row into a separate component and use `useRef` in the parent to access current state in callbacks without recreating them.

## 2025-01-28 - [React Lazy State Initialization]
**Learning:** When initializing React state with expensive operations (like URL parameter parsing, base64 decoding, or JSON parsing), calling the function directly inside `useState` (e.g., `useState(getInitialState())`) executes the expensive operation on *every single render* of the component, even though the result is only used on the first render.
**Action:** Always use React lazy initialization by passing a function reference to `useState` (e.g., `useState(getInitialState)`) when the initial state calculation is expensive, to prevent main thread blocking and unnecessary recalculations.

## 2025-03-09 - [Memoizing Derived Financial Data for UI State]
**Learning:** In complex components (like `ScenarioCard.jsx` and `ComparisonView.jsx`), derived financial recalculations (e.g., iterating through items and calculating taxes, margins) will unnecessarily re-run when UI-only state changes (like `activeCalculator` toggling or the global `isClientMode` view mode changing), leading to a cascading performance hit as the list of items grows.
**Action:** Always wrap heavy data mapping or calculation functions with `useMemo` (e.g., `useMemo(() => calculateResults(s), [s])`) so they only recalculate when their underlying data dependencies change, protecting them from unrelated UI-only state updates.

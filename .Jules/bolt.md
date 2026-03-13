## 2026-03-13 - [Memoize Derived Computations Mixed With UI State]
**Learning:** In complex components like `ScenarioCard` and `ComparisonView`, mixing expensive data prop calculations (`calculateResults(s)`) with local UI-only state (`activeCalculator`) or parent UI-only props (`isClientMode`) without memoization causes full O(n) recalculations whenever the user interacts with the UI (e.g., toggling a modal or switching client view mode).
**Action:** When a component receives data objects and UI toggles, always wrap the derived data calculations (like mapped arrays or financial computations) in `useMemo` so they only run when the underlying data (`s` or `scenarios`) changes, preventing cascading performance regressions from simple UI interactions.

## 2026-03-05 - [React List Virtualization Pattern]
**Learning:** Extracting list items into memoized components (`React.memo`) and using `useRef` to maintain stable callback references in the parent component effectively prevents unnecessary re-renders of the entire list when a single item updates.
**Action:** When optimizing large lists or tables where rows have complex interactions, extract the row into a separate component and use `useRef` in the parent to access current state in callbacks without recreating them.

## 2025-01-28 - [React Lazy State Initialization]
**Learning:** When initializing React state with expensive operations (like URL parameter parsing, base64 decoding, or JSON parsing), calling the function directly inside `useState` (e.g., `useState(getInitialState())`) executes the expensive operation on *every single render* of the component, even though the result is only used on the first render.
**Action:** Always use React lazy initialization by passing a function reference to `useState` (e.g., `useState(getInitialState)`) when the initial state calculation is expensive, to prevent main thread blocking and unnecessary recalculations.

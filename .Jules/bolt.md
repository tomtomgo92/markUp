## 2026-03-05 - [React List Virtualization Pattern]
**Learning:** Extracting list items into memoized components (`React.memo`) and using `useRef` to maintain stable callback references in the parent component effectively prevents unnecessary re-renders of the entire list when a single item updates.
**Action:** When optimizing large lists or tables where rows have complex interactions, extract the row into a separate component and use `useRef` in the parent to access current state in callbacks without recreating them.

## 2025-01-28 - [React Lazy State Initialization]
**Learning:** When initializing React state with expensive operations (like URL parameter parsing, base64 decoding, or JSON parsing), calling the function directly inside `useState` (e.g., `useState(getInitialState())`) executes the expensive operation on *every single render* of the component, even though the result is only used on the first render.
**Action:** Always use React lazy initialization by passing a function reference to `useState` (e.g., `useState(getInitialState)`) when the initial state calculation is expensive, to prevent main thread blocking and unnecessary recalculations.

## 2023-11-20 - [Memoizing Derived Data Recalculations]
**Learning:** Extracting list items into memoized components (`React.memo`) is only part of the solution. When a component computes derived data based on its props (like computing financial results from a list of items), and it also has UI-only state (like whether a modal is open or presentation mode is active), that computation will run on every UI-state change unless memoized. In our case, `ScenarioCard` recalculating items on every keystroke when opening a popover, or `ComparisonView` computing results on every render.
**Action:** Use `useMemo` for derived data recalculations based on props to prevent cascading performance regressions from UI-only state toggles.

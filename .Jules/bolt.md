## 2026-03-05 - [React List Virtualization Pattern]
**Learning:** Extracting list items into memoized components (`React.memo`) and using `useRef` to maintain stable callback references in the parent component effectively prevents unnecessary re-renders of the entire list when a single item updates.
**Action:** When optimizing large lists or tables where rows have complex interactions, extract the row into a separate component and use `useRef` in the parent to access current state in callbacks without recreating them.

## 2025-01-28 - [React Lazy State Initialization]
**Learning:** When initializing React state with expensive operations (like URL parameter parsing, base64 decoding, or JSON parsing), calling the function directly inside `useState` (e.g., `useState(getInitialState())`) executes the expensive operation on *every single render* of the component, even though the result is only used on the first render.
**Action:** Always use React lazy initialization by passing a function reference to `useState` (e.g., `useState(getInitialState)`) when the initial state calculation is expensive, to prevent main thread blocking and unnecessary recalculations.
## 2026-03-28 - [Memoize Derived Financial Data]
**Learning:** When complex components receive UI-only state toggles (like `isClientMode` or `activeCalculator`) that trigger a re-render, expensive derived computations (like parsing or reducing financial data structures) will be redundantly recalculated on every render if left unmemoized.
**Action:** Use `useMemo` to wrap derived recalculations (such as mapped loops over state arrays) so that they only run when their underlying data dependencies change, protecting performance against cascading UI-only renders.

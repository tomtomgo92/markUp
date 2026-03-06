## 2026-03-05 - [React List Virtualization Pattern]
**Learning:** Extracting list items into memoized components (`React.memo`) and using `useRef` to maintain stable callback references in the parent component effectively prevents unnecessary re-renders of the entire list when a single item updates.
**Action:** When optimizing large lists or tables where rows have complex interactions, extract the row into a separate component and use `useRef` in the parent to access current state in callbacks without recreating them.

## 2025-01-28 - [React Lazy State Initialization]
**Learning:** When initializing React state with expensive operations (like URL parameter parsing, base64 decoding, or JSON parsing), calling the function directly inside `useState` (e.g., `useState(getInitialState())`) executes the expensive operation on *every single render* of the component, even though the result is only used on the first render.
**Action:** Always use React lazy initialization by passing a function reference to `useState` (e.g., `useState(getInitialState)`) when the initial state calculation is expensive, to prevent main thread blocking and unnecessary recalculations.

## 2024-03-22 - Memoize Derived Data to Prevent Cascade Updates from UI Toggles
**Learning:** UI-only state toggles (like `isClientMode` that simply hides elements) passed down to complex list or comparison components can trigger expensive derived data recalculations (e.g., `calculateResults` mapped over arrays) on every render if that derived data is not memoized.
**Action:** Always wrap heavy data transformations or calculations (like `Math.max` over mapped arrays, or complex financial formula computations) in `useMemo` when they depend solely on an object/array prop, so that changes to purely presentational props in the same component don't cause performance regressions.

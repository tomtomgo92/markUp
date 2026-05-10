## 2026-03-05 - [React List Virtualization Pattern]
**Learning:** Extracting list items into memoized components (`React.memo`) and using `useRef` to maintain stable callback references in the parent component effectively prevents unnecessary re-renders of the entire list when a single item updates.
**Action:** When optimizing large lists or tables where rows have complex interactions, extract the row into a separate component and use `useRef` in the parent to access current state in callbacks without recreating them.

## 2025-01-28 - [React Lazy State Initialization]
**Learning:** When initializing React state with expensive operations (like URL parameter parsing, base64 decoding, or JSON parsing), calling the function directly inside `useState` (e.g., `useState(getInitialState())`) executes the expensive operation on *every single render* of the component, even though the result is only used on the first render.
**Action:** Always use React lazy initialization by passing a function reference to `useState` (e.g., `useState(getInitialState)`) when the initial state calculation is expensive, to prevent main thread blocking and unnecessary recalculations.

## 2025-03-05 - [React useMemo for Derived Data from Props]
**Learning:** Complex derived state or expensive computations (like `calculateResults(s)`) running unconditionally in the component body will execute on *every* render. This includes re-renders triggered by completely unrelated local state changes (e.g., toggling an `activeCalculator` popover) or parent UI-only prop changes (e.g., toggling `isClientMode`). This causes cascading performance degradation in large components.
**Action:** Always wrap expensive derived computations in `useMemo`, depending only on the props/state they strictly rely on (e.g., `const res = useMemo(() => calculateResults(s), [s]);`). This ensures recalculation only happens when the underlying data changes, not during generic UI interactions.
## 2026-03-05 - [React List Virtualization Pattern]
**Learning:** Extracting list items into memoized components (`React.memo`) and using `useRef` to maintain stable callback references in the parent component effectively prevents unnecessary re-renders of the entire list when a single item updates.
**Action:** When optimizing large lists or tables where rows have complex interactions, extract the row into a separate component and use `useRef` in the parent to access current state in callbacks without recreating them.

## 2025-01-28 - [React Lazy State Initialization]
**Learning:** When initializing React state with expensive operations (like URL parameter parsing, base64 decoding, or JSON parsing), calling the function directly inside `useState` (e.g., `useState(getInitialState())`) executes the expensive operation on *every single render* of the component, even though the result is only used on the first render.
**Action:** Always use React lazy initialization by passing a function reference to `useState` (e.g., `useState(getInitialState)`) when the initial state calculation is expensive, to prevent main thread blocking and unnecessary recalculations.
## 2026-03-22 - Prevent Cascading Financial Recalculations
**Learning:** UI-only state toggles (like `isClientMode` in ComparisonView or `activeCalculator` in ScenarioCard) passed down to complex components can cause cascading performance regressions if derived data recalculations (like mapped financial computations) are not memoized.
**Action:** Use `useMemo` to wrap expensive derived state operations, ensuring they only recalculate when their underlying data dependencies change, not on every component render triggered by unrelated UI state.

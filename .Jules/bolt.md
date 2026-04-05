## 2026-03-05 - [React List Virtualization Pattern]
**Learning:** Extracting list items into memoized components (`React.memo`) and using `useRef` to maintain stable callback references in the parent component effectively prevents unnecessary re-renders of the entire list when a single item updates.
**Action:** When optimizing large lists or tables where rows have complex interactions, extract the row into a separate component and use `useRef` in the parent to access current state in callbacks without recreating them.

## 2025-01-28 - [React Lazy State Initialization]
**Learning:** When initializing React state with expensive operations (like URL parameter parsing, base64 decoding, or JSON parsing), calling the function directly inside `useState` (e.g., `useState(getInitialState())`) executes the expensive operation on *every single render* of the component, even though the result is only used on the first render.
**Action:** Always use React lazy initialization by passing a function reference to `useState` (e.g., `useState(getInitialState)`) when the initial state calculation is expensive, to prevent main thread blocking and unnecessary recalculations.
## 2026-04-05 - [Memoizing Derived Financial Computations]
**Learning:** Re-renders triggered by UI-only state changes (like opening a calculator modal) inside list components caused expensive data computations (`calculateResults`) to run unnecessarily. Similarly, mapping over entire arrays to derive values in view components (like `ComparisonView`) without memoization causes redundant processing on every render.
**Action:** Use `useMemo` to memoize the results of expensive operations (like `calculateResults(s)` or mapping over `scenarios`) within components that contain internal UI state toggles, ensuring computations only run when their underlying data dependencies change.

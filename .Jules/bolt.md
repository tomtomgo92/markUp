## 2026-03-05 - [React List Virtualization Pattern]
**Learning:** Extracting list items into memoized components (`React.memo`) and using `useRef` to maintain stable callback references in the parent component effectively prevents unnecessary re-renders of the entire list when a single item updates.
**Action:** When optimizing large lists or tables where rows have complex interactions, extract the row into a separate component and use `useRef` in the parent to access current state in callbacks without recreating them.

## 2025-01-28 - [React Lazy State Initialization]
**Learning:** When initializing React state with expensive operations (like URL parameter parsing, base64 decoding, or JSON parsing), calling the function directly inside `useState` (e.g., `useState(getInitialState())`) executes the expensive operation on *every single render* of the component, even though the result is only used on the first render.
**Action:** Always use React lazy initialization by passing a function reference to `useState` (e.g., `useState(getInitialState)`) when the initial state calculation is expensive, to prevent main thread blocking and unnecessary recalculations.
## 2026-04-08 - [Memoize Derived Financial Computations]
**Learning:** In a highly interactive pricing simulator, complex derived financial calculations (like iterating over lists to sum items and determine margins) can become a significant performance bottleneck if they recalculate on every render. Specifically, UI-only state updates (like toggling a calculator popover or hovering elements) can trigger these expensive recalculations unintentionally.
**Action:** Always identify UI-only state in top-level parent components and wrap any expensive data mapping, reducing, or financial computations in `useMemo` so they only recalculate when their underlying data dependencies actually change.

## 2026-03-05 - [React List Virtualization Pattern]
**Learning:** Extracting list items into memoized components (`React.memo`) and using `useRef` to maintain stable callback references in the parent component effectively prevents unnecessary re-renders of the entire list when a single item updates.
**Action:** When optimizing large lists or tables where rows have complex interactions, extract the row into a separate component and use `useRef` in the parent to access current state in callbacks without recreating them.

## 2025-03-04 - [React Lazy Initialization for Expensive Setup]
**Learning:** In `App.jsx`, `getInitialScenarios()` performs expensive operations (URL parsing, base64 decoding, JSON parsing) to handle shareable deep links. Passing it directly to `useState(getInitialScenarios())` runs this blocking operation on every render, even though the result is only used once.
**Action:** Always pass the function reference `useState(getInitialScenarios)` for expensive state initializations. This React feature (lazy initialization) ensures the function is only executed on the initial mount, preventing main thread blocking on subsequent renders.

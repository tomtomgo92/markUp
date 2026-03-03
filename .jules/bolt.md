## 2024-05-24 - Expensive Initialization in React State
**Learning:** During state initialization, expensive operations (like URL parsing or JSON decoding) passed directly to `useState` (e.g., `useState(expensiveOp())`) will execute on *every* component re-render, blocking the main thread, even though React discards the result after the first render.
**Action:** Always use lazy initialization by passing a function reference (e.g., `useState(expensiveOp)`) for computationally expensive default state values to ensure they only run once during the initial render.

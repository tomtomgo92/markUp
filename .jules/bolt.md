
## $(date +%Y-%m-%d) - App State Initialization Bottleneck
**Learning:** The `App.jsx` component was executing an expensive state initialization function (`getInitialScenarios`) on every render. This function reads from `window.location.search`, decodes base64 data, and parses JSON. In React, `useState(getInitialScenarios())` evaluates the argument on every render, even though the state is only initialized once.
**Action:** Use lazy initialization `useState(getInitialScenarios)` to pass the function reference instead of its result. React will only call this function during the initial render, significantly improving subsequent render performance by skipping unnecessary URL parsing and decoding.

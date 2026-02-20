## 2024-05-22 - Accessible Icon-Only Buttons
**Learning:** The application relies on icon-only buttons for key actions (like delete), and responsive buttons that hide text on mobile. Without `aria-label`, these controls are inaccessible to screen reader users, especially on mobile where the text label is hidden via `display: none`.
**Action:** Systematically audit all icon-only buttons and responsive buttons. Add `aria-label` to provide descriptive context (e.g., "Supprimer ce scénario" instead of just "Supprimer") to ensure every interactive element has an accessible name.

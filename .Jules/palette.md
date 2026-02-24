## 2024-05-22 - Accessible Icon-Only Buttons
**Learning:** The application relies on icon-only buttons for key actions (like delete), and responsive buttons that hide text on mobile. Without `aria-label`, these controls are inaccessible to screen reader users, especially on mobile where the text label is hidden via `display: none`.
**Action:** Systematically audit all icon-only buttons and responsive buttons. Add `aria-label` to provide descriptive context (e.g., "Supprimer ce scénario" instead of just "Supprimer") to ensure every interactive element has an accessible name.

## 2025-05-24 - Accessibility in Data Tables
**Learning:** Dense data entry tables (like in ScenarioCard) often omit visible labels for space, making them inaccessible.
**Action:** Always add 'aria-label' to inputs in tables to provide context for screen readers.

## 2025-10-26 - Actionable Empty States
**Learning:** Static empty states ("No items") are dead ends. Making them actionable with a primary button reduces cognitive load and guides the user.
**Action:** Always include a direct call-to-action in empty state components for lists or tables.

## 2026-02-21 - [Icon-Only Buttons on Mobile]
**Learning:** Buttons that hide text on mobile (e.g., `hidden sm:inline`) become icon-only for screen reader users on small screens, losing their accessible name.
**Action:** Always add `aria-label` to buttons that reduce to icons on smaller screens, ensuring the accessible name is preserved even when the visual text is hidden.

## 2025-05-24 - Accessibility in Data Tables
**Learning:** Dense data entry tables (like in ScenarioCard) often omit visible labels for space, making them inaccessible.
**Action:** Always add 'aria-label' to inputs in tables to provide context for screen readers.

## 2025-10-26 - Actionable Empty States
**Learning:** Static empty states ("No items") are dead ends. Making them actionable with a primary button reduces cognitive load and guides the user.
**Action:** Always include a direct call-to-action in empty state components for lists or tables.

## 2025-11-01 - [Inline Delete Confirmation]
**Learning:** Modals for simple delete actions interrupt flow. Inline confirmation (e.g. click twice) is a smoother pattern for frequent actions.
**Action:** Use the `ConfirmButton` pattern for destructive actions in lists to maintain context and flow.

## 2026-05-21 - [Custom Button Focus States]
**Learning:** Custom button components often disable default outlines (`outline-none`) for aesthetics, leaving keyboard users lost.
**Action:** Always bake `focus-visible` ring styles directly into the base component (e.g., `ConfirmButton`) to ensure consistent, accessible focus indicators everywhere.

## 2026-05-22 - [Keyboard Shortcuts for Data Entry]
**Learning:** In data-heavy forms (like pricing tables), reaching for the mouse to "Add Row" breaks flow.
**Action:** Bind the `Enter` key on inputs within a list to the "Add Item" function to enable continuous, keyboard-only data entry.

## 2026-06-25 - [Keyboard Support in Inline Popovers]
**Learning:** Inline calculator popovers without `Enter` key submission force keyboard users to manually tab to or click an "Apply" button, breaking data entry flow.
**Action:** Always add `onKeyDown` listeners to inputs in inline helper popovers to submit changes directly when the `Enter` key is pressed.

## 2026-05-24 - [Auto-Selecting Default Values in Data Entry]
**Learning:** In spreadsheet-like interfaces, tabbing into a numerical field with a default "0" often places the cursor at the end. Users who immediately start typing inadvertently append numbers (typing "5" results in "05").
**Action:** Always add `onFocus={(e) => e.target.select()}` to numerical inputs in data-heavy forms to remove friction and match standard spreadsheet behavior.


## 2026-06-25 - [Dynamic Popovers Semantic Labels]
**Learning:** Using static IDs or no IDs for labels in dynamic popovers or calculators leads to inaccessible inputs or ID collisions when multiple instances are rendered.
**Action:** Always use `useId()` in React to generate unique, stable IDs to link `<label htmlFor={id}>` with `<input id={id}>` in reusable components like popovers to ensure accessibility and larger click targets without collisions.

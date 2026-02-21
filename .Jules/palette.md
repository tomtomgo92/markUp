## 2026-02-21 - [Icon-Only Buttons on Mobile]
**Learning:** Buttons that hide text on mobile (e.g., `hidden sm:inline`) become icon-only for screen reader users on small screens, losing their accessible name.
**Action:** Always add `aria-label` to buttons that reduce to icons on smaller screens, ensuring the accessible name is preserved even when the visual text is hidden.

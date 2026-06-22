# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-06-22

### Added

- Footer now displays tool links and a company logo component.
- Project documentation: `CLAUDE.md` developer guidelines and `README.md`.

### Changed

- Replaced Tailwind utility classes with dedicated CSS modules and migrated to the
  `@thatmuch/designsystem` component library.
- Moved scenario calculation and management logic from `ScenarioCard` into `ScenarioTable`.
- Replaced health status dots with semantic design-system tags in `ScenarioItemRow`.

### Removed

- Corporate tax (IS) calculations and display logic throughout the application.

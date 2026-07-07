---
name: release-publisher
description: Guides publishing release versions of the application using Git flow and Semantic Versioning. Triggers on requests like "publie la prochaine release", "publish release", "create release branch", "git flow release".
---

# Git Flow & SemVer Release Publisher Skill

Use this skill when the user requests to publish the next release or execute Git flow release commands.

## Workflow

### 1. Analyze Version & Commits
- **Check current version**: Read `package.json` to find the current version.
- **Inspect unreleased changes**: Run `git log <latest-tag>..develop --oneline` (or comparing `main` and `develop`) to list commits to be released.
- **Determine next version** using Semantic Versioning rules:
  - If there is any `feat` commit (or `feat:` in message) → bump **MINOR** version.
  - If there are only `fix`, `refactor`, `docs`, `chore`, `style` commits → bump **PATCH** version.
  - If there is a `BREAKING CHANGE` or `!` in the commit message → bump **MAJOR** version.
- **Identify changes**: List the specific changes for `CHANGELOG.md` classification under `Added`, `Changed`, `Fixed`, or `Removed`.

### 2. Create Implementation Plan (Planning Mode)
- Write an `implementation_plan.md` artifact detailing:
  - The next version decided (e.g. `v0.2.0`).
  - Rationale for the SemVer bump.
  - Exact file modifications (`package.json` and `CHANGELOG.md`).
  - Verification steps (running test suites).
- Request user review and wait for approval.

### 3. Execute Release
- **Initialize release branch**:
  ```bash
  git flow release start <version>
  ```
- **Bump metadata**:
  - In `package.json`: Update `"version"` to the new version.
  - In `CHANGELOG.md`: Move unreleased commits under a new `## [<version>] - YYYY-MM-DD` section, leaving `## [Unreleased]` empty.
- **Verify**:
  - Run the test suite: `npm test -- --run` (or equivalent test script).
- **Stage and Commit**:
  ```bash
  git add package.json CHANGELOG.md
  git commit -m "chore(release): v<version>"
  ```
- **Finish release non-interactively**:
  - Run git flow release finish with `GIT_EDITOR=true` and `-m` for the tag message to avoid opening interactive prompts:
    ```bash
    GIT_EDITOR=true git flow release finish -m "v<version>" <version>
    ```
- **Align Tag Prefix**:
  - If git flow creates a tag without the `v` prefix (e.g. `0.2.0`) but the repo uses the `v` prefix (e.g. `v0.1.0`), create a matching tag `v<version>` pointing to the same merge commit:
    ```bash
    git tag -a v<version> -m "v<version>" <version>
    ```
- **Push branches and tags**:
  ```bash
  git push origin main develop --tags
  ```

### 4. Verification & Walkthrough
- Create a `walkthrough.md` artifact showing:
  - Changes made.
  - Test validation results.
  - Git push output confirming remote synchronization.

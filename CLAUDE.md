# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Mermaid is a JavaScript-based diagramming and charting tool that uses Markdown-inspired text definitions to create and modify complex diagrams. This is a monorepo managed with pnpm workspaces.

## Development Environment

### Docker Development (Recommended)

The repository includes Docker support via the `./run` script (a wrapper around docker-compose):

```bash
# Initial setup
./run pnpm install

# Development server with examples (http://localhost:9000)
./run dev

# Documentation site (http://localhost:3333)
./run docs:dev

# Run tests
./run pnpm test
./run pnpm vitest       # Unit test watcher
./run cypress           # Integration tests (requires dev server running)

# Build for production
./run pnpm build

# Access shell inside container
./run sh
```

**Note**: For Cypress GUI tests in Docker, enable X11 connections first: `xhost +local:`

### Host Development

```bash
# Initial setup
pnpm install

# Development
pnpm dev                # Dev server (http://localhost:9000)
pnpm --filter mermaid docs:dev  # Docs (http://localhost:3333)

# Testing
pnpm test               # Lint + unit tests
pnpm test:watch         # Unit test watcher
pnpm test:coverage      # Unit tests with coverage
pnpm e2e                # E2E tests (requires dev server)
pnpm cypress:open       # Cypress GUI

# Building
pnpm build              # Build everything
pnpm build:esbuild      # Build packages only
pnpm build:types        # Build TypeScript types only
```

## Monorepo Structure

The repository uses pnpm workspaces with multiple packages:

- **`packages/mermaid/`** - Core library (main package)
- **`packages/parser/`** - Langium-based parser for diagram syntax
- **`packages/mermaid-zenuml/`** - ZenUML integration
- **`packages/mermaid-layout-elk/`** - ELK layout engine
- **`packages/mermaid-layout-tidy-tree/`** - Tidy tree layout
- **`packages/mermaid-example-diagram/`** - Example diagram template
- **`packages/tiny/`** - Minimal build variant
- **`packages/examples/`** - Example integrations

## Core Architecture

### Diagram Registration System

Mermaid uses a plugin-based architecture for diagrams. Each diagram type has:

1. **Detector** - Identifies diagram type from text (e.g., `/^\s*graph/` for flowcharts)
2. **Loader** - Lazy-loads diagram implementation
3. **Renderer** - Renders the diagram to SVG

Diagrams are registered in `packages/mermaid/src/diagram-api/diagram-orchestration.ts` and loaded via the detector/loader pattern to support code-splitting.

### Key Source Directories

- **`packages/mermaid/src/diagrams/`** - All diagram implementations (flowchart, sequence, class, state, gantt, etc.)
- **`packages/mermaid/src/rendering-util/`** - Shared rendering utilities
- **`packages/mermaid/src/diagram-api/`** - Diagram detection and loading
- **`packages/mermaid/src/themes/`** - Theme definitions
- **`packages/mermaid/src/docs/`** - Documentation source (DO NOT edit `/docs` directly - it's auto-generated)

### Build System

- **esbuild** for bundling (config in `.esbuild/`)
- **TypeScript** for type checking (separate from esbuild)
- Generates multiple outputs:
  - ESM: `mermaid.core.mjs` (tree-shakeable)
  - IIFE: `mermaid.js` (browser global)
  - Minified variants
  - Tiny build (subset of features)

## Testing

### Unit Tests (Vitest)

- All code except layout should have unit tests
- Run: `pnpm test:watch` for development
- DOM testing: Use `jsdomIt` helper from `tests/util.ts` for DOM interactions
- Tests cannot verify layout/rendering (use E2E for that)

### Integration Tests (Cypress)

- Test rendering and visual appearance
- Use `imgSnapshotTest()` helper for snapshot testing
- Visual regression testing powered by Argos
- Located in `cypress/integration/`
- Run specific test: `./run cypress run --spec cypress/integration/rendering/test.spec.ts`

## Branch Naming Convention

```
[feature | bug | chore | docs]/[issue-number]_[short-description]
```

Examples:

- `feature/2945_state-diagram-new-arrow-florbs`
- `bug/1123_fix_random_ugly_red_text`
- `docs/2910_update-contributing-guidelines`

Start feature branches from `develop` (not `main`).

## Common Tasks

### Adding a New Diagram Type

1. Create directory in `packages/mermaid/src/diagrams/[name]/`
2. Implement detector, parser, renderer, and db (state management)
3. Register in `diagram-orchestration.ts`
4. Add integration tests with visual snapshots
5. Update documentation in `packages/mermaid/src/docs/`

### Running a Single Test

```bash
# Unit test
pnpm exec vitest run path/to/test.spec.ts

# E2E test
pnpm cypress run --spec cypress/integration/path/to/test.spec.ts
```

### Fixing Linting Issues

```bash
pnpm lint:fix
```

### Documentation Changes

- Edit files in `packages/mermaid/src/docs/` (NOT `/docs`)
- Use triple backticks with `note`, `tip`, `warning`, `danger` for callouts
- Do NOT use VitePress syntax (`::: warning`)
- Mark new features with `(v<MERMAID_RELEASE_VERSION>+)` in titles
- Preview: `pnpm --filter mermaid docs:dev` → http://localhost:3333

### Parser Changes (Langium)

If modifying grammar files in `packages/parser/`:

```bash
pnpm --filter @mermaid-js/parser langium:generate
```

## Important Notes

- Main development branch is **`develop`** (not `main`)
- `/docs` folder is auto-generated - edit `packages/mermaid/src/docs/` instead
- Visual regression tests run automatically on PRs via Argos
- Coverage reports upload to Codecov on PRs
- Build must pass TypeScript checks and all tests before merging

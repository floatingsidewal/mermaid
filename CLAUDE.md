# CLAUDE.md - Mermaid Codebase Guide for AI Assistants

> Last Updated: 2025-11-15
>
> This guide provides comprehensive information about the Mermaid codebase structure, development workflows, and conventions specifically designed for AI assistants working with this repository.

## Table of Contents

- [Project Overview](#project-overview)
- [Repository Structure](#repository-structure)
- [Development Setup](#development-setup)
- [Architecture & Code Organization](#architecture--code-organization)
- [Development Workflow](#development-workflow)
- [Testing Strategy](#testing-strategy)
- [Coding Standards & Conventions](#coding-standards--conventions)
- [Build & Release Process](#build--release-process)
- [Key Files & Directories](#key-files--directories)
- [Common Tasks](#common-tasks)
- [Tips for AI Assistants](#tips-for-ai-assistants)

---

## Project Overview

**Mermaid** is a JavaScript-based diagramming and charting tool that uses Markdown-inspired text definitions and a renderer to create and modify complex diagrams.

- **Project Type:** Monorepo (pnpm workspaces)
- **Primary Language:** TypeScript
- **Build Tools:** esbuild, TypeScript compiler
- **Testing:** Vitest (unit tests), Cypress (E2E tests)
- **Package Manager:** pnpm (v10.4.1+)
- **Current Version:** 11.11.0 (main package)
- **License:** MIT

### Key Links

- Documentation: https://mermaid.js.org
- Live Editor: https://mermaid.live/
- Repository: https://github.com/mermaid-js/mermaid
- Discord: https://discord.gg/sKeNQX4Wtj

---

## Repository Structure

```
mermaid/
├── .esbuild/              # esbuild configuration and build scripts
├── .vite/                 # Vite configuration for dev server
├── .github/               # GitHub Actions workflows and configs
├── cypress/               # E2E tests
├── demos/                 # Demo files for local development
│   └── dev/              # Development demo files
├── packages/              # Monorepo packages
│   ├── mermaid/          # Main mermaid package
│   │   ├── src/
│   │   │   ├── diagrams/ # All diagram type implementations
│   │   │   ├── rendering-util/  # Shared rendering utilities
│   │   │   ├── dagre-wrapper/   # Dagre layout wrapper
│   │   │   ├── diagram-api/     # Diagram registration API
│   │   │   ├── utils/           # Utility functions
│   │   │   ├── types/           # TypeScript type definitions
│   │   │   ├── tests/           # Test utilities
│   │   │   ├── schemas/         # JSON schemas
│   │   │   └── docs/            # Documentation source (Markdown)
│   │   ├── scripts/      # Build and utility scripts
│   │   └── package.json
│   ├── parser/           # Langium-based parser
│   ├── mermaid-zenuml/   # ZenUML diagram support
│   ├── mermaid-layout-elk/      # ELK layout engine
│   ├── mermaid-layout-tidy-tree/ # Tidy tree layout
│   ├── mermaid-example-diagram/ # Example diagram template
│   ├── tiny/             # Minimal mermaid bundle
│   └── examples/         # Usage examples
├── patches/              # pnpm patches for dependencies
├── scripts/              # Repository-level scripts
├── tests/                # Additional test configurations
├── img/                  # Images for documentation
├── package.json          # Root package.json (monorepo config)
├── pnpm-workspace.yaml   # pnpm workspace configuration
├── tsconfig.json         # Root TypeScript configuration
├── eslint.config.js      # ESLint configuration
├── .prettierrc.json      # Prettier configuration
└── README.md             # Main README
```

### Supported Diagram Types

Located in `packages/mermaid/src/diagrams/`:

- **architecture** - Architecture diagrams
- **block** - Block diagrams
- **c4** - C4 architecture diagrams
- **class** - Class diagrams
- **er** - Entity-relationship diagrams
- **error** - Error diagrams
- **flowchart** - Flowcharts
- **gantt** - Gantt charts
- **git** - Git graphs
- **info** - Info diagrams
- **kanban** - Kanban boards
- **mindmap** - Mind maps
- **packet** - Packet diagrams
- **pie** - Pie charts
- **quadrant-chart** - Quadrant charts
- **radar** - Radar charts
- **requirement** - Requirement diagrams
- **sankey** - Sankey diagrams
- **sequence** - Sequence diagrams
- **state** - State diagrams
- **xychart** - XY charts

---

## Development Setup

### Prerequisites

- **Node.js**: Version specified in `.node-version`
- **pnpm**: v10.4.1+ (specified in `packageManager` field)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/mermaid-js/mermaid.git
cd mermaid

# Install pnpm (if not already installed)
curl -fsSL https://get.pnpm.io/install.sh | sh -
pnpm env use --global 20

# Install dependencies
pnpm install

# Verify setup
pnpm test
```

### Docker Development (Alternative)

The repository includes a `run` script for Docker-based development:

```bash
# Make the run script executable
chmod +x run

# Install packages
./run pnpm install

# Run tests
./run pnpm test

# Start dev server
./run dev
```

---

## Architecture & Code Organization

### Monorepo Structure

This is a **pnpm workspace** monorepo. Key packages:

1. **`packages/mermaid`** - Main package, contains all core functionality
2. **`packages/parser`** - Langium-based parser (shared by diagrams)
3. **Layout packages** - Alternative layout engines (elk, tidy-tree)
4. **Extension packages** - Additional diagram types (zenuml)

### Diagram Implementation Pattern

Each diagram type follows a consistent structure in `packages/mermaid/src/diagrams/<diagram-name>/`:

```
<diagram-name>/
├── <diagram-name>Db.ts       # Database/state management
├── <diagram-name>Db.spec.ts  # Database tests
├── <diagram-name>Renderer.ts # Rendering logic
├── <diagram-name>Detector.ts # Diagram type detection
├── <diagram-name>Diagram.ts  # Diagram registration
├── parser/                    # Parser files (if applicable)
├── styles.ts                  # Diagram-specific styles
└── types.ts                   # TypeScript types
```

### Core Modules

- **`diagram-api/`** - Provides the diagram registration system
- **`rendering-util/`** - Shared rendering utilities (nodes, edges, labels)
- **`dagre-wrapper/`** - Graph layout using dagre-d3
- **`utils/`** - Common utilities (sanitization, parsing, etc.)
- **`types/`** - Shared TypeScript types

### Key Dependencies

- **d3** - Data visualization and DOM manipulation
- **dagre-d3-es** - Graph layout
- **cytoscape** - Alternative graph layout
- **dompurify** - HTML sanitization
- **marked** - Markdown parsing
- **katex** - Math rendering
- **roughjs** - Hand-drawn style rendering

---

## Development Workflow

### Branching Strategy

Mermaid uses **Git Flow**-inspired branching:

- **`develop`** - Main development branch (work from here)
- **`master`** - Production branch (live docs and releases)
- **Feature branches** - Named using convention: `[type]/[issue-number]_[description]`

### Branch Naming Convention

```
[feature | bug | chore | docs]/[issue-number]_[short-description]
```

Examples:
- `feature/2945_state-diagram-new-arrow-florbs`
- `bug/1123_fix_random_ugly_red_text`
- `docs/2910_update-contributing-guidelines`
- `chore/3001_upgrade-dependencies`

### Typical Development Process

1. **Checkout develop and update:**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create feature branch:**
   ```bash
   git checkout -b feature/1234_add-new-diagram-type
   ```

3. **Start dev server:**
   ```bash
   pnpm dev
   # Opens http://localhost:9000
   ```

4. **Make changes** in `packages/mermaid/src/`

5. **Run tests:**
   ```bash
   pnpm test          # Run all tests
   pnpm test:watch    # Watch mode
   ```

6. **Run linting:**
   ```bash
   pnpm lint          # Check
   pnpm lint:fix      # Auto-fix
   ```

7. **Build:**
   ```bash
   pnpm build
   ```

8. **Commit and push:**
   ```bash
   git add .
   git commit -m "feature: add new diagram type"
   git push -u origin feature/1234_add-new-diagram-type
   ```

9. **Open Pull Request** targeting `develop`

---

## Testing Strategy

### Unit Tests (Vitest)

- **Framework:** Vitest
- **Location:** `*.spec.ts` files alongside source code
- **Commands:**
  ```bash
  pnpm test              # Run all tests
  pnpm test:watch        # Watch mode
  pnpm test:coverage     # With coverage
  ```

#### Writing Unit Tests

- Use `vitest` for standard tests
- Use `jsdomIt` for DOM-related tests (see `packages/mermaid/src/tests/util.ts`)
- Example:

```typescript
import { jsdomIt } from './tests/util.js';

jsdomIt('should render element in SVG', ({ svg }) => {
  // Test code with DOM access
  expect(svg.select('.element')).toBeDefined();
});
```

### Integration/E2E Tests (Cypress)

- **Framework:** Cypress
- **Location:** `cypress/integration/`
- **Commands:**
  ```bash
  pnpm dev               # Start dev server (required)
  pnpm cypress:open      # Open Cypress UI
  pnpm e2e               # Run E2E tests headless
  ```

#### Visual Regression Tests

Use `imgSnapshotTest` for visual testing:

```javascript
it('should render diagram correctly', () => {
  imgSnapshotTest(
    `
    graph TD
      A-->B
    `,
    { logLevel: 0 }
  );
});
```

### Testing DOM Interactions

For tests that need DOM but not layout rendering:
- Use `jsdomIt` wrapper (from `tests/util.ts`)
- Creates pseudo-browser environment with JSDOM
- Note: No layout rendering (use E2E for layout tests)

---

## Coding Standards & Conventions

### TypeScript

- **Target:** ES2018
- **Module:** NodeNext (ES modules)
- **Strict mode:** Enabled
- **Style:** See `tsconfig.json`

### Code Formatting

**Prettier Configuration** (`.prettierrc.json`):
```json
{
  "endOfLine": "auto",
  "printWidth": 100,
  "singleQuote": true,
  "useTabs": false,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Linting

- **ESLint:** Configured with TypeScript, Unicorn, JSDoc plugins
- **Configuration:** `eslint.config.js`
- **Key Rules:**
  - TypeScript strict checking
  - Recommended + stylistic rules
  - No-only-tests (prevents `.only` in tests)
  - Custom spell-checking with cspell

### Code Style Guidelines

1. **File Naming:**
   - Use camelCase for TypeScript files: `flowDb.ts`
   - Use kebab-case for directories: `sequence-diagram/`
   - Test files: `*.spec.ts`

2. **Imports:**
   - Use ES modules (`import`/`export`)
   - Prefer named imports over default imports
   - Use `.js` extension in imports (TypeScript convention)

3. **Type Safety:**
   - Avoid `any` - use proper types
   - Use strict null checks
   - Prefer interfaces for object shapes
   - Use type-only imports where applicable

4. **Comments:**
   - Use JSDoc for public APIs
   - Include type information in JSDoc
   - Explain "why" not "what"

5. **Error Handling:**
   - Use proper error types
   - Sanitize user input (use DOMPurify)
   - Validate diagram definitions

### Security Considerations

- **Always sanitize user input** - Mermaid accepts text that becomes HTML
- **Use DOMPurify** for HTML sanitization
- **Be cautious with `innerHTML`** - prefer DOM APIs
- **Validate URLs** - use `@braintree/sanitize-url`

---

## Build & Release Process

### Build System

Mermaid uses **esbuild** for bundling and **TypeScript compiler** for type generation.

**Build Commands:**
```bash
pnpm build              # Full build (esbuild + types)
pnpm build:esbuild      # Build with esbuild only
pnpm build:types        # Generate type declarations
pnpm build:mermaid      # Build mermaid package only
pnpm build:viz          # Build with visualizer
```

### Build Configuration

- **esbuild config:** `.esbuild/build.ts`
- **Type generation:** `.build/types.ts`
- **Output:** `packages/mermaid/dist/`

### Release Process

1. Uses **Changesets** for version management
2. Maintainers create `release/vX.X.X` branch from `develop`
3. Extensive testing on release branch
4. Tag and merge to `master` for release
5. Published to npm

**Changeset Commands:**
```bash
pnpm changeset:version   # Update versions
pnpm changeset:publish   # Publish to npm
```

### Documentation

- **Source:** `packages/mermaid/src/docs/` (Markdown)
- **Engine:** VitePress
- **Output:** `/docs` (auto-generated, do not edit manually)
- **Live Docs:** Built from `master` branch

**Documentation Commands:**
```bash
pnpm --filter mermaid docs:dev      # Start docs dev server
pnpm --filter mermaid docs:build    # Build docs
```

Documentation server runs on http://localhost:3333/

---

## Key Files & Directories

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Root monorepo config, workspace scripts |
| `pnpm-workspace.yaml` | pnpm workspace definition |
| `tsconfig.json` | Root TypeScript config |
| `eslint.config.js` | ESLint configuration |
| `.prettierrc.json` | Prettier formatting rules |
| `.node-version` | Node.js version specification |
| `.github/workflows/` | CI/CD workflows (test, lint, release) |

### Important Source Files

| File | Purpose |
|------|---------|
| `packages/mermaid/src/mermaid.ts` | Main entry point |
| `packages/mermaid/src/config.ts` | Configuration management |
| `packages/mermaid/src/defaultConfig.ts` | Default configuration |
| `packages/mermaid/src/diagram-api/diagram-orchestration.ts` | Diagram registration system |
| `packages/mermaid/src/utils/` | Shared utilities |
| `packages/mermaid/src/rendering-util/` | Rendering helpers |

### Build & Development Files

| File/Directory | Purpose |
|----------------|---------|
| `.esbuild/` | esbuild configuration and plugins |
| `.vite/` | Vite dev server configuration |
| `scripts/` | Repository maintenance scripts |
| `demos/dev/` | Local development demos |
| `cypress/` | E2E test files |

---

## Common Tasks

### Adding a New Diagram Type

1. Create directory: `packages/mermaid/src/diagrams/my-diagram/`
2. Implement required files:
   - `myDiagramDb.ts` - State management
   - `myDiagramRenderer.ts` - Rendering logic
   - `myDiagramDetector.ts` - Type detection
   - `myDiagramDiagram.ts` - Registration
   - `styles.ts` - Styles
   - `types.ts` - TypeScript types
3. Add parser (if needed) in `parser/` subdirectory
4. Register diagram in diagram orchestration
5. Add tests (unit + E2E)
6. Update documentation in `packages/mermaid/src/docs/`

### Modifying Existing Diagram

1. Locate diagram in `packages/mermaid/src/diagrams/<diagram-name>/`
2. Modify relevant files (Db, Renderer, etc.)
3. Update/add tests
4. Test locally with dev server
5. Update documentation if needed
6. Add changeset if it's a user-facing change

### Adding Dependencies

```bash
# Add to main package
pnpm --filter mermaid add <package-name>

# Add as dev dependency
pnpm --filter mermaid add -D <package-name>

# Add to root (build tools, etc.)
pnpm add -D -w <package-name>
```

### Running Specific Package Scripts

```bash
# Run script in mermaid package
pnpm --filter mermaid <script-name>

# Example: build types in mermaid package
pnpm --filter mermaid types:build-config
```

### Debugging

1. **Dev Server:** Use `pnpm dev` and open http://localhost:9000
2. **Custom Test Cases:**
   - Copy `demos/dev/example.html`
   - Add your diagram code
   - Access at http://localhost:9000/dev/your-file.html
3. **Browser DevTools:** Standard debugging works with source maps
4. **Tests:** Use `pnpm test:watch` for rapid iteration

### Checking for Circular Dependencies

```bash
pnpm --filter mermaid checkCircle
```

---

## Tips for AI Assistants

### When Working with This Codebase

1. **Always work from `develop` branch** - Not `master`
2. **Follow branch naming convention** - Use issue numbers when available
3. **Run tests before committing** - `pnpm test` and `pnpm lint`
4. **Update documentation** - If changing user-facing features
5. **Use version placeholders** - `(v<MERMAID_RELEASE_VERSION>+)` in docs for new features

### Understanding Code Context

- **Diagram implementations are self-contained** - Each in its own directory
- **Shared code in `rendering-util/` and `utils/`** - Check there for utilities
- **Parser is separate package** - Located in `packages/parser/`
- **Tests co-located with source** - Look for `*.spec.ts` files
- **Build output is generated** - Don't modify `dist/` or `/docs` directly

### Common Gotchas

1. **Documentation source vs. output:**
   - Source: `packages/mermaid/src/docs/`
   - Output: `/docs/` (auto-generated)
   - Never edit `/docs/` directly

2. **Import paths use `.js` extension:**
   - TypeScript convention for ES modules
   - Even though source files are `.ts`

3. **Testing the DOM:**
   - Use `jsdomIt` for DOM tests without layout
   - Use Cypress E2E for visual/layout tests

4. **Parser files:**
   - May be generated by Jison or Langium
   - Check for `.jison` or grammar files

5. **Monorepo commands:**
   - Use `pnpm --filter <package>` to run package-specific commands
   - Root commands affect all packages

### Code Reading Strategy

1. **Start with the diagram registration** - `<diagram>Diagram.ts`
2. **Check the detector** - How is the diagram type identified?
3. **Review the database** - `<diagram>Db.ts` for state management
4. **Examine the renderer** - `<diagram>Renderer.ts` for drawing logic
5. **Look at tests** - `*.spec.ts` files show usage patterns

### Making Changes Safely

1. ✅ **DO:**
   - Write tests for new features and bug fixes
   - Update documentation for user-facing changes
   - Follow existing patterns in diagram implementations
   - Sanitize user input
   - Use TypeScript strictly

2. ❌ **DON'T:**
   - Modify files in `/docs` (they're generated)
   - Modify files in `dist/` (build output)
   - Use `any` type without good reason
   - Skip tests
   - Introduce dependencies without discussion
   - Push directly to `master` or `develop`

### Documentation Style

When updating docs in `packages/mermaid/src/docs/`:

- Use Markdown (GitHub-flavored)
- Use code blocks with `mermaid` language tag for examples
- Use `note`, `tip`, `warning`, `danger` in triple backticks (not `::: note`)
- Include version info for new features: `(v<MERMAID_RELEASE_VERSION>+)`
- Update sidebar nav in `.vitepress/config.ts` if adding new sections

### Performance Considerations

- Mermaid runs in the browser - be mindful of bundle size
- Use code splitting where appropriate
- Lazy load diagram implementations when possible
- Optimize rendering for large diagrams
- Be careful with regex complexity (parser performance)

### Testing Checklist

Before submitting a PR, ensure:

- [ ] Unit tests pass: `pnpm test`
- [ ] Linting passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build`
- [ ] E2E tests pass (if applicable): `pnpm e2e`
- [ ] No circular dependencies: `pnpm --filter mermaid checkCircle`
- [ ] Documentation updated (if needed)
- [ ] Changeset added (if needed)

---

## Additional Resources

### Official Documentation

- [Mermaid Docs](https://mermaid.js.org/)
- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

### Community

- [Discord](https://discord.gg/sKeNQX4Wtj)
- [GitHub Discussions](https://github.com/mermaid-js/mermaid/discussions)
- [GitHub Issues](https://github.com/mermaid-js/mermaid/issues)

### Development

- [Live Editor (develop)](https://develop.git.mermaid.live/)
- [Live Editor (next)](https://next.git.mermaid.live/)
- [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli)

---

## Version Information

This CLAUDE.md was generated based on the codebase state as of:
- **Mermaid Version:** 11.11.0
- **Monorepo Version:** 10.2.4
- **Node.js:** Check `.node-version`
- **pnpm:** 10.4.1+

For the most up-to-date information, always refer to the official documentation and source code.

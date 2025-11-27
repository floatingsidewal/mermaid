# SmartShape Diagram - Product Requirements Document

**Issue:** [#2494 - Implement "PowerPoint SmartArt"](https://github.com/mermaid-js/mermaid/issues/2494)
**Branch:** `feature/2494_smartart-diagrams`
**Scope:** Phase 1 - List Diagrams (with extensible architecture for future types)

## Decisions Made

- **Keyword:** `smartshape` (no beta suffix)
- **Initial shapes:** list-block, list-bullet, list-chevron, list-pyramid
- **Syntax style:** Indentation-based (like treemap)
- **Visual specs:** Captured from PowerPoint SmartArt screenshots

---

## 1. Overview

### 1.1 Problem Statement

Users want PowerPoint SmartArt-like diagrams in Mermaid that dynamically resize and adapt based on input data. Currently, Mermaid lacks simple visual list representations that automatically adjust their layout when items are added or removed.

### 1.2 Solution

Create a new **SmartShape** diagram type that renders dynamic, self-adjusting visualizations. Phase 1 focuses on List-style diagrams, with architecture designed to support future FlowChart and Cycle variants.

### 1.3 Design Principles

1. **Dynamic Sizing** - Shapes automatically resize when items are added/removed
2. **Extensibility** - Core architecture supports multiple shape families (List, FlowChart, Cycle)
3. **Simplicity** - Minimal syntax for common use cases
4. **Consistency** - Follow existing Mermaid patterns and conventions

---

## 2. Syntax Specification

### 2.1 Basic Syntax

```
smartshape
    type: list-block
    Item One
        Sub-item A
        Sub-item B
    Item Two
    Item Three
```

### 2.2 Grammar Definition

```
smartshape [type]
    [title: "Optional Title"]
    item1
        subitem1
        subitem2
    item2
    ...
```

### 2.3 Supported List Types (Phase 1)

| Type ID        | Description              | Visual Style                                  |
| -------------- | ------------------------ | --------------------------------------------- |
| `list-block`   | Two-column row layout    | Label block + detail block per row            |
| `list-bullet`  | Header bars with bullets | Colored headers, plain bullets below          |
| `list-chevron` | Vertical chevron arrows  | Overlapping downward arrows with detail boxes |
| `list-pyramid` | Pyramid hierarchy        | Triangle background with text boxes           |

### 2.4 Syntax Options

```
smartshape
    type: list-block
    direction: TB          %% TB (default), LR, BT, RL
    title: "My List"
    Item One
        Sub-item A
```

---

## 3. Visual Specifications (From Screenshots)

### 3.1 list-block

**Layout:** Two-column horizontal layout per row

```
┌───────────┬─────────────────────────────┐
│  block    │ • sub block 1               │  ← Row 1
│   one     │ • sub block 2               │
├───────────┼─────────────────────────────┤
│  block 2  │ • sub block 2 - text        │  ← Row 2
├───────────┼─────────────────────────────┤
│  block 3  │ • sub block 3 - text 1      │  ← Row 3
│           │ • sub block 3 - text 2      │
│           │ • sub block 3 - text 3      │
└───────────┴─────────────────────────────┘
```

**Visual Elements:**

- **Label block (left):** Dark colored rounded rectangle, white centered text
- **Detail block (right):** Light gray rounded rectangle, bullet points
- **Label width:** Fixed across all rows
- **Detail width:** Fills remaining horizontal space
- **Row height:** Adapts to content (more sub-items = taller row)

**Dynamic Resizing:**

- Adding items → adds more rows
- More sub-items → row grows taller
- Width remains constant

---

### 3.2 list-bullet

**Layout:** Vertical stack of header bars with plain bullets

```
┌─────────────────────────────┐
│  One                        │  ← colored header bar
└─────────────────────────────┘
  • subone                       ← plain bullet (no container)
  • subone2

┌─────────────────────────────┐
│  Two                        │
└─────────────────────────────┘
  • subtwo
  • subtwo2
```

**Visual Elements:**

- **Header bar:** Full-width rounded rectangle, dark color, white text
- **Sub-items:** Plain text with bullet points (•), no container box
- **Spacing:** Gap between header and bullets, gap between sections

**Dynamic Resizing:**

- Adding items → adds more header sections
- More sub-items → section grows taller
- Simplest shape type - good for default

---

### 3.3 list-chevron

**Layout:** Vertical stack of chevron shapes with detail boxes

```
┌──────────┬─────────────────────┐
│    ▼     │ • subitem1          │
│   one    │ • subitem2          │
│    ▼     │                     │
├──────────┼─────────────────────┤
│    ▼     │ • subitem           │
│   two    │                     │
│    ▼     │                     │
├──────────┼─────────────────────┤
│    ▼     │ • subitem1          │
│  three   │ • subitem2          │
│    ▼     │                     │
└──────────┴─────────────────────┘
```

**Visual Elements:**

- **Chevron shape:** Downward-pointing arrow/V shape, dark color, white text
- **Detail box:** Rounded rectangle to the right, light background, bullets
- **Overlap:** Each chevron's point overlaps into the top of the next chevron
- **Text position:** Main label centered in chevron body

**Dynamic Resizing:**

- Adding items → adds more chevron rows
- Fewer items → chevrons are proportionally taller
- Row height adapts to sub-item content
- Chevron width stays constant

---

### 3.4 list-pyramid

**Layout:** Triangle background with text boxes on right side

```
        /\
       /  \  ┌─────────────────────┐
      / 1  \ │ • subone            │
     /──────\└─────────────────────┘
    /        \┌─────────────────────┐
   /    2     │ • subtwo            │
  /───────────┘• subtwo2            │
 /             └────────────────────┘
/              ┌────────────────────┐
      3        │ • subthree1        │
\              │ • subthree2        │
 ──────────────└────────────────────┘
```

**Visual Elements:**

- **Triangle background:** Can be filled (solid color) or outlined
- **Horizontal bands:** Pyramid divides into equal sections based on item count
- **Text boxes:** Rounded rectangles positioned on right side of pyramid
- **Box width:** Follows pyramid slope (wider at bottom)
- **Sub-items:** Bullet points inside text boxes

**Dynamic Resizing:**

- Adding items → pyramid subdivides into more horizontal bands
- Band height = total pyramid height / item count
- Text box width at each level follows pyramid width at that position
- Sub-items don't affect band count, just content within box

**Style Variants:**

- Filled: Solid colored triangle (e.g., orange)
- Outlined: Just the triangle border with diagonal line through boxes

---

## 4. Architecture

### 4.1 Package Structure

```
packages/mermaid/src/diagrams/smartshape/
├── detector.ts              # Diagram type detection
├── smartshapeDiagram.ts     # Main diagram definition
├── smartshapeDb.ts          # State management
├── smartshapeParser.ts      # Langium parser integration
├── smartshapeRenderer.ts    # Main renderer (delegates to shape renderers)
├── smartshapeStyles.ts      # CSS styles
├── smartshapeTypes.ts       # TypeScript interfaces
├── shapes/                  # Shape-specific renderers
│   ├── index.ts             # Shape registry
│   ├── baseShape.ts         # Abstract base class
│   ├── listBlock.ts         # list-block renderer
│   ├── listBullet.ts        # list-bullet renderer
│   ├── listChevron.ts       # list-chevron renderer
│   └── listPyramid.ts       # list-pyramid renderer
└── __tests__/
    └── smartshape.spec.ts

packages/parser/src/language/smartshape/
├── smartshape.langium       # Grammar definition
├── module.ts                # Langium module
├── tokenBuilder.ts          # Token builder
├── valueConverter.ts        # Value converter
└── index.ts
```

### 4.2 Core Interfaces

```typescript
// smartshapeTypes.ts

export interface SmartShapeItem {
  id: string;
  text: string;
  children: SmartShapeItem[];
  level: number;
  classSelector?: string;
}

export interface SmartShapeConfig {
  type: SmartShapeType; // 'list-block', 'list-bullet', etc.
  direction: Direction; // 'TB' | 'LR' | 'BT' | 'RL'
  title?: string;
}

export type SmartShapeType = 'list-block' | 'list-bullet' | 'list-chevron' | 'list-pyramid';

export interface SmartShapeDB extends DiagramDB {
  getItems(): SmartShapeItem[];
  addItem(item: SmartShapeItem): void;
  getConfig(): SmartShapeConfig;
  setType(type: SmartShapeType): void;
  setDirection(direction: Direction): void;
}
```

### 4.3 Shape Renderer Interface

```typescript
// shapes/baseShape.ts

export interface ShapeRenderContext {
  svg: SVG;
  items: SmartShapeItem[];
  config: SmartShapeConfig;
  theme: ThemeVariables;
  containerWidth: number;
  containerHeight: number;
}

export interface ShapeRenderer {
  /** Unique identifier for this shape type */
  readonly type: SmartShapeType;

  /**
   * Calculate dimensions based on items
   * Called before render to determine SVG size
   */
  calculateDimensions(ctx: ShapeRenderContext): { width: number; height: number };

  /**
   * Render the shape to SVG
   * Returns the rendered group element
   */
  render(ctx: ShapeRenderContext): SVGGroup;
}

// Shape registry for extensibility
export const shapeRegistry = new Map<SmartShapeType, ShapeRenderer>();

export function registerShape(renderer: ShapeRenderer): void {
  shapeRegistry.set(renderer.type, renderer);
}
```

---

## 5. Implementation Plan

### Phase 1: Foundation (List Diagrams)

#### Step 1: Parser Setup

1. Create `packages/parser/src/language/smartshape/` directory
2. Define `smartshape.langium` grammar with:
   - Entry rule for `smartshape` keyword
   - Type declaration (`type: list-block`)
   - Direction option (`direction: TB`)
   - Title support
   - Indentation-based item hierarchy (similar to treemap)
3. Create `tokenBuilder.ts` with keywords: `['smartshape', 'type', 'direction', 'title']`
4. Create `valueConverter.ts` for indentation handling
5. Register in `langium-config.json`
6. Run `pnpm --filter @mermaid-js/parser langium:generate`

#### Step 2: Diagram Skeleton

1. Create `packages/mermaid/src/diagrams/smartshape/` directory
2. Implement core files:
   - `detector.ts` - detect `/^\s*smartshape/`
   - `smartshapeDb.ts` - state management for items and config
   - `smartshapeParser.ts` - parse AST → populate DB
   - `smartshapeTypes.ts` - TypeScript interfaces
   - `smartshapeDiagram.ts` - bundle all parts
   - `smartshapeStyles.ts` - base CSS styles
3. Register in `diagram-orchestration.ts`

#### Step 3: Base Renderer Architecture

1. Create `smartshapeRenderer.ts` with:
   - Shape registry lookup
   - Dimension calculation
   - SVG setup and viewport configuration
   - Delegation to shape-specific renderers
2. Create `shapes/baseShape.ts` abstract interface
3. Create `shapes/index.ts` registry

#### Step 4: Implement Shape Renderers

1. `list-bullet` - Simplest shape (header bars + plain bullets)
2. `list-block` - Two-column layout (label + detail)
3. `list-chevron` - Vertical chevrons with overlapping
4. `list-pyramid` - Triangle with text boxes

#### Step 5: Testing

1. Unit tests for parser (grammar validation)
2. Unit tests for DB (state management)
3. Cypress E2E tests with visual snapshots
4. Test dynamic resizing behavior

#### Step 6: Documentation

1. Add docs to `packages/mermaid/src/docs/syntax/smartshape.md`
2. Include examples for each shape type
3. Document configuration options

---

## 6. Langium Grammar

```langium
grammar SmartShape

fragment TitleAndAccessibilities:
  ((accDescr=ACC_DESCR | accTitle=ACC_TITLE | title=TITLE))+
;

terminal ACC_DESCR: /[\t ]*accDescr(?:[\t ]*:([^\n\r]*?(?=%%)|[^\n\r]*)|\s*{([^}]*)})/;
terminal ACC_TITLE: /[\t ]*accTitle[\t ]*:(?:[^\n\r]*?(?=%%)|[^\n\r]*)/;
terminal TITLE: /[\t ]*title(?:[\t ][^\n\r]*?(?=%%)|[\t ][^\n\r]*|)/;

interface SmartShapeItem {
  text: string
  classSelector?: string
}

interface SmartShape {
  shapeType?: string
  direction?: string
  title?: string
  accTitle?: string
  accDescr?: string
  rows: SmartShapeRow[]
}

entry SmartShape returns SmartShape:
  SMARTSHAPE_KEYWORD
  (
    TitleAndAccessibilities
    | TypeDeclaration
    | DirectionDeclaration
    | rows+=SmartShapeRow
  )*
;

TypeDeclaration:
  'type' ':' shapeType=SHAPE_TYPE
;

DirectionDeclaration:
  'direction' ':' direction=DIRECTION
;

SmartShapeRow:
  indent=INDENTATION? item=SmartShapeItem
;

SmartShapeItem returns SmartShapeItem:
  text=ITEM_TEXT (STYLE_SEPARATOR classSelector=ID)?
;

terminal SMARTSHAPE_KEYWORD: 'smartshape';
terminal SHAPE_TYPE: /list-[a-z]+/;
terminal DIRECTION: 'TB' | 'LR' | 'BT' | 'RL';
terminal ITEM_TEXT: /[^\n\r:]+/;
terminal STYLE_SEPARATOR: ':::';
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal INDENTATION: /[\t ]+/;

hidden terminal WS: /[ \t]+/;
hidden terminal ML_COMMENT: /\%\%[^\n]*/;
hidden terminal NL: /\r?\n/;
```

---

## 7. Files to Create/Modify

### New Files

```
packages/parser/src/language/smartshape/
├── smartshape.langium
├── module.ts
├── tokenBuilder.ts
├── valueConverter.ts
└── index.ts

packages/mermaid/src/diagrams/smartshape/
├── detector.ts
├── smartshapeDiagram.ts
├── smartshapeDb.ts
├── smartshapeParser.ts
├── smartshapeRenderer.ts
├── smartshapeStyles.ts
├── smartshapeTypes.ts
├── shapes/
│   ├── index.ts
│   ├── baseShape.ts
│   ├── listBlock.ts
│   ├── listBullet.ts
│   ├── listChevron.ts
│   └── listPyramid.ts
└── __tests__/
    └── smartshape.spec.ts

packages/mermaid/src/docs/syntax/smartshape.md

cypress/integration/rendering/smartshape.spec.ts
```

### Files to Modify

```
packages/parser/langium-config.json                    # Add smartshape language
packages/parser/src/language/index.ts                  # Export smartshape
packages/parser/src/parse.ts                           # Add smartshape parser
packages/mermaid/src/diagram-api/diagram-orchestration.ts  # Register diagram
packages/mermaid/src/defaultConfig.ts                  # Add smartshape config
packages/mermaid/src/config.type.ts                    # Add SmartShapeConfig type
```

---

## 8. Testing Strategy

### 8.1 Unit Tests

- Grammar parsing (valid/invalid syntax)
- DB state transitions
- Dimension calculations
- Item hierarchy building

### 8.2 Integration Tests (Cypress)

- Visual snapshot for each shape type
- Dynamic resizing (1, 2, 3, 4 items)
- Sub-item rendering
- Theme variations

### 8.3 Edge Cases

- Empty diagram
- Single item
- Deep nesting (3+ levels)
- Very long text
- Special characters in text

---

## 9. Shape Comparison Summary

| Shape            | Layout           | Label Position   | Sub-items                | Key Feature              |
| ---------------- | ---------------- | ---------------- | ------------------------ | ------------------------ |
| **list-block**   | Two columns      | Left block       | Right box with bullets   | Side-by-side layout      |
| **list-bullet**  | Vertical stack   | Header bar       | Plain bullets below      | Simplest, no containers  |
| **list-chevron** | Two columns      | In chevron shape | Right box with bullets   | Overlapping arrow shapes |
| **list-pyramid** | Triangle + boxes | In pyramid bands | Right boxes with bullets | Pyramid background       |

---

## 10. Code Sharing Analysis

### Shared Across All SmartShape Types (70%+)

- Parser/Grammar - Same indentation-based item syntax
- DB State Management - Items[], config, title
- Detector - Single `smartshape` keyword
- Base Renderer Setup - SVG selection, viewport config
- Text Measurement - Existing `createText.ts` utilities
- Theme Integration - Common color/style variables
- Accessibility - accTitle, accDescription

### Shape-Specific Code Required

- SVG path generation (each shape draws differently)
- Layout algorithms (two-column vs stacked vs pyramid)
- Dimension calculations (shape-specific sizing rules)

---

## 11. Resolved Questions

| Question       | Decision                                            |
| -------------- | --------------------------------------------------- |
| Shape priority | list-block, list-bullet, list-chevron, list-pyramid |
| Keyword        | `smartshape` (no beta suffix)                       |
| Syntax style   | Indentation-based (like treemap)                    |
| Visual specs   | Captured from PowerPoint SmartArt screenshots       |

# SmartShape Diagram - LibreOffice Layout Engine Port

**Issue:** [#2494 - Implement "PowerPoint SmartArt"](https://github.com/mermaid-js/mermaid/issues/2494)
**Branch:** `feature/2494_smartart-diagrams-libre`
**Approach:** Port LibreOffice SmartArt layout algorithms to TypeScript

---

## 1. Overview

### 1.1 Problem Statement

Users want PowerPoint SmartArt-like diagrams in Mermaid that dynamically resize and adapt based on input data. The OOXML SmartArt specification is documented but complex; the layout engine is not open-source. LibreOffice has the most complete open-source implementation.

### 1.2 Solution

Port LibreOffice's SmartArt layout algorithms (C++) to TypeScript, creating reusable layout engines that integrate with Mermaid's existing layout plugin architecture.

### 1.3 Design Principles

1. **Algorithm-First** - Port proven layout algorithms from LibreOffice
2. **Plugin Architecture** - Integrate as layout engines using Mermaid's `registerLayoutLoaders` pattern
3. **Full Port** - Implement all 6 core algorithms before release
4. **Simple Syntax** - Keep indentation-based syntax (like treemap)

---

## 2. Layout Algorithms to Port

| Algorithm     | LibreOffice Class | Purpose                  | Use Cases              |
| ------------- | ----------------- | ------------------------ | ---------------------- |
| **Linear**    | `LinearAlg`       | Horizontal/vertical flow | Lists, Process         |
| **Cycle**     | `CycleAlg`        | Circular arrangement     | PDCA, Lifecycles       |
| **Snake**     | `SnakeAlg`        | 2D wrapping path         | Grid layouts           |
| **Pyramid**   | `PyraAlg`         | Triangular stacking      | Hierarchies            |
| **Composite** | `CompositeAlg`    | Constraint positioning   | Matrix, Venn           |
| **Hierarchy** | `HierarchyAlg`    | Tree/org chart           | Org charts (via Dagre) |

---

## 3. Architecture

### 3.1 Integration Pattern

Mermaid uses a plugin-based layout loader pattern:

```typescript
// Registration
mermaid.registerLayoutLoaders([
  { name: 'smartshape-linear', loader: () => import('./layouts/linear.js') },
  { name: 'smartshape-cycle', loader: () => import('./layouts/cycle.js') },
  // ...
]);

// Layout Algorithm Interface
interface LayoutAlgorithm {
  render(
    layoutData: LayoutData,
    svg: SVG,
    helpers: InternalHelpers,
    options?: RenderOptions
  ): Promise<void>;
}
```

### 3.2 Package Structure

```
packages/mermaid/src/diagrams/smartshape/
├── detector.ts              # Diagram type detection
├── smartshapeDiagram.ts     # Main diagram definition
├── smartshapeDb.ts          # State management
├── smartshapeParser.ts      # Langium parser integration
├── smartshapeRenderer.ts    # Renderer (delegates to layouts)
├── smartshapeStyles.ts      # CSS styles
├── smartshapeTypes.ts       # TypeScript interfaces
├── layouts/                 # Ported LibreOffice algorithms
│   ├── index.ts             # Layout registry
│   ├── types.ts             # Shared layout types
│   ├── linear.ts            # LinearAlg port
│   ├── cycle.ts             # CycleAlg port
│   ├── snake.ts             # SnakeAlg port
│   ├── pyramid.ts           # PyraAlg port
│   ├── composite.ts         # CompositeAlg port (Matrix/Venn)
│   └── hierarchy.ts         # HierarchyAlg (Dagre wrapper)
├── shapes/                  # SVG shape primitives
│   ├── index.ts
│   ├── rect.ts
│   ├── ellipse.ts
│   ├── chevron.ts
│   ├── trapezoid.ts
│   └── connectors.ts
└── __tests__/
    ├── layouts/
    └── smartshape.spec.ts

packages/parser/src/language/smartshape/
├── smartshape.langium
├── module.ts
├── tokenBuilder.ts
├── valueConverter.ts
└── index.ts
```

### 3.3 Core Interfaces

```typescript
// Data Model
interface SmartShapeNode {
  id: string;
  label: string;
  level: number;
  children?: string[];
}

interface SmartShapeConfig {
  type: DiagramType;
  direction: 'LR' | 'RL' | 'TB' | 'BT';
  title?: string;
}

type DiagramType =
  | 'list'
  | 'process'
  | 'cycle'
  | 'hierarchy'
  | 'relationship'
  | 'matrix'
  | 'pyramid';

// Layout Algorithm Interface
interface LayoutAlgorithm {
  name: string;
  layout(nodes: SmartShapeNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[];
  getConnectors?(nodes: PositionedNode[], edges: SmartShapeEdge[]): ConnectorPath[];
}

interface PositionedNode extends SmartShapeNode {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: ShapeType;
  rotation?: number;
}
```

---

## 4. Syntax Specification

### 4.1 Basic Syntax (Indentation-based)

```
smartshape
    type: list
    "Item One"
        "Sub-item A"
        "Sub-item B"
    "Item Two"
    "Item Three"
```

### 4.2 Supported Types

| Type           | Layout Algorithm    | Visual Style         |
| -------------- | ------------------- | -------------------- |
| `list`         | Linear (vertical)   | Stacked blocks       |
| `process`      | Linear (horizontal) | Arrow flow           |
| `cycle`        | Cycle               | Circular arrangement |
| `hierarchy`    | Hierarchy (Dagre)   | Org chart tree       |
| `relationship` | Composite (Venn)    | Overlapping circles  |
| `matrix`       | Composite (Matrix)  | 2x2 grid             |
| `pyramid`      | Pyramid             | Triangular stack     |

### 4.3 Configuration Options

```
smartshape
    type: process
    direction: LR
    title: "My Process"
    "Step 1"
    "Step 2"
    "Step 3"
```

---

## 5. Implementation Plan

### Phase 1: Foundation

1. Create new branch from upstream/develop
2. Set up parser (Langium grammar, tokenBuilder, valueConverter)
3. Create diagram skeleton (detector, db, types, diagram definition)
4. Register diagram in orchestration

### Phase 2: Layout Engine Core

1. Create `layouts/types.ts` with shared interfaces
2. Implement `LinearAlgorithm` (simplest, validates architecture)
3. Implement `CycleAlgorithm`
4. Create shape primitives (rect, ellipse)

### Phase 3: Complete Algorithms

1. Implement `SnakeAlgorithm`
2. Implement `PyramidAlgorithm`
3. Implement `CompositeAlgorithm` (Matrix + Venn)
4. Implement `HierarchyAlgorithm` (Dagre wrapper)

### Phase 4: Shapes & Connectors

1. Add chevron, trapezoid shapes
2. Implement connector/arrow routing
3. Style integration with Mermaid themes

### Phase 5: Testing & Documentation

1. Unit tests for each algorithm
2. Cypress visual regression tests
3. Documentation with examples

---

## 6. LibreOffice Source References

**Repository:** https://github.com/LibreOffice/core

**Key Files:**

- `oox/source/drawingml/diagram/diagramlayoutatoms.cxx` - Algorithm implementations
- `oox/source/drawingml/diagram/diagramlayoutatoms.hxx` - Class definitions
- `oox/source/drawingml/diagram/layoutatomvisitorbase.hxx` - Visitor pattern

**Key Classes:**

- `AlgAtom` - Base algorithm handler
- `LinearAlg` - Horizontal/vertical flow
- `CycleAlg` - Circular arrangement
- `SnakeAlg` - 2D wrapping path
- `PyraAlg` - Pyramid stacking
- `CompositeAlg` - Constraint positioning
- `HierarchyAlg` - Org chart trees

---

## 7. Algorithm Specifications

### 7.1 Linear Algorithm (List/Process)

**Purpose**: Arrange nodes in a line (horizontal or vertical)

**LibreOffice Reference**: `LinearAlg` in diagramlayoutatoms.cxx

**Parameters**:

- `linDir`: Direction (`fromL`, `fromR`, `fromT`, `fromB`)
- `nodeHorzAlign`: Horizontal alignment (`l`, `ctr`, `r`)
- `nodeVertAlign`: Vertical alignment (`t`, `mid`, `b`)

**TypeScript Implementation**:

```typescript
class LinearAlgorithm implements LayoutAlgorithm {
  name = 'linear';

  layout(nodes: SmartShapeNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    const count = nodes.length;
    const isHorizontal = config.direction === 'LR' || config.direction === 'RL';
    const reverse = config.direction === 'RL' || config.direction === 'BT';

    const nodeWidth = isHorizontal
      ? (bounds.width - (count - 1) * config.spacing) / count
      : bounds.width;
    const nodeHeight = isHorizontal
      ? bounds.height
      : (bounds.height - (count - 1) * config.spacing) / count;

    return nodes.map((node, index) => {
      const i = reverse ? count - 1 - index : index;
      return {
        ...node,
        x: isHorizontal ? i * (nodeWidth + config.spacing) : 0,
        y: isHorizontal ? 0 : i * (nodeHeight + config.spacing),
        width: nodeWidth,
        height: nodeHeight,
        shape: 'rect',
      };
    });
  }
}
```

### 7.2 Cycle Algorithm

**Purpose**: Arrange nodes in a circle

**LibreOffice Reference**: `CycleAlg` in diagramlayoutatoms.cxx

**Parameters**:

- `stAng`: Start angle (degrees, default 0)
- `spanAng`: Span angle (degrees, default 360)

**TypeScript Implementation**:

```typescript
class CycleAlgorithm implements LayoutAlgorithm {
  name = 'cycle';

  layout(nodes: SmartShapeNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    const count = nodes.length;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    // Node size is 1/5 of container (from LibreOffice)
    const nodeSize = Math.min(bounds.width, bounds.height) / 5;
    const radius = Math.min((bounds.width - nodeSize) / 2, (bounds.height - nodeSize) / 2);

    const startAngle = config.startAngle ?? 0;
    const spanAngle = config.spanAngle ?? 360;
    const angleStep = spanAngle / count;

    return nodes.map((node, index) => {
      const angleDeg = startAngle + index * angleStep;
      const angleRad = ((angleDeg - 90) * Math.PI) / 180;

      return {
        ...node,
        x: centerX + radius * Math.cos(angleRad) - nodeSize / 2,
        y: centerY + radius * Math.sin(angleRad) - nodeSize / 2,
        width: nodeSize,
        height: nodeSize,
        shape: 'ellipse',
        rotation: angleDeg,
      };
    });
  }
}
```

### 7.3 Snake Algorithm

**Purpose**: Arrange nodes in a 2D wrapping path (like reading order)

**LibreOffice Reference**: `SnakeAlg`

**TypeScript Implementation**:

```typescript
class SnakeAlgorithm implements LayoutAlgorithm {
  name = 'snake';

  layout(nodes: SmartShapeNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    const cols = config.columns ?? Math.ceil(Math.sqrt(nodes.length));
    const rows = Math.ceil(nodes.length / cols);

    const nodeWidth = (bounds.width - (cols - 1) * config.spacing) / cols;
    const nodeHeight = (bounds.height - (rows - 1) * config.spacing) / rows;

    return nodes.map((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const actualCol = row % 2 === 0 ? col : cols - 1 - col;

      return {
        ...node,
        x: actualCol * (nodeWidth + config.spacing),
        y: row * (nodeHeight + config.spacing),
        width: nodeWidth,
        height: nodeHeight,
        shape: 'rect',
      };
    });
  }
}
```

### 7.4 Pyramid Algorithm

**Purpose**: Stack nodes in a triangular shape

**LibreOffice Reference**: `PyraAlg` in diagramlayoutatoms.cxx

**TypeScript Implementation**:

```typescript
class PyramidAlgorithm implements LayoutAlgorithm {
  name = 'pyramid';

  layout(nodes: SmartShapeNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    const count = nodes.length;
    const rowHeight = bounds.height / count;

    return nodes.map((node, index) => {
      const widthRatio = (index + 1) / count;
      const nodeWidth = bounds.width * widthRatio;

      return {
        ...node,
        x: (bounds.width - nodeWidth) / 2,
        y: index * rowHeight,
        width: nodeWidth,
        height: rowHeight - config.spacing,
        shape: 'trapezoid',
      };
    });
  }
}
```

### 7.5 Composite Algorithm (Matrix/Venn)

**Purpose**: Position nodes using explicit constraints

**LibreOffice Reference**: `CompositeAlg` in diagramlayoutatoms.cxx

**TypeScript Implementation**:

```typescript
class CompositeAlgorithm implements LayoutAlgorithm {
  name = 'composite';

  layout(nodes: SmartShapeNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    if (config.subType === 'matrix') {
      return this.layoutMatrix(nodes, bounds, config);
    }
    if (config.subType === 'venn') {
      return this.layoutVenn(nodes, bounds, config);
    }
    return [];
  }

  private layoutMatrix(
    nodes: SmartShapeNode[],
    bounds: Bounds,
    config: LayoutConfig
  ): PositionedNode[] {
    const positions = [
      { x: 0.01, y: 0.01 },
      { x: 0.51, y: 0.01 },
      { x: 0.01, y: 0.51 },
      { x: 0.51, y: 0.51 },
    ];

    const nodeWidth = bounds.width * 0.48;
    const nodeHeight = bounds.height * 0.48;

    return nodes.slice(0, 4).map((node, index) => ({
      ...node,
      x: bounds.width * positions[index].x,
      y: bounds.height * positions[index].y,
      width: nodeWidth,
      height: nodeHeight,
      shape: 'rect',
    }));
  }

  private layoutVenn(
    nodes: SmartShapeNode[],
    bounds: Bounds,
    config: LayoutConfig
  ): PositionedNode[] {
    const count = Math.min(nodes.length, 4);
    const size = Math.min(bounds.width, bounds.height);

    const layouts = {
      1: [{ cx: 0.5, cy: 0.5 }],
      2: [
        { cx: 0.35, cy: 0.5 },
        { cx: 0.65, cy: 0.5 },
      ],
      3: [
        { cx: 0.5, cy: 0.35 },
        { cx: 0.3, cy: 0.65 },
        { cx: 0.7, cy: 0.65 },
      ],
      4: [
        { cx: 0.35, cy: 0.35 },
        { cx: 0.65, cy: 0.35 },
        { cx: 0.35, cy: 0.65 },
        { cx: 0.65, cy: 0.65 },
      ],
    };

    const circleSize = size * (count === 1 ? 0.6 : 0.4);
    const positions = layouts[count];

    return nodes.slice(0, count).map((node, index) => ({
      ...node,
      x: bounds.width * positions[index].cx - circleSize / 2,
      y: bounds.height * positions[index].cy - circleSize / 2,
      width: circleSize,
      height: circleSize,
      shape: 'ellipse',
    }));
  }
}
```

---

## 8. Files to Create/Modify

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
├── layouts/
│   ├── index.ts
│   ├── types.ts
│   ├── linear.ts
│   ├── cycle.ts
│   ├── snake.ts
│   ├── pyramid.ts
│   ├── composite.ts
│   └── hierarchy.ts
├── shapes/
│   ├── index.ts
│   ├── rect.ts
│   ├── ellipse.ts
│   ├── chevron.ts
│   ├── trapezoid.ts
│   └── connectors.ts
└── __tests__/
    └── smartshape.spec.ts
```

### Files to Modify

```
packages/parser/langium-config.json
packages/parser/src/language/index.ts
packages/parser/src/parse.ts
packages/mermaid/src/diagram-api/diagram-orchestration.ts
```

---

## 9. Shape Types

| Shape       | SVG Element       | Use Case                |
| ----------- | ----------------- | ----------------------- |
| `rect`      | `<rect>`          | List, Matrix, Hierarchy |
| `roundRect` | `<rect rx="...">` | Soft lists              |
| `ellipse`   | `<ellipse>`       | Cycle, Venn             |
| `chevron`   | `<polygon>`       | Process arrows          |
| `trapezoid` | `<polygon>`       | Pyramid                 |
| `diamond`   | `<polygon>`       | Decision points         |
| `hexagon`   | `<polygon>`       | Special nodes           |

---

## 10. Color Schemes

```typescript
const colorSchemes = {
  colorful: ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47'],
  accent1: ['#4472C4', '#6B8DC9', '#92A9CE', '#B9C4D3'],
  accent2: ['#ED7D31', '#F19B5C', '#F5B987', '#F9D7B2'],
  monochrome: ['#333333', '#666666', '#999999', '#CCCCCC'],
};
```

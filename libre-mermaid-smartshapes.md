# Libre-Mermaid SmartShapes

## Design Document: Porting SmartArt Layout Algorithms to Mermaid.js

**Version:** 1.0
**Date:** 2024-11-27
**Status:** Draft

---

## Executive Summary

This document proposes porting the SmartArt diagram layout algorithms from LibreOffice's open-source implementation to Mermaid.js, creating a new diagram type called "SmartShapes." This would bring PowerPoint-style automatic diagram layouts (lists, processes, cycles, hierarchies, matrices, pyramids, and Venn diagrams) to the Mermaid ecosystem, enabling text-based creation of professionally-styled business diagrams.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Background Research](#background-research)
3. [Design Goals](#design-goals)
4. [Technical Architecture](#technical-architecture)
5. [Algorithm Specifications](#algorithm-specifications)
6. [Mermaid Integration](#mermaid-integration)
7. [Proposed Syntax](#proposed-syntax)
8. [Implementation Roadmap](#implementation-roadmap)
9. [References](#references)

---

## Problem Statement

### Current State

- **Microsoft SmartArt** provides automatic layout of business diagrams but is proprietary and only available in Office applications
- **Mermaid.js** excels at flowcharts, sequence diagrams, and ERDs but lacks SmartArt-style automatic layouts
- **OOXML SmartArt** specification is documented but complex; the layout engine is not open-source
- Users wanting SmartArt-style diagrams in documentation, wikis, or web apps have no text-based solution

### Desired State

- Text-based syntax for creating SmartArt-style diagrams
- Automatic layout algorithms that adapt to content (1-N items)
- Integration with Mermaid.js ecosystem (themes, rendering, tooling)
- Open-source implementation enabling community contributions

### Gap Analysis

| Capability           | PowerPoint SmartArt | Mermaid.js          | Proposed Solution |
| -------------------- | ------------------- | ------------------- | ----------------- |
| List layouts         | Yes                 | No                  | Yes               |
| Process flows        | Yes                 | Partial (flowchart) | Yes (auto-layout) |
| Cycle diagrams       | Yes                 | No                  | Yes               |
| Hierarchy/Org charts | Yes                 | No                  | Yes (via Dagre)   |
| Venn diagrams        | Yes                 | No                  | Yes               |
| Matrix layouts       | Yes                 | No                  | Yes               |
| Pyramid layouts      | Yes                 | No                  | Yes               |
| Text-based input     | No                  | Yes                 | Yes               |
| Open source          | No                  | Yes                 | Yes               |

---

## Background Research

### OOXML SmartArt Specification

SmartArt diagrams in Office Open XML (OOXML) are defined using DrawingML in the namespace:

```
xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"
```

#### File Structure in .pptx/.docx

```
/ppt/diagrams/
├── data1.xml        # Node data and connections (dgm:dataModel)
├── layout1.xml      # Layout algorithm definition (dgm:layoutDef)
├── colors1.xml      # Color scheme (dgm:colorsDef)
├── quickStyle1.xml  # Style definitions (dgm:styleDef)
└── drawing1.xml     # Cached rendering (Microsoft extension)
```

#### Key XML Elements

```xml
<!-- Data Model -->
<dgm:dataModel>
  <dgm:ptLst>
    <dgm:pt modelId="{GUID}" type="doc|node">
      <dgm:t><a:p><a:r><a:t>Text</a:t></a:r></a:p></dgm:t>
    </dgm:pt>
  </dgm:ptLst>
  <dgm:cxnLst>
    <dgm:cxn srcId="{GUID}" destId="{GUID}" srcOrd="0" destOrd="0"/>
  </dgm:cxnLst>
</dgm:dataModel>

<!-- Layout Definition -->
<dgm:layoutDef>
  <dgm:layoutNode name="diagram">
    <dgm:alg type="lin|cycle|hierRoot|pyra|composite">
      <dgm:param type="linDir" val="fromL|fromT|fromR|fromB"/>
    </dgm:alg>
    <dgm:constrLst>
      <dgm:constr type="w|h|l|t|primFontSz" refType="w" fact="0.5"/>
    </dgm:constrLst>
    <dgm:forEach axis="ch" ptType="node">
      <dgm:layoutNode name="node">
        <dgm:shape type="rect|ellipse|chevron|trapezoid"/>
      </dgm:layoutNode>
    </dgm:forEach>
  </dgm:layoutNode>
</dgm:layoutDef>
```

#### Built-in Layout URNs

Microsoft registers layout types using URNs:

- `urn:microsoft.com/office/officeart/2005/8/layout/vList2` (Vertical Block List)
- `urn:microsoft.com/office/officeart/2005/8/layout/process1` (Basic Process)
- `urn:microsoft.com/office/officeart/2005/8/layout/cycle1` (Basic Cycle)
- `urn:microsoft.com/office/officeart/2005/8/layout/orgChart1` (Organization Chart)
- `urn:microsoft.com/office/officeart/2005/8/layout/venn1` (Basic Venn)
- `urn:microsoft.com/office/officeart/2005/8/layout/matrix1` (Basic Matrix)
- `urn:microsoft.com/office/officeart/2005/8/layout/pyramid1` (Basic Pyramid)

### LibreOffice Implementation

LibreOffice has the most complete open-source implementation of SmartArt layout algorithms.

#### Source Code Location

```
libreoffice/core/oox/source/drawingml/diagram/
├── diagramlayoutatoms.cxx    # Layout algorithm implementations
├── diagramlayoutatoms.hxx    # Algorithm class definitions
├── layoutatomvisitorbase.hxx # Visitor pattern for traversal
├── diagram.cxx               # Main diagram processing
├── datamodel.hxx             # Data structure definitions
└── constraintlistcontext.cxx # Constraint parsing
```

#### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Diagram Import Pipeline                   │
├─────────────────────────────────────────────────────────────┤
│  XML Parsing    →    Data Model    →    Layout    →   SVG   │
│                                                              │
│  ┌───────────┐    ┌─────────────┐    ┌─────────┐   ┌─────┐ │
│  │ OOX Files │ →  │ LayoutAtom  │ →  │ AlgAtom │ → │Shape│ │
│  │ data.xml  │    │ Tree        │    │ Layout  │   │ Gen │ │
│  │ layout.xml│    │             │    │ Shape() │   │     │ │
│  └───────────┘    └─────────────┘    └─────────┘   └─────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Key Classes

| Class                   | Purpose                  | Source File                |
| ----------------------- | ------------------------ | -------------------------- |
| `AlgAtom`               | Base algorithm handler   | diagramlayoutatoms.cxx:170 |
| `CompositeAlg`          | Absolute positioning     | diagramlayoutatoms.cxx     |
| `LinearAlg`             | Horizontal/vertical flow | diagramlayoutatoms.cxx     |
| `SnakeAlg`              | 2D wrapping path         | diagramlayoutatoms.cxx     |
| `CycleAlg`              | Circular arrangement     | diagramlayoutatoms.cxx     |
| `PyraAlg`               | Pyramid stacking         | diagramlayoutatoms.cxx     |
| `HierarchyAlg`          | Org chart trees          | diagramlayoutatoms.cxx     |
| `ConnectorAlg`          | Arrow routing            | diagramlayoutatoms.cxx     |
| `ConstraintAtom`        | Constraint solver        | diagramlayoutatoms.cxx     |
| `ShapeCreationVisitor`  | Shape instantiation      | layoutatomvisitors.cxx     |
| `ShapeLayoutingVisitor` | Position calculation     | layoutatomvisitors.cxx     |

#### AlgAtom Interface

```cpp
class AlgAtom : public LayoutAtom {
public:
    AlgAtom(LayoutNode& rLayoutNode);
    void accept(LayoutAtomVisitor& rVisitor) override;
    void setType(sal_Int32 nToken);           // XML_lin, XML_cycle, etc.
    void addParam(sal_Int32 nKey, sal_Int32 nVal);
    void layoutShape(const ShapePtr& rShape,
                     const Constraints& rConstraints,
                     const Rules& rRules);
    sal_Int32 getVerticalShapesCount(const ShapePtr& rShape);
    void setAspectRatio(double fAspectRatio);
    double getAspectRatio() const;

private:
    sal_Int32 mnType;           // Algorithm type token
    ParamMap maMap;             // Parameters: map<int, int>
    double mfAspectRatio;       // Aspect ratio constraint
    sal_Int32 getConnectorType(); // For connector algorithm
};
```

### Mermaid.js Architecture

#### DiagramDefinition Interface

```typescript
interface DiagramDefinition {
  db: DiagramDB; // State and data access
  parser: ParserDefinition; // Text → data model
  renderer: DiagramRenderer; // Data → SVG
  styles?: DiagramStylesProvider; // CSS styling
  init?: () => void; // Initialization hook
  injectUtils?: (utils) => void; // External diagram compat
}
```

#### Registration Process

```typescript
// Internal registration (built-in diagrams)
registerDiagram('smartshapes', diagramDefinition, detector);

// External registration (plugins)
mermaid.registerExternalDiagrams(
  [
    {
      id: 'smartshapes',
      detector: (text) => text.match(/^\s*smartshapes/),
      loader: () => import('./smartshapes'),
    },
  ],
  { lazyLoad: true }
);
```

#### Layout Engines Available

| Engine       | Use Case               | Integration      |
| ------------ | ---------------------- | ---------------- |
| **Dagre**    | Default graph layout   | Built-in         |
| **ELK**      | Complex hierarchical   | Optional package |
| **D3-force** | Force-directed         | Available        |
| **Custom**   | SmartShapes algorithms | To implement     |

---

## Design Goals

### Primary Goals

1. **Faithful Layout Reproduction**: Implement layout algorithms that produce visually similar results to PowerPoint SmartArt
2. **Mermaid Integration**: Seamless integration with Mermaid.js theming, rendering, and tooling
3. **Text-First Authoring**: Simple, intuitive syntax for defining diagram content
4. **Adaptive Layouts**: Algorithms that automatically adjust to 1-N items

### Secondary Goals

1. **Performance**: Efficient layout calculation for real-time preview
2. **Extensibility**: Architecture allowing new layout types to be added
3. **Accessibility**: Generated SVG includes proper ARIA labels
4. **Export**: Compatible with Mermaid's PNG/SVG export

### Non-Goals

1. Full OOXML SmartArt compatibility (too complex, diminishing returns)
2. Round-trip editing with PowerPoint (No external dependencies with Libre or Microsoft products!)
3. Animation support
4. 3D effects

---

## Technical Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    mermaid-smartshapes                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐   │
│  │    Parser    │   │   Database   │   │     Renderer     │   │
│  │              │   │              │   │                  │   │
│  │ - JISON/PEG  │ → │ - Nodes      │ → │ - D3.js SVG      │   │
│  │ - Tokenizer  │   │ - Edges      │   │ - Layout Engine  │   │
│  │              │   │ - Type       │   │ - Shape Library  │   │
│  └──────────────┘   └──────────────┘   └──────────────────┘   │
│          │                 │                    │              │
│          ▼                 ▼                    ▼              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   Layout Algorithms                      │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │  │
│  │  │ Linear  │ │  Cycle  │ │  Snake  │ │ Pyramid │       │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                   │  │
│  │  │Composite│ │  Venn   │ │ Matrix  │   (+ Dagre/ELK)   │  │
│  │  └─────────┘ └─────────┘ └─────────┘                   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Model

```typescript
interface SmartShapesDiagram {
  type: DiagramType;
  direction?: 'LR' | 'RL' | 'TB' | 'BT';
  nodes: SmartShapesNode[];
  edges: SmartShapesEdge[];
  config: SmartShapesConfig;
}

type DiagramType =
  | 'list'
  | 'process'
  | 'cycle'
  | 'hierarchy'
  | 'relationship' // Venn
  | 'matrix'
  | 'pyramid';

interface SmartShapesNode {
  id: string;
  label: string;
  level: number; // For hierarchy
  children?: string[]; // Child node IDs
}

interface SmartShapesEdge {
  from: string;
  to: string;
  label?: string;
}

interface SmartShapesConfig {
  shape: ShapeType;
  colorScheme: string;
  fontSize: number;
  padding: number;
}
```

### Layout Algorithm Interface

```typescript
interface LayoutAlgorithm {
  name: string;

  /**
   * Calculate positions for all nodes
   * @param nodes - Array of nodes to position
   * @param bounds - Available space (width, height)
   * @param config - Layout configuration
   * @returns Positioned nodes with x, y, width, height
   */
  layout(nodes: SmartShapesNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[];

  /**
   * Get connector paths between nodes
   */
  getConnectors?(nodes: PositionedNode[], edges: SmartShapesEdge[]): ConnectorPath[];
}

interface PositionedNode extends SmartShapesNode {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: ShapeType;
  rotation?: number; // For cycle layout
}

interface Bounds {
  width: number;
  height: number;
}

interface LayoutConfig {
  direction: 'LR' | 'RL' | 'TB' | 'BT';
  spacing: number;
  aspectRatio?: number;
  nodeSize?: { width: number; height: number };
}
```

---

## Algorithm Specifications

### 1. Linear Algorithm (List/Process)

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

  layout(nodes: SmartShapesNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    const count = nodes.length;
    const isHorizontal = config.direction === 'LR' || config.direction === 'RL';
    const reverse = config.direction === 'RL' || config.direction === 'BT';

    // Calculate node dimensions
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

  getConnectors(nodes: PositionedNode[], edges: SmartShapesEdge[]): ConnectorPath[] {
    // Generate arrows between consecutive nodes
    return nodes.slice(0, -1).map((node, i) => ({
      from: { x: node.x + node.width, y: node.y + node.height / 2 },
      to: { x: nodes[i + 1].x, y: nodes[i + 1].y + nodes[i + 1].height / 2 },
      type: 'arrow',
    }));
  }
}
```

### 2. Cycle Algorithm

**Purpose**: Arrange nodes in a circle

**LibreOffice Reference**: `CycleAlg` in diagramlayoutatoms.cxx, commit 64cd173

**Parameters**:

- `stAng`: Start angle (degrees, default 0)
- `spanAng`: Span angle (degrees, default 360)

**TypeScript Implementation**:

```typescript
class CycleAlgorithm implements LayoutAlgorithm {
  name = 'cycle';

  layout(nodes: SmartShapesNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    const count = nodes.length;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    // Node size is 1/5 of container (from LibreOffice)
    const nodeSize = Math.min(bounds.width, bounds.height) / 5;

    // Calculate radius
    const radius = Math.min((bounds.width - nodeSize) / 2, (bounds.height - nodeSize) / 2);

    const startAngle = config.startAngle ?? 0;
    const spanAngle = config.spanAngle ?? 360;
    const angleStep = spanAngle / count;

    return nodes.map((node, index) => {
      const angleDeg = startAngle + index * angleStep;
      const angleRad = ((angleDeg - 90) * Math.PI) / 180; // -90 to start at top

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

  getConnectors(nodes: PositionedNode[], edges: SmartShapesEdge[]): ConnectorPath[] {
    // Curved arrows around the circle
    return nodes.map((node, i) => {
      const next = nodes[(i + 1) % nodes.length];
      return {
        from: this.getEdgePoint(node, next),
        to: this.getEdgePoint(next, node),
        type: 'curvedArrow',
        curve: this.calculateArcCurve(node, next),
      };
    });
  }
}
```

### 3. Snake Algorithm

**Purpose**: Arrange nodes in a 2D wrapping path (like reading order)

**LibreOffice Reference**: `SnakeAlg`, GSoC 2018

**Parameters**:

- `grDir`: Growth direction
- `flowDir`: Flow direction
- `contDir`: Continue direction
- `bkpt`: Breakpoint (fixed or auto)

**TypeScript Implementation**:

```typescript
class SnakeAlgorithm implements LayoutAlgorithm {
  name = 'snake';

  layout(nodes: SmartShapesNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    const cols = config.columns ?? Math.ceil(Math.sqrt(nodes.length));
    const rows = Math.ceil(nodes.length / cols);

    const nodeWidth = (bounds.width - (cols - 1) * config.spacing) / cols;
    const nodeHeight = (bounds.height - (rows - 1) * config.spacing) / rows;

    return nodes.map((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      // Snake pattern: reverse direction on odd rows
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

### 4. Pyramid Algorithm

**Purpose**: Stack nodes in a triangular shape

**LibreOffice Reference**: `PyraAlg` in diagramlayoutatoms.cxx

**TypeScript Implementation**:

```typescript
class PyramidAlgorithm implements LayoutAlgorithm {
  name = 'pyramid';

  layout(nodes: SmartShapesNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    const count = nodes.length;
    const rowHeight = bounds.height / count;

    return nodes.map((node, index) => {
      // Width increases from top to bottom
      const widthRatio = (index + 1) / count;
      const nodeWidth = bounds.width * widthRatio;

      return {
        ...node,
        x: (bounds.width - nodeWidth) / 2, // Center horizontally
        y: index * rowHeight,
        width: nodeWidth,
        height: rowHeight - config.spacing,
        shape: 'trapezoid',
      };
    });
  }
}
```

### 5. Composite Algorithm (Matrix/Venn)

**Purpose**: Position nodes using explicit constraints

**LibreOffice Reference**: `CompositeAlg` in diagramlayoutatoms.cxx

**TypeScript Implementation**:

```typescript
class CompositeAlgorithm implements LayoutAlgorithm {
  name = 'composite';

  layout(nodes: SmartShapesNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    // For matrix: 2x2 grid
    if (config.subType === 'matrix') {
      return this.layoutMatrix(nodes, bounds, config);
    }
    // For Venn: overlapping circles
    if (config.subType === 'venn') {
      return this.layoutVenn(nodes, bounds, config);
    }
    return [];
  }

  private layoutMatrix(
    nodes: SmartShapesNode[],
    bounds: Bounds,
    config: LayoutConfig
  ): PositionedNode[] {
    const positions = [
      { x: 0.01, y: 0.01 }, // Top-left
      { x: 0.51, y: 0.01 }, // Top-right
      { x: 0.01, y: 0.51 }, // Bottom-left
      { x: 0.51, y: 0.51 }, // Bottom-right
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
    nodes: SmartShapesNode[],
    bounds: Bounds,
    config: LayoutConfig
  ): PositionedNode[] {
    const count = Math.min(nodes.length, 4);
    const size = Math.min(bounds.width, bounds.height);

    // Venn circle positions based on count
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

### 6. Hierarchy Algorithm

**Purpose**: Tree/org chart layout

**Recommendation**: Use Dagre or ELK for this, as they already implement sophisticated tree layout algorithms.

```typescript
class HierarchyAlgorithm implements LayoutAlgorithm {
  name = 'hierarchy';

  layout(nodes: SmartShapesNode[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    // Delegate to Dagre
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: config.direction === 'TB' ? 'TB' : 'LR' });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
      g.setNode(node.id, { label: node.label, width: 150, height: 50 });
    });

    // Add edges from parent-child relationships
    nodes.forEach((node) => {
      node.children?.forEach((childId) => {
        g.setEdge(node.id, childId);
      });
    });

    dagre.layout(g);

    return nodes.map((node) => {
      const dagreNode = g.node(node.id);
      return {
        ...node,
        x: dagreNode.x - dagreNode.width / 2,
        y: dagreNode.y - dagreNode.height / 2,
        width: dagreNode.width,
        height: dagreNode.height,
        shape: 'rect',
      };
    });
  }
}
```

---

## Mermaid Integration

### Package Structure

```
mermaid-smartshapes/
├── src/
│   ├── index.ts              # Entry point, registration
│   ├── detector.ts           # Diagram type detection
│   ├── parser/
│   │   ├── smartshapes.jison # Grammar definition
│   │   └── parser.ts         # Parser wrapper
│   ├── db/
│   │   └── smartshapesDb.ts  # Database/state
│   ├── renderer/
│   │   ├── renderer.ts       # Main renderer
│   │   ├── shapes.ts         # Shape drawing (D3)
│   │   └── connectors.ts     # Arrow/connector drawing
│   ├── layouts/
│   │   ├── index.ts          # Layout registry
│   │   ├── linear.ts         # Linear algorithm
│   │   ├── cycle.ts          # Cycle algorithm
│   │   ├── snake.ts          # Snake algorithm
│   │   ├── pyramid.ts        # Pyramid algorithm
│   │   ├── composite.ts      # Matrix/Venn
│   │   └── hierarchy.ts      # Dagre wrapper
│   └── styles/
│       └── styles.ts         # CSS generation
├── tests/
│   ├── layouts/
│   └── integration/
├── package.json
├── tsconfig.json
└── README.md
```

### Registration Code

```typescript
// src/index.ts
import type { DiagramDefinition, DiagramDetector } from 'mermaid';
import { parser } from './parser/parser';
import { db } from './db/smartshapesDb';
import { renderer } from './renderer/renderer';
import { styles } from './styles/styles';

const detector: DiagramDetector = (text: string): boolean => {
  return /^\s*smartshapes/.test(text);
};

const definition: DiagramDefinition = {
  db,
  parser,
  renderer,
  styles,
  init: () => {
    // Initialize layout algorithms
  },
};

export const smartshapes = {
  id: 'smartshapes',
  detector,
  loader: async () => definition,
};

// For direct registration
export { definition, detector };
```

### Integration with Mermaid

```typescript
// Usage in application
import mermaid from 'mermaid';
import { smartshapes } from 'mermaid-smartshapes';

await mermaid.registerExternalDiagrams([smartshapes]);

mermaid.initialize({ startOnLoad: true });
```

---

## Proposed Syntax

### Basic Structure

```
smartshapes-[direction]
    type: [diagram-type]
    [node definitions]
```

### Examples

#### List (Vertical)

```
smartshapes-TB
    type: list
    Planning Phase
    Development Phase
    Testing Phase
    Deployment Phase
```

#### Process (Horizontal with Arrows)

```
smartshapes-LR
    type: process
    Idea --> Research --> Design --> Build --> Launch
```

#### Cycle

```
smartshapes
    type: cycle
    Plan
    Do
    Check
    Act
```

#### Hierarchy/Org Chart

```
smartshapes-TB
    type: hierarchy
    CEO
        VP Engineering
            Dev Team Lead
            QA Team Lead
        VP Marketing
            Brand Manager
            Content Lead
```

#### Venn Diagram

```
smartshapes
    type: relationship
    Design
    Engineering
    Business
```

#### Matrix

```
smartshapes
    type: matrix
    Urgent & Important
    Not Urgent & Important
    Urgent & Not Important
    Not Urgent & Not Important
```

#### Pyramid

```
smartshapes
    type: pyramid
    Strategy
    Tactics
    Operations
    Execution
```

### Advanced Syntax

```
smartshapes-LR
    type: process
    theme: colorful
    shape: chevron

    %% Nodes with IDs
    A[Research] --> B[Analyze]
    B --> C[Design]
    C --> D[Implement]
    D --> E[Review]
    E -.-> A
```

---

## Implementation Roadmap

### Phase 1: Foundation (MVP)

**Goal**: Basic working integration with 2 layout types

**Tasks**:

1. [ ] Set up `mermaid-smartshapes` package with TypeScript
2. [ ] Implement parser for basic syntax
3. [ ] Implement `LinearAlgorithm` (list/process)
4. [ ] Implement `CycleAlgorithm`
5. [ ] Create basic shape renderer (rect, ellipse)
6. [ ] Register as external Mermaid diagram
7. [ ] Basic documentation

**Deliverable**: npm package supporting list, process, and cycle diagrams

### Phase 2: Core Algorithms

**Goal**: Complete algorithm suite

**Tasks**:

1. [ ] Implement `SnakeAlgorithm`
2. [ ] Implement `PyramidAlgorithm`
3. [ ] Implement `CompositeAlgorithm` (matrix, venn)
4. [ ] Integrate Dagre for hierarchy
5. [ ] Add connector/arrow rendering
6. [ ] Shape library (chevron, trapezoid, etc.)

**Deliverable**: All 7 SmartArt categories supported

### Phase 3: Polish

**Goal**: Production-ready quality

**Tasks**:

1. [ ] Theme integration with Mermaid themes
2. [ ] Accessibility (ARIA labels)
3. [ ] Animation support (optional)
4. [ ] Comprehensive test suite
5. [ ] Performance optimization
6. [ ] Documentation site

**Deliverable**: v1.0 release

### Phase 4: Advanced Features

**Goal**: Feature parity with common SmartArt uses

**Tasks**:

1. [ ] Additional layout variants (e.g., radial list, bending process)
2. [ ] Custom color schemes
3. [ ] Icon support
4. [ ] Sub-diagrams/nesting
5. [ ] Export to OOXML SmartArt (optional)

---

## References

### OOXML Specifications

- [ECMA-376 Office Open XML File Formats](https://www.ecma-international.org/publications-and-standards/standards/ecma-376/)
- [MS-ODRAWXML: Office Drawing Extensions](https://learn.microsoft.com/en-us/openspecs/office_standards/ms-odrawxml/06cff208-c6e1-4db7-bb68-665135e5f0de)
- [DrawingML Diagrams Namespace](http://schemas.openxmlformats.org/drawingml/2006/diagram)

### LibreOffice Source Code

- [LibreOffice Core Repository](https://github.com/LibreOffice/core)
- [diagram.cxx Source](https://docs.libreoffice.org/oox/html/diagram_8cxx_source.html)
- [AlgAtom Class Reference](https://docs.libreoffice.org/oox/html/classoox_1_1drawingml_1_1AlgAtom.html)
- [CycleAlg Commit](https://github.com/LibreOffice/core/commit/64cd173f346d35c28909b4ac8f9c2d2a939049b7)
- [SmartArt Improvements Blog](https://vmiklos.hu/blog/smartart-improvements.html)

### Mermaid.js

- [Mermaid GitHub Repository](https://github.com/mermaid-js/mermaid)
- [Mermaid Documentation](https://mermaid.js.org/)
- [Diagram Types Architecture (DeepWiki)](https://deepwiki.com/mermaid-js/mermaid/3-diagram-types)
- [Common Layout Engine Issue #5237](https://github.com/mermaid-js/mermaid/issues/5237)
- [Layouts Documentation](https://mermaid.js.org/config/layouts.html)

### Related Projects

- [Apache POI SmartArt](https://poi.apache.org/apidocs/dev/org/apache/poi/xslf/usermodel/XSLFDiagram.html)
- [python-pptx SmartArt Issue](https://github.com/scanny/python-pptx/issues/83)
- [OpenOffice SmartArt Wiki](https://wiki.openoffice.org/wiki/SmartArt)

---

## Appendix A: Shape Types

| Shape       | SVG Element       | Use Case                |
| ----------- | ----------------- | ----------------------- |
| `rect`      | `<rect>`          | List, Matrix, Hierarchy |
| `roundRect` | `<rect rx="...">` | Soft lists              |
| `ellipse`   | `<ellipse>`       | Cycle, Venn             |
| `chevron`   | `<polygon>`       | Process arrows          |
| `trapezoid` | `<polygon>`       | Pyramid                 |
| `diamond`   | `<polygon>`       | Decision points         |
| `hexagon`   | `<polygon>`       | Special nodes           |

## Appendix B: Constraint Types (from OOXML)

| Type         | Description       |
| ------------ | ----------------- |
| `w`          | Width             |
| `h`          | Height            |
| `l`          | Left position     |
| `t`          | Top position      |
| `r`          | Right position    |
| `b`          | Bottom position   |
| `ctrX`       | Center X          |
| `ctrY`       | Center Y          |
| `primFontSz` | Primary font size |
| `sp`         | Spacing           |
| `sibSp`      | Sibling spacing   |

## Appendix C: Color Schemes

```typescript
const colorSchemes = {
  colorful: ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47'],
  accent1: ['#4472C4', '#6B8DC9', '#92A9CE', '#B9C4D3'],
  accent2: ['#ED7D31', '#F19B5C', '#F5B987', '#F9D7B2'],
  monochrome: ['#333333', '#666666', '#999999', '#CCCCCC'],
};
```

---

_Document generated from research session on 2024-11-27_

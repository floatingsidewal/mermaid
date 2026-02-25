import type { DiagramDB } from '../../diagram-api/types.js';

/**
 * SmartShape diagram configuration
 */
export interface SmartShapeDiagramConfig {
  useMaxWidth?: boolean;
  padding?: number;
  nodeSpacing?: number;
}

/**
 * Diagram types supported by SmartShape
 */
export type SmartShapeType =
  | 'list'
  | 'process'
  | 'cycle'
  | 'hierarchy'
  | 'relationship'
  | 'matrix'
  | 'pyramid';

/**
 * Direction for layout flow
 */
export type Direction = 'TB' | 'LR' | 'BT' | 'RL';

/**
 * Shape types for rendering
 */
export type ShapeType =
  | 'rect'
  | 'roundRect'
  | 'ellipse'
  | 'chevron'
  | 'trapezoid'
  | 'diamond'
  | 'hexagon';

/**
 * Represents a single item in the SmartShape diagram
 */
export interface SmartShapeItem {
  id: string;
  text: string;
  level: number;
  children: SmartShapeItem[];
  classSelector?: string;
}

/**
 * Internal fields for SmartShape state
 */
export interface SmartShapeFields {
  items: SmartShapeItem[];
  shapeType: SmartShapeType;
  direction: Direction;
  classes: Map<string, DiagramStyleClassDef>;
  config: SmartShapeDiagramConfig;
}

/**
 * Style class definition
 */
export interface DiagramStyleClassDef {
  id: string;
  styles: string[];
}

/**
 * Positioned node after layout calculation
 */
export interface PositionedNode extends SmartShapeItem {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: ShapeType;
  rotation?: number;
}

/**
 * Bounds for layout calculation
 */
export interface Bounds {
  width: number;
  height: number;
}

/**
 * Configuration for layout algorithms
 */
export interface LayoutConfig {
  direction: Direction;
  spacing: number;
  aspectRatio?: number;
  nodeSize?: { width: number; height: number };
  startAngle?: number;
  spanAngle?: number;
  columns?: number;
  subType?: 'matrix' | 'venn';
}

/**
 * Connector path between nodes
 */
export interface ConnectorPath {
  from: { x: number; y: number };
  to: { x: number; y: number };
  type: 'arrow' | 'curvedArrow' | 'line';
  curve?: number;
}

/**
 * Layout algorithm interface
 */
export interface LayoutAlgorithm {
  name: string;
  layout(nodes: SmartShapeItem[], bounds: Bounds, config: LayoutConfig): PositionedNode[];
  getConnectors?(nodes: PositionedNode[], edges?: SmartShapeEdge[]): ConnectorPath[];
}

/**
 * Edge between nodes (for process/hierarchy types)
 */
export interface SmartShapeEdge {
  from: string;
  to: string;
  label?: string;
}

/**
 * Style options for SmartShape diagram
 */
export interface SmartShapeStyleOptions {
  fontFamily: string;
  nodeBackgroundColor: string;
  nodeBorderColor: string;
  nodeTextColor: string;
  connectorColor: string;
  titleTextSize: string;
  titleTextColor: string;
  labelTextSize: string;
}

/**
 * SmartShape database interface
 */
export interface SmartShapeDB extends DiagramDB {
  // Config
  getConfig: () => Required<SmartShapeDiagramConfig>;

  // Common DB methods
  clear: () => void;
  setDiagramTitle: (title: string) => void;
  getDiagramTitle: () => string;
  setAccTitle: (title: string) => void;
  getAccTitle: () => string;
  setAccDescription: (description: string) => void;
  getAccDescription: () => string;

  // SmartShape specific methods
  addItem: (item: SmartShapeItem) => void;
  getItems: () => SmartShapeItem[];
  setShapeType: (type: SmartShapeType) => void;
  getShapeType: () => SmartShapeType;
  setDirection: (direction: Direction) => void;
  getDirection: () => Direction;
  addClass: (id: string, styleText: string) => void;
  getClasses: () => Map<string, DiagramStyleClassDef>;
}

import type {
  SmartShapeItem,
  PositionedNode,
  Bounds,
  LayoutConfig,
  ConnectorPath,
  SmartShapeEdge,
} from '../smartshapeTypes.js';

/**
 * Layout algorithm interface
 */
export interface LayoutAlgorithm {
  name: string;
  layout(nodes: SmartShapeItem[], bounds: Bounds, config: LayoutConfig): PositionedNode[];
  getConnectors?(nodes: PositionedNode[], edges?: SmartShapeEdge[]): ConnectorPath[];
}

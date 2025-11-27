import type {
  SmartShapeItem,
  PositionedNode,
  Bounds,
  LayoutConfig,
  ConnectorPath,
} from '../smartshapeTypes.js';
import type { LayoutAlgorithm } from './types.js';

/**
 * Linear layout algorithm
 * Arranges nodes in a horizontal or vertical line
 * Based on LibreOffice LinearAlg
 */
export class LinearAlgorithm implements LayoutAlgorithm {
  name = 'linear';

  layout(nodes: SmartShapeItem[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    const count = nodes.length;
    if (count === 0) {
      return [];
    }

    const isHorizontal = config.direction === 'LR' || config.direction === 'RL';
    const reverse = config.direction === 'RL' || config.direction === 'BT';
    const spacing = config.spacing ?? 20;

    // Calculate node dimensions
    const nodeWidth = isHorizontal
      ? (bounds.width - (count - 1) * spacing) / count
      : bounds.width;
    const nodeHeight = isHorizontal
      ? bounds.height
      : (bounds.height - (count - 1) * spacing) / count;

    return nodes.map((node, index) => {
      const i = reverse ? count - 1 - index : index;
      return {
        ...node,
        x: isHorizontal ? i * (nodeWidth + spacing) : 0,
        y: isHorizontal ? 0 : i * (nodeHeight + spacing),
        width: nodeWidth,
        height: nodeHeight,
        shape: 'rect',
      };
    });
  }

  getConnectors(nodes: PositionedNode[]): ConnectorPath[] {
    if (nodes.length < 2) {
      return [];
    }

    // Generate arrows between consecutive nodes
    return nodes.slice(0, -1).map((node, i) => {
      const next = nodes[i + 1];
      const isHorizontal = node.y === next.y;

      if (isHorizontal) {
        // Horizontal connection
        const fromLeft = node.x < next.x;
        return {
          from: {
            x: fromLeft ? node.x + node.width : node.x,
            y: node.y + node.height / 2,
          },
          to: {
            x: fromLeft ? next.x : next.x + next.width,
            y: next.y + next.height / 2,
          },
          type: 'arrow' as const,
        };
      } else {
        // Vertical connection
        const fromTop = node.y < next.y;
        return {
          from: {
            x: node.x + node.width / 2,
            y: fromTop ? node.y + node.height : node.y,
          },
          to: {
            x: next.x + next.width / 2,
            y: fromTop ? next.y : next.y + next.height,
          },
          type: 'arrow' as const,
        };
      }
    });
  }
}

export const linearAlgorithm = new LinearAlgorithm();

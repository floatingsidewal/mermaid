import type {
  SmartShapeItem,
  PositionedNode,
  Bounds,
  LayoutConfig,
  ConnectorPath,
} from '../smartshapeTypes.js';
import type { LayoutAlgorithm } from './types.js';

/**
 * Cycle layout algorithm
 * Arranges nodes in a circular pattern
 * Based on LibreOffice CycleAlg
 */
export class CycleAlgorithm implements LayoutAlgorithm {
  name = 'cycle';

  layout(nodes: SmartShapeItem[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    const count = nodes.length;
    if (count === 0) {
      return [];
    }

    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    // Node size is 1/5 of container (from LibreOffice)
    const nodeSize = Math.min(bounds.width, bounds.height) / 5;

    // Calculate radius
    const radius = Math.min(
      (bounds.width - nodeSize) / 2,
      (bounds.height - nodeSize) / 2
    );

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

  getConnectors(nodes: PositionedNode[]): ConnectorPath[] {
    if (nodes.length < 2) {
      return [];
    }

    // Curved arrows around the circle
    return nodes.map((node, i) => {
      const next = nodes[(i + 1) % nodes.length];

      // Calculate edge points on circles
      const fromCenter = {
        x: node.x + node.width / 2,
        y: node.y + node.height / 2,
      };
      const toCenter = {
        x: next.x + next.width / 2,
        y: next.y + next.height / 2,
      };

      // Calculate direction from this node to next
      const dx = toCenter.x - fromCenter.x;
      const dy = toCenter.y - fromCenter.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist === 0) {
        return {
          from: fromCenter,
          to: toCenter,
          type: 'curvedArrow' as const,
        };
      }

      // Normalize direction
      const ndx = dx / dist;
      const ndy = dy / dist;

      // Calculate edge points (on the circle edges)
      const fromEdge = {
        x: fromCenter.x + ndx * (node.width / 2),
        y: fromCenter.y + ndy * (node.height / 2),
      };
      const toEdge = {
        x: toCenter.x - ndx * (next.width / 2),
        y: toCenter.y - ndy * (next.height / 2),
      };

      return {
        from: fromEdge,
        to: toEdge,
        type: 'curvedArrow' as const,
      };
    });
  }
}

export const cycleAlgorithm = new CycleAlgorithm();

import type {
  SmartShapeItem,
  PositionedNode,
  Bounds,
  LayoutConfig,
} from '../smartshapeTypes.js';
import type { LayoutAlgorithm } from './types.js';

/**
 * Pyramid layout algorithm
 * Stacks nodes in a triangular shape
 * Based on LibreOffice PyraAlg
 */
export class PyramidAlgorithm implements LayoutAlgorithm {
  name = 'pyramid';

  layout(nodes: SmartShapeItem[], bounds: Bounds, config: LayoutConfig): PositionedNode[] {
    const count = nodes.length;
    if (count === 0) {
      return [];
    }

    const spacing = config.spacing ?? 10;
    const rowHeight = (bounds.height - (count - 1) * spacing) / count;

    return nodes.map((node, index) => {
      // Width increases from top to bottom
      const widthRatio = (index + 1) / count;
      const nodeWidth = bounds.width * widthRatio;

      return {
        ...node,
        x: (bounds.width - nodeWidth) / 2, // Center horizontally
        y: index * (rowHeight + spacing),
        width: nodeWidth,
        height: rowHeight,
        shape: 'trapezoid',
      };
    });
  }
}

export const pyramidAlgorithm = new PyramidAlgorithm();

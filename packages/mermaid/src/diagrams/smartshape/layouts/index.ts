import type { SmartShapeType } from '../smartshapeTypes.js';
import type { LayoutAlgorithm } from './types.js';
import { linearAlgorithm } from './linear.js';
import { cycleAlgorithm } from './cycle.js';
import { pyramidAlgorithm } from './pyramid.js';

export type { LayoutAlgorithm } from './types.js';

/**
 * Layout algorithm registry
 */
const layoutRegistry: Map<SmartShapeType, LayoutAlgorithm> = new Map([
  ['list', linearAlgorithm],
  ['process', linearAlgorithm],
  ['cycle', cycleAlgorithm],
  ['pyramid', pyramidAlgorithm],
  // hierarchy, relationship, and matrix will be added later
  ['hierarchy', linearAlgorithm], // Placeholder - will use Dagre
  ['relationship', cycleAlgorithm], // Placeholder - will use Venn layout
  ['matrix', linearAlgorithm], // Placeholder - will use matrix layout
]);

/**
 * Get layout algorithm for a shape type
 */
export function getLayoutAlgorithm(type: SmartShapeType): LayoutAlgorithm {
  return layoutRegistry.get(type) ?? linearAlgorithm;
}

/**
 * Register a custom layout algorithm
 */
export function registerLayoutAlgorithm(type: SmartShapeType, algorithm: LayoutAlgorithm): void {
  layoutRegistry.set(type, algorithm);
}

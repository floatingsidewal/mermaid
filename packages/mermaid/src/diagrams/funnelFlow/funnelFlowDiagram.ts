import type { DiagramDefinition } from '../../diagram-api/types.js';
import { parser } from './funnelFlowParser.js';
import { db } from './funnelFlowDb.js';
import styles from './funnelFlowStyles.js';
import { renderer } from './funnelFlowRenderer.js';

export const diagram: DiagramDefinition = {
  parser,
  db,
  renderer,
  styles,
};

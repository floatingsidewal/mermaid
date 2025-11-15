import type { DiagramDefinition } from '../../diagram-api/types.js';
import { parser } from './funnelParser.js';
import { db } from './funnelDb.js';
import styles from './funnelStyles.js';
import { renderer } from './funnelRenderer.js';

export const diagram: DiagramDefinition = {
  parser,
  db,
  renderer,
  styles,
};

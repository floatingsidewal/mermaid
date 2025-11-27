// cspell:ignore smartshape
import type { DiagramDefinition } from '../../diagram-api/types.js';
import { parser } from './smartshapeParser.js';
import { db } from './smartshapeDb.js';
import styles from './smartshapeStyles.js';
import { renderer } from './smartshapeRenderer.js';

export const diagram: DiagramDefinition = {
  parser,
  db,
  renderer,
  styles,
};

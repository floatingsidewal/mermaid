import { AbstractMermaidTokenBuilder } from '../common/index.js';

export class SmartShapeTokenBuilder extends AbstractMermaidTokenBuilder {
  public constructor() {
    super([
      'smartshape',
      'type',
      'direction',
      'list',
      'process',
      'cycle',
      'hierarchy',
      'relationship',
      'matrix',
      'pyramid',
      'TB',
      'LR',
      'BT',
      'RL',
    ]);
  }
}

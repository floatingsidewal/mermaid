import { AbstractMermaidTokenBuilder } from '../common/index.js';

export class FunnelTokenBuilder extends AbstractMermaidTokenBuilder {
  public constructor() {
    super(['funnel', 'showData']);
  }
}

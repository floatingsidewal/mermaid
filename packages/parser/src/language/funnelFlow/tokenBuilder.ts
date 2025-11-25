import { AbstractMermaidTokenBuilder } from '../common/index.js';

export class FunnelFlowTokenBuilder extends AbstractMermaidTokenBuilder {
  public constructor() {
    // Note: 'color' and 'number' are intentionally not in the keyword list
    // because they're used immediately before ':' (e.g., 'color:') and the
    // keyword pattern requires non-word-boundary after the keyword
    super(['funnelFlow', 'showData', 'trueScale', 'note', 'style']);
  }
}

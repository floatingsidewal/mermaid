import type { CstNode, GrammarAST, ValueType } from 'langium';
import { AbstractMermaidValueConverter } from '../common/index.js';

export class FunnelFlowValueConverter extends AbstractMermaidValueConverter {
  protected override runCustomConverter(
    _rule: GrammarAST.AbstractRule,
    _input: string,
    _cstNode: CstNode
  ): ValueType | undefined {
    return undefined;
  }
}

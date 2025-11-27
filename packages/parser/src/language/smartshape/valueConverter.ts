// cspell:ignore smartshape
import type { CstNode, GrammarAST, ValueType } from 'langium';
import { AbstractMermaidValueConverter } from '../common/index.js';

export class SmartShapeValueConverter extends AbstractMermaidValueConverter {
  protected runCustomConverter(
    rule: GrammarAST.AbstractRule,
    input: string,
    _cstNode: CstNode
  ): ValueType | undefined {
    if (rule.name === 'ITEM_LINE') {
      // ITEM_LINE captures: optional whitespace + quoted string
      // Return the raw string - parser will extract indent and text
      return input;
    } else if (rule.name === 'SHAPE_TYPE') {
      // Return shape type as-is
      return input;
    }
    return undefined;
  }
}

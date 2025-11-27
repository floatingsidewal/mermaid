import type { CstNode, GrammarAST, ValueType } from 'langium';
import { AbstractMermaidValueConverter } from '../common/index.js';

// Regular expression to extract className and styleText from a classDef terminal
const classDefRegex = /classDef\s+([A-Z_a-z]\w+)(?:\s+([^\n\r;]*))?;?/;

export class SmartShapeValueConverter extends AbstractMermaidValueConverter {
  protected runCustomConverter(
    rule: GrammarAST.AbstractRule,
    input: string,
    _cstNode: CstNode
  ): ValueType | undefined {
    if (rule.name === 'ITEM_TEXT') {
      // Remove quotes if present
      if (
        (input.startsWith('"') && input.endsWith('"')) ||
        (input.startsWith("'") && input.endsWith("'"))
      ) {
        return input.substring(1, input.length - 1).trim();
      }
      return input.trim();
    } else if (rule.name === 'INDENTATION') {
      // Return the length of indentation for nesting level calculation
      return input.length;
    } else if (rule.name === 'ClassDef') {
      // Handle classDef statement
      if (typeof input !== 'string') {
        return input;
      }

      const match = classDefRegex.exec(input);
      if (match) {
        return {
          $type: 'ClassDefStatement',
          className: match[1],
          styleText: match[2] || undefined,
        } as any;
      }
    }
    return undefined;
  }
}

// cspell:ignore smartshape
import type { SmartShape } from '@mermaid-js/parser';
import { parse } from '@mermaid-js/parser';
import { log } from '../../logger.js';
import type { ParserDefinition } from '../../diagram-api/types.js';
import { populateCommonDb } from '../common/populateCommonDb.js';
import type { SmartShapeDB, SmartShapeType, Direction } from './smartshapeTypes.js';
import { db } from './smartshapeDb.js';

/**
 * Parse an ITEM_LINE to extract indentation and text.
 * ITEM_LINE format: optional whitespace + quoted string
 * Example: '  "Hello World"' results in indent: 2, text: "Hello World"
 */
function parseItemLine(line: string): { indent: number; text: string } {
  // Match: leading whitespace, then quoted string
  const match = /^([\t ]*)(?:"([^"]*)"|'([^']*)')/.exec(line);
  if (match) {
    const whitespace = match[1] || '';
    const text = match[2] !== undefined ? match[2] : match[3] || '';
    return {
      indent: whitespace.length,
      text: text.trim(),
    };
  }
  return { indent: 0, text: '' };
}

const populateDb = (ast: SmartShape, db: SmartShapeDB) => {
  populateCommonDb(ast, db);

  // Set shape type if specified
  if (ast.shapeType) {
    db.setType(ast.shapeType as SmartShapeType);
  }

  // Set direction if specified
  if (ast.direction) {
    db.setDirection(ast.direction as Direction);
  }

  // Add all items
  if (ast.rows) {
    for (const row of ast.rows) {
      // row.line contains the ITEM_LINE with optional whitespace + quoted text
      const line = row.line || '';
      const { indent, text } = parseItemLine(line);
      if (text) {
        db.addItem(text, indent);
      }
    }
  }
};

export const parser: ParserDefinition = {
  parse: async (input: string): Promise<void> => {
    const ast: SmartShape = await parse('smartshape', input);
    log.debug('SmartShape AST:', ast);
    populateDb(ast, db);
  },
};

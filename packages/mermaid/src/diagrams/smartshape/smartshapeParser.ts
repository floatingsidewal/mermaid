import type { SmartShape } from '@mermaid-js/parser';
import { parse } from '@mermaid-js/parser';
import { log } from '../../logger.js';
import type { ParserDefinition } from '../../diagram-api/types.js';
import { populateCommonDb } from '../common/populateCommonDb.js';
import type { SmartShapeDB, SmartShapeItem, SmartShapeType, Direction } from './smartshapeTypes.js';
import { db } from './smartshapeDb.js';

// Regular expression to extract className and styleText from a classDef terminal
const classDefRegex = /classDef\s+([A-Z_a-z]\w+)(?:\s+([^\n\r;]*))?;?/;

/**
 * Build hierarchical items from flat rows with indentation
 */
const buildItemHierarchy = (
  rows: SmartShape['rows']
): SmartShapeItem[] => {
  const result: SmartShapeItem[] = [];
  const stack: { item: SmartShapeItem; indent: number }[] = [];
  let itemId = 0;

  for (const row of rows) {
    // Skip rows without items (e.g., classDef rows)
    if (!row.item) {
      // Handle classDef
      if (row.classDef && typeof row.classDef === 'string') {
        const match = classDefRegex.exec(row.classDef);
        if (match) {
          db.addClass(match[1], match[2] || '');
        }
      }
      continue;
    }

    const indent = typeof row.indent === 'number' ? row.indent : 0;
    const itemText = row.item.text;
    const classSelector = row.item.classSelector;

    const newItem: SmartShapeItem = {
      id: `item-${itemId++}`,
      text: itemText,
      level: 0,
      children: [],
      classSelector,
    };

    // Find parent based on indentation
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Root level item
      newItem.level = 0;
      result.push(newItem);
    } else {
      // Child of the last item in stack
      const parent = stack[stack.length - 1].item;
      newItem.level = parent.level + 1;
      parent.children.push(newItem);
    }

    stack.push({ item: newItem, indent });
  }

  return result;
};

/**
 * Flatten hierarchical items for layout algorithms that work with flat lists
 */
export const flattenItems = (items: SmartShapeItem[]): SmartShapeItem[] => {
  const result: SmartShapeItem[] = [];

  const traverse = (item: SmartShapeItem) => {
    result.push(item);
    for (const child of item.children) {
      traverse(child);
    }
  };

  for (const item of items) {
    traverse(item);
  }

  return result;
};

const populateDb = (ast: SmartShape, db: SmartShapeDB) => {
  populateCommonDb(ast, db);

  // Set shape type if provided
  if (ast.shapeType) {
    db.setShapeType(ast.shapeType as SmartShapeType);
  }

  // Set direction if provided
  if (ast.direction) {
    db.setDirection(ast.direction as Direction);
  }

  // Build and add items
  const items = buildItemHierarchy(ast.rows);
  for (const item of items) {
    db.addItem(item);
  }
};

export const parser: ParserDefinition = {
  parse: async (input: string): Promise<void> => {
    const ast: SmartShape = await parse('smartshape', input);
    log.debug('SmartShape AST:', ast);
    db.clear();
    populateDb(ast, db);
  },
};

import type { Funnel } from '@mermaid-js/parser';
import { parse } from '@mermaid-js/parser';
import { log } from '../../logger.js';
import type { ParserDefinition } from '../../diagram-api/types.js';
import { populateCommonDb } from '../common/populateCommonDb.js';
import type { FunnelDB } from './funnelTypes.js';
import { db } from './funnelDb.js';

const populateDb = (ast: Funnel, db: FunnelDB) => {
  populateCommonDb(ast, db);
  db.setShowData(ast.showData);
  db.setTrueScale(ast.trueScale);

  // Set stage name if provided
  if (ast.stageName) {
    db.setStageName(ast.stageName.name);
  }

  ast.sections.forEach((section) => {
    // Extract description lines if present
    const description = section.descriptionLines?.map((line) => line.text) || undefined;

    // Extract color and custom number from metadata
    let color: string | undefined;
    let customNumber: string | undefined;

    if (section.metadata) {
      section.metadata.forEach((meta) => {
        if ('colorValue' in meta) {
          color = meta.colorValue;
        } else if ('numberValue' in meta) {
          customNumber = meta.numberValue;
        }
      });
    }

    db.addSection({
      label: section.label,
      value: section.value,
      description,
      color,
      customNumber,
    });
  });
};

export const parser: ParserDefinition = {
  parse: async (input: string): Promise<void> => {
    const ast: Funnel = await parse('funnel', input);
    log.debug(ast);
    db.clear();
    populateDb(ast, db);
  },
};

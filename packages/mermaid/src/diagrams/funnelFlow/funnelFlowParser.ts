import type { FunnelFlow } from '@mermaid-js/parser';
import { parse } from '@mermaid-js/parser';
import { log } from '../../logger.js';
import type { ParserDefinition } from '../../diagram-api/types.js';
import { populateCommonDb } from '../common/populateCommonDb.js';
import type { FunnelFlowDB } from './funnelFlowTypes.js';
import { db } from './funnelFlowDb.js';

const populateDb = (ast: FunnelFlow, db: FunnelFlowDB) => {
  populateCommonDb(ast, db);
  db.setShowData(ast.showData);
  db.setTrueScale(ast.trueScale);

  // Process stage chains (order matters - stages are added in sequence)
  ast.chains.forEach((chain) => {
    chain.stages.forEach((stage) => {
      db.addStage({
        id: stage.id,
        label: stage.label, // undefined if not provided, uses id as label
        value: stage.value,
      });
    });
  });

  // Apply notes to stages (notes reference stages by ID)
  ast.notes.forEach((note) => {
    db.addNote(note.stageId, note.text);
  });

  // Apply styles to stages (styles reference stages by ID)
  ast.styles.forEach((style) => {
    let color: string | undefined;
    let customNumber: string | undefined;

    style.properties.forEach((prop) => {
      if (prop.key === 'color') {
        color = prop.value;
      } else if (prop.key === 'number') {
        customNumber = prop.value;
      }
    });

    db.addStyle(style.stageId, color, customNumber);
  });
};

export const parser: ParserDefinition = {
  parse: async (input: string): Promise<void> => {
    const ast: FunnelFlow = await parse('funnelFlow', input);
    log.debug(ast);
    db.clear();
    populateDb(ast, db);
  },
};

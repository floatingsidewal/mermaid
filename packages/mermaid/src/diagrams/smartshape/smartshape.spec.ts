import { parser } from './smartshapeParser.js';
import { db } from './smartshapeDb.js';
import { setConfig } from '../../diagram-api/diagramAPI.js';

setConfig({
  securityLevel: 'strict',
});

describe('smartshape', () => {
  beforeEach(() => db.clear());

  describe('parse', () => {
    it('should handle simple smartshape with default type', async () => {
      await parser.parse(`smartshape
"Item 1"
"Item 2"
"Item 3"`);

      const items = db.getItems();
      expect(items).toHaveLength(3);
      expect(items[0].text).toBe('Item 1');
      expect(items[1].text).toBe('Item 2');
      expect(items[2].text).toBe('Item 3');
    });

    it('should handle smartshape with type declaration', async () => {
      await parser.parse(`smartshape
type: list-chevron
"First Item"
"Second Item"`);

      const config = db.getConfig();
      expect(config.type).toBe('list-chevron');

      const items = db.getItems();
      expect(items).toHaveLength(2);
    });

    it('should handle nested items with indentation', async () => {
      await parser.parse(`smartshape
"Parent 1"
  "Child 1.1"
  "Child 1.2"
"Parent 2"
  "Child 2.1"`);

      const items = db.getItems();
      expect(items).toHaveLength(2);
      expect(items[0].text).toBe('Parent 1');
      expect(items[0].children).toHaveLength(2);
      expect(items[0].children[0].text).toBe('Child 1.1');
      expect(items[0].children[1].text).toBe('Child 1.2');
      expect(items[1].text).toBe('Parent 2');
      expect(items[1].children).toHaveLength(1);
      expect(items[1].children[0].text).toBe('Child 2.1');
    });

    it('should handle smartshape with comments', async () => {
      await parser.parse(`smartshape
%% this is a comment
"Item 1"
"Item 2"`);

      const items = db.getItems();
      expect(items).toHaveLength(2);
    });

    it('should handle smartshape with title', async () => {
      await parser.parse(`smartshape
title My SmartShape Diagram
"Item 1"
"Item 2"`);

      expect(db.getDiagramTitle()).toBe('My SmartShape Diagram');
    });

    it('should handle smartshape with accTitle', async () => {
      await parser.parse(`smartshape
accTitle: Accessible Title
"Item 1"
"Item 2"`);

      expect(db.getAccTitle()).toBe('Accessible Title');
    });

    it('should handle list-pyramid type', async () => {
      await parser.parse(`smartshape
type: list-pyramid
"Strategy"
  "Goal 1"
  "Goal 2"
"Tactics"
  "Action 1"`);

      const config = db.getConfig();
      expect(config.type).toBe('list-pyramid');

      const items = db.getItems();
      expect(items).toHaveLength(2);
      expect(items[0].children).toHaveLength(2);
    });

    it('should handle list-bullet type', async () => {
      await parser.parse(`smartshape
type: list-bullet
"Header 1"
  "Bullet 1"
  "Bullet 2"
"Header 2"
  "Bullet 3"`);

      const config = db.getConfig();
      expect(config.type).toBe('list-bullet');
    });

    it('should handle list-block type', async () => {
      await parser.parse(`smartshape
type: list-block
"Category A"
  "Detail 1"
  "Detail 2"
"Category B"
  "Detail 3"`);

      const config = db.getConfig();
      expect(config.type).toBe('list-block');
    });
  });

  describe('config', () => {
    it('should return default config', () => {
      const config = db.getConfig();
      expect(config.type).toBe('list-block');
      expect(config.direction).toBe('TB');
    });
  });
});

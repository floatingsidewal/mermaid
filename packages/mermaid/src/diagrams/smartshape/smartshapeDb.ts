// cspell:ignore smartshape
import { log } from '../../logger.js';
import {
  setAccTitle,
  getAccTitle,
  setDiagramTitle,
  getDiagramTitle,
  getAccDescription,
  setAccDescription,
  clear as commonClear,
} from '../common/commonDb.js';
import type {
  SmartShapeItem,
  SmartShapeDB,
  SmartShapeConfig,
  SmartShapeType,
  Direction,
} from './smartshapeTypes.js';

const DEFAULT_CONFIG: SmartShapeConfig = {
  type: 'list-block',
  direction: 'TB',
  useMaxWidth: true,
};

let items: SmartShapeItem[] = [];
let config: SmartShapeConfig = { ...DEFAULT_CONFIG };
let itemCounter = 0;

// Stack to track parent items at each indentation level
let parentStack: SmartShapeItem[] = [];

const getConfig = (): SmartShapeConfig => ({ ...config });

const clear = (): void => {
  items = [];
  config = { ...DEFAULT_CONFIG };
  itemCounter = 0;
  parentStack = [];
  commonClear();
};

const addItem = (text: string, indent: number): void => {
  const id = `item-${itemCounter++}`;
  const level = indent > 0 ? Math.floor(indent / 2) : 0; // Normalize indent to level

  const newItem: SmartShapeItem = {
    id,
    text: text.trim(),
    children: [],
    level,
  };

  log.debug(`Adding item: "${text}" at level ${level}, indent: ${indent}`);

  if (level === 0) {
    // Top-level item
    items.push(newItem);
    parentStack = [newItem];
  } else {
    // Find the appropriate parent
    // Trim the stack to the current level
    while (parentStack.length > level) {
      parentStack.pop();
    }

    if (parentStack.length > 0) {
      const parent = parentStack[parentStack.length - 1];
      parent.children.push(newItem);
    } else {
      // Fallback: add as top-level if no parent found
      items.push(newItem);
    }

    parentStack.push(newItem);
  }
};

const getItems = (): SmartShapeItem[] => items;

const setType = (type: SmartShapeType): void => {
  config.type = type;
  log.debug(`Set shape type to: ${type}`);
};

const setDirection = (direction: Direction): void => {
  config.direction = direction;
  log.debug(`Set direction to: ${direction}`);
};

export const db: SmartShapeDB = {
  getConfig,

  clear,
  setDiagramTitle,
  getDiagramTitle,
  setAccTitle,
  getAccTitle,
  setAccDescription,
  getAccDescription,

  getItems,
  addItem,
  setType,
  setDirection,
};

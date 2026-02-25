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
  SmartShapeType,
  Direction,
  DiagramStyleClassDef,
  SmartShapeDiagramConfig,
} from './smartshapeTypes.js';

export const DEFAULT_SMARTSHAPE_CONFIG: Required<SmartShapeDiagramConfig> = {
  useMaxWidth: true,
  padding: 10,
  nodeSpacing: 20,
};

export interface SmartShapeFields {
  items: SmartShapeItem[];
  shapeType: SmartShapeType;
  direction: Direction;
  classes: Map<string, DiagramStyleClassDef>;
  config: Required<SmartShapeDiagramConfig>;
}

export const DEFAULT_SMARTSHAPE_DB: SmartShapeFields = {
  items: [],
  shapeType: 'list',
  direction: 'TB',
  classes: new Map(),
  config: DEFAULT_SMARTSHAPE_CONFIG,
};

let items: SmartShapeItem[] = [];
let shapeType: SmartShapeType = DEFAULT_SMARTSHAPE_DB.shapeType;
let direction: Direction = DEFAULT_SMARTSHAPE_DB.direction;
let classes: Map<string, DiagramStyleClassDef> = new Map();
const config: Required<SmartShapeDiagramConfig> = structuredClone(DEFAULT_SMARTSHAPE_CONFIG);

const getConfig = (): Required<SmartShapeDiagramConfig> => structuredClone(config);

const clear = (): void => {
  items = [];
  shapeType = DEFAULT_SMARTSHAPE_DB.shapeType;
  direction = DEFAULT_SMARTSHAPE_DB.direction;
  classes = new Map();
  commonClear();
};

const addItem = (item: SmartShapeItem): void => {
  items.push(item);
  log.debug(`Added smartshape item: ${item.text} at level ${item.level}`);
};

const getItems = (): SmartShapeItem[] => items;

const setShapeType = (type: SmartShapeType): void => {
  shapeType = type;
  log.debug(`Set smartshape type: ${type}`);
};

const getShapeType = (): SmartShapeType => shapeType;

const setDirection = (dir: Direction): void => {
  direction = dir;
  log.debug(`Set smartshape direction: ${dir}`);
};

const getDirection = (): Direction => direction;

const addClass = (id: string, styleText: string): void => {
  const styles = styleText ? styleText.split(',').map((s) => s.trim()) : [];
  classes.set(id, { id, styles });
  log.debug(`Added class: ${id} with styles: ${styleText}`);
};

const getClasses = (): Map<string, DiagramStyleClassDef> => classes;

export const db: SmartShapeDB = {
  getConfig,

  clear,
  setDiagramTitle,
  getDiagramTitle,
  setAccTitle,
  getAccTitle,
  setAccDescription,
  getAccDescription,

  addItem,
  getItems,
  setShapeType,
  getShapeType,
  setDirection,
  getDirection,
  addClass,
  getClasses,
};

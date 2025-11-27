import type { DiagramDB } from '../../diagram-api/types.js';

export type SmartShapeType = 'list-block' | 'list-bullet' | 'list-chevron' | 'list-pyramid';
export type Direction = 'TB' | 'LR' | 'BT' | 'RL';

export interface SmartShapeItem {
  id: string;
  text: string;
  children: SmartShapeItem[];
  level: number;
}

export interface SmartShapeConfig {
  type: SmartShapeType;
  direction: Direction;
  useMaxWidth: boolean;
}

export interface SmartShapeFields {
  items: SmartShapeItem[];
  config: SmartShapeConfig;
}

export interface SmartShapeStyleOptions {
  fontFamily: string;
  primaryColor: string;
  primaryTextColor: string;
  secondaryColor: string;
  secondaryTextColor: string;
  tertiaryColor: string;
  lineColor: string;
  textColor: string;
  fontSize: string;
}

export interface SmartShapeDB extends DiagramDB {
  // config
  getConfig: () => SmartShapeConfig;

  // common db
  clear: () => void;
  setDiagramTitle: (title: string) => void;
  getDiagramTitle: () => string;
  setAccTitle: (title: string) => void;
  getAccTitle: () => string;
  setAccDescription: (description: string) => void;
  getAccDescription: () => string;

  // diagram db
  getItems: () => SmartShapeItem[];
  addItem: (text: string, indent: number) => void;
  setType: (type: SmartShapeType) => void;
  setDirection: (direction: Direction) => void;
}

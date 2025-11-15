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
import type { FunnelFields, FunnelDB, Sections, FunnelSection } from './funnelTypes.js';
import type { RequiredDeep } from 'type-fest';
import type { FunnelDiagramConfig } from '../../config.type.js';
import DEFAULT_CONFIG from '../../defaultConfig.js';

export const DEFAULT_FUNNEL_CONFIG: Required<FunnelDiagramConfig> = DEFAULT_CONFIG.funnel;

export const DEFAULT_FUNNEL_DB: RequiredDeep<FunnelFields> = {
  sections: new Map(),
  showData: false,
  config: DEFAULT_FUNNEL_CONFIG,
} as const;

let sections: Sections = new Map();
let showData = DEFAULT_FUNNEL_DB.showData;
let autoNumbering = true;
let stageName = 'Stage'; // Default stage name
const config: Required<FunnelDiagramConfig> = structuredClone(DEFAULT_FUNNEL_CONFIG);

const getConfig = (): Required<FunnelDiagramConfig> => structuredClone(config);

const clear = (): void => {
  sections = new Map();
  showData = DEFAULT_FUNNEL_DB.showData;
  autoNumbering = true;
  stageName = 'Stage';
  commonClear();
};

const addSection = ({ label, value, description, color, customNumber }: FunnelSection): void => {
  if (value < 0) {
    throw new Error(
      `"${label}" has invalid value: ${value}. Negative values are not allowed in funnel charts. All stage values must be >= 0.`
    );
  }
  if (!sections.has(label)) {
    sections.set(label, {
      value,
      description,
      color,
      customNumber,
    });
    log.debug(`added new funnel section: ${label}, with value: ${value}`);
  }
};

const getSections = (): Sections => sections;

const setShowData = (toggle: boolean): void => {
  showData = toggle;
};

const getShowData = (): boolean => showData;

const setAutoNumbering = (toggle: boolean): void => {
  autoNumbering = toggle;
};

const getAutoNumbering = (): boolean => autoNumbering;

const setStageName = (name: string): void => {
  stageName = name;
};

const getStageName = (): string => stageName;

export const db: FunnelDB = {
  getConfig,

  clear,
  setDiagramTitle,
  getDiagramTitle,
  setAccTitle,
  getAccTitle,
  setAccDescription,
  getAccDescription,

  addSection,
  getSections,
  setShowData,
  getShowData,
  setAutoNumbering,
  getAutoNumbering,
  setStageName,
  getStageName,
};

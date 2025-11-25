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
import type { FunnelFlowFields, FunnelFlowDB, Stages, FunnelFlowStage } from './funnelFlowTypes.js';
import type { RequiredDeep } from 'type-fest';
import type { FunnelDiagramConfig } from '../../config.type.js';
import DEFAULT_CONFIG from '../../defaultConfig.js';

export const DEFAULT_FUNNEL_FLOW_CONFIG: Required<FunnelDiagramConfig> = DEFAULT_CONFIG.funnel;

export const DEFAULT_FUNNEL_FLOW_DB: RequiredDeep<FunnelFlowFields> = {
  stages: new Map(),
  showData: false,
  config: DEFAULT_FUNNEL_FLOW_CONFIG,
} as const;

let stages: Stages = new Map();
let showData = DEFAULT_FUNNEL_FLOW_DB.showData;
let trueScale = false;
const config: Required<FunnelDiagramConfig> = structuredClone(DEFAULT_FUNNEL_FLOW_CONFIG);

const getConfig = (): Required<FunnelDiagramConfig> => structuredClone(config);

const clear = (): void => {
  stages = new Map();
  showData = DEFAULT_FUNNEL_FLOW_DB.showData;
  trueScale = false;
  commonClear();
};

const addStage = ({
  id,
  label,
  value,
  description,
  color,
  customNumber,
}: FunnelFlowStage): void => {
  if (value < 0) {
    throw new Error(
      `Stage "${id}" has invalid value: ${value}. Negative values are not allowed in funnel charts. All stage values must be >= 0.`
    );
  }
  if (!stages.has(id)) {
    stages.set(id, {
      label,
      value,
      description,
      color,
      customNumber,
    });
    log.debug(`added new funnel flow stage: ${id}, with value: ${value}`);
  } else {
    // Update existing stage (for when notes/styles are applied after chain definition)
    const existing = stages.get(id)!;
    if (label !== undefined) {
      existing.label = label;
    }
    if (description !== undefined) {
      existing.description = [...(existing.description || []), ...description];
    }
    if (color !== undefined) {
      existing.color = color;
    }
    if (customNumber !== undefined) {
      existing.customNumber = customNumber;
    }
  }
};

const getStages = (): Stages => stages;

const addNote = (stageId: string, text: string): void => {
  const stage = stages.get(stageId);
  if (stage) {
    if (stage.description) {
      stage.description.push(text);
    } else {
      stage.description = [text];
    }
    log.debug(`added note to stage ${stageId}: ${text}`);
  } else {
    log.warn(`Note references non-existent stage: ${stageId}`);
  }
};

const addStyle = (stageId: string, color?: string, customNumber?: string): void => {
  const stage = stages.get(stageId);
  if (stage) {
    if (color !== undefined) {
      stage.color = color;
    }
    if (customNumber !== undefined) {
      stage.customNumber = customNumber;
    }
    log.debug(`added style to stage ${stageId}: color=${color}, number=${customNumber}`);
  } else {
    log.warn(`Style references non-existent stage: ${stageId}`);
  }
};

const setShowData = (toggle: boolean): void => {
  showData = toggle;
};

const getShowData = (): boolean => showData;

const setTrueScale = (toggle: boolean): void => {
  trueScale = toggle;
};

const getTrueScale = (): boolean => trueScale;

export const db: FunnelFlowDB = {
  getConfig,

  clear,
  setDiagramTitle,
  getDiagramTitle,
  setAccTitle,
  getAccTitle,
  setAccDescription,
  getAccDescription,

  addStage,
  getStages,
  addNote,
  addStyle,
  setShowData,
  getShowData,
  setTrueScale,
  getTrueScale,
};

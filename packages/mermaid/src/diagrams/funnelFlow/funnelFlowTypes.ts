import type { FunnelDiagramConfig } from '../../config.type.js';
import type { DiagramDB } from '../../diagram-api/types.js';

export interface FunnelFlowFields {
  stages: Stages;
  showData: boolean;
  config: FunnelDiagramConfig;
}

export interface FunnelFlowStyleOptions {
  fontFamily: string;
  funnel1: string;
  funnel2: string;
  funnel3: string;
  funnel4: string;
  funnel5: string;
  funnel6: string;
  funnel7: string;
  funnel8: string;
  funnel9: string;
  funnel10: string;
  funnel11: string;
  funnel12: string;
  funnelTitleTextSize: string;
  funnelTitleTextColor: string;
  funnelSectionTextSize: string;
  funnelSectionTextColor: string;
  funnelLabelTextSize: string;
  funnelLabelTextColor: string;
  funnelStrokeColor: string;
  funnelStrokeWidth: string;
  funnelNumberColor: string;
  funnelValueTextColor: string;
  funnelNoteTextColor: string;
}

export type Stages = Map<string, FunnelFlowStageData>;

export interface FunnelFlowStage {
  id: string;
  label?: string;
  value: number;
  description?: string[];
  color?: string;
  customNumber?: string;
}

export interface FunnelFlowStageData {
  label?: string;
  value: number;
  description?: string[];
  color?: string;
  customNumber?: string;
}

export interface FunnelFlowDB extends DiagramDB {
  // config
  getConfig: () => Required<FunnelDiagramConfig>;

  // common db
  clear: () => void;
  setDiagramTitle: (title: string) => void;
  getDiagramTitle: () => string;
  setAccTitle: (title: string) => void;
  getAccTitle: () => string;
  setAccDescription: (description: string) => void;
  getAccDescription: () => string;

  // diagram db
  addStage: (stage: FunnelFlowStage) => void;
  getStages: () => Stages;
  addNote: (stageId: string, text: string) => void;
  addStyle: (stageId: string, color?: string, customNumber?: string) => void;
  setShowData: (toggle: boolean) => void;
  getShowData: () => boolean;
  setTrueScale: (toggle: boolean) => void;
  getTrueScale: () => boolean;
}

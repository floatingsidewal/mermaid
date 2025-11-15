import type { FunnelDiagramConfig } from '../../config.type.js';
import type { DiagramDB } from '../../diagram-api/types.js';

export interface FunnelFields {
  sections: Sections;
  showData: boolean;
  config: FunnelDiagramConfig;
}

export interface FunnelStyleOptions {
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
}

export type Sections = Map<string, FunnelSectionData>;

export interface FunnelSection {
  label: string;
  value: number;
  description?: string[];
  color?: string;
  customNumber?: string;
}

export interface FunnelSectionData {
  value: number;
  description?: string[];
  color?: string;
  customNumber?: string;
}

export interface FunnelDB extends DiagramDB {
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
  addSection: (section: FunnelSection) => void;
  getSections: () => Sections;
  setShowData: (toggle: boolean) => void;
  getShowData: () => boolean;
  setAutoNumbering: (toggle: boolean) => void;
  getAutoNumbering: () => boolean;
  setStageName: (name: string) => void;
  getStageName: () => string;
}

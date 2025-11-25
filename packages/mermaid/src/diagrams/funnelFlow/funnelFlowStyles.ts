import type { DiagramStylesProvider } from '../../diagram-api/types.js';
import type { FunnelFlowStyleOptions } from './funnelFlowTypes.js';

const getStyles: DiagramStylesProvider = (options: FunnelFlowStyleOptions) =>
  `
  .funnelStage {
    stroke: ${options.funnelStrokeColor};
    stroke-width: ${options.funnelStrokeWidth};
  }
  .funnelTitleText {
    text-anchor: middle;
    font-size: ${options.funnelTitleTextSize};
    fill: ${options.funnelTitleTextColor};
    font-family: ${options.fontFamily};
    font-weight: 600;
  }
  .funnelStageNumber {
    fill: ${options.funnelNumberColor};
    font-family: ${options.fontFamily};
    font-weight: 700;
    font-size: 0.95em;
    text-anchor: middle;
  }
  .funnelStageBadge {
    pointer-events: none;
  }
  .funnelLabel {
    font-family: ${options.fontFamily};
    fill: #ffffff;
    font-size: ${options.funnelSectionTextSize};
    font-weight: 500;
    text-anchor: middle;
  }
  .funnelValue {
    font-family: ${options.fontFamily};
    fill: ${options.funnelValueTextColor};
    font-size: 0.85em;
    text-anchor: middle;
  }
  .funnelNoteConnector {
    stroke-linecap: round;
  }
  .funnelNoteHeader {
    font-family: ${options.fontFamily};
    font-weight: 600;
    font-size: 0.9em;
    fill: ${options.funnelNoteTextColor};
  }
  .funnelNoteText {
    font-family: ${options.fontFamily};
    font-size: 0.85em;
    fill: ${options.funnelNoteTextColor};
  }
  .funnelLegend text {
    fill: ${options.funnelLabelTextColor};
    font-family: ${options.fontFamily};
    font-size: ${options.funnelLabelTextSize};
  }
`;

export default getStyles;

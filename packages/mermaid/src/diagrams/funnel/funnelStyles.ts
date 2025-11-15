import type { DiagramStylesProvider } from '../../diagram-api/types.js';
import type { FunnelStyleOptions } from './funnelTypes.js';

const getStyles: DiagramStylesProvider = (options: FunnelStyleOptions) =>
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
  }
  .funnelLabel {
    font-family: ${options.fontFamily};
    fill: ${options.funnelSectionTextColor};
    font-size: ${options.funnelSectionTextSize};
    text-anchor: middle;
  }
  .funnelLegend text {
    fill: ${options.funnelLabelTextColor};
    font-family: ${options.fontFamily};
    font-size: ${options.funnelLabelTextSize};
  }
`;

export default getStyles;

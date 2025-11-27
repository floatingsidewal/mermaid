import type { DiagramStylesProvider } from '../../diagram-api/types.js';
import type { SmartShapeStyleOptions } from './smartshapeTypes.js';

const getStyles: DiagramStylesProvider = (options: SmartShapeStyleOptions) =>
  `
  .smartshapeNode {
    fill: ${options.nodeBackgroundColor};
    stroke: ${options.nodeBorderColor};
    stroke-width: 2px;
  }
  .smartshapeNode.ellipse {
    fill: ${options.nodeBackgroundColor};
  }
  .smartshapeTitleText {
    text-anchor: middle;
    font-size: ${options.titleTextSize};
    fill: ${options.titleTextColor};
    font-family: ${options.fontFamily};
    font-weight: 600;
  }
  .smartshapeLabel {
    font-family: ${options.fontFamily};
    fill: ${options.nodeTextColor};
    font-size: ${options.labelTextSize};
    font-weight: 500;
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .smartshapeConnector {
    fill: none;
    stroke: ${options.connectorColor};
    stroke-width: 2px;
  }
  .smartshapeConnector.arrow {
    marker-end: url(#smartshapeArrowhead);
  }
`;

export default getStyles;

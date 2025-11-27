// cspell:ignore smartshape
import type { DiagramStylesProvider } from '../../diagram-api/types.js';
import type { SmartShapeStyleOptions } from './smartshapeTypes.js';

const getStyles: DiagramStylesProvider = (options: SmartShapeStyleOptions) =>
  `
  .smartshape-container {
    font-family: ${options.fontFamily};
  }

  .smartshape-label {
    fill: ${options.primaryTextColor};
    font-size: ${options.fontSize};
  }

  .smartshape-label-bg {
    fill: ${options.primaryColor};
    rx: 5;
    ry: 5;
  }

  .smartshape-detail {
    fill: ${options.secondaryColor};
    rx: 5;
    ry: 5;
  }

  .smartshape-detail-text {
    fill: ${options.textColor};
    font-size: ${options.fontSize};
  }

  .smartshape-bullet {
    fill: ${options.textColor};
  }

  .smartshape-title {
    font-size: 1.2em;
    font-weight: bold;
    fill: ${options.textColor};
  }

  .smartshape-chevron {
    fill: ${options.primaryColor};
    stroke: ${options.lineColor};
    stroke-width: 1;
  }

  .smartshape-pyramid {
    fill: ${options.primaryColor};
    stroke: ${options.lineColor};
    stroke-width: 2;
  }

  .smartshape-pyramid-outline {
    fill: none;
    stroke: ${options.lineColor};
    stroke-width: 2;
  }
`;

export default getStyles;

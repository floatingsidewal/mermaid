import type { MermaidConfig } from '../../config.type.js';
import { getConfig } from '../../diagram-api/diagramAPI.js';
import type { DrawDefinition, SVG, SVGGroup } from '../../diagram-api/types.js';
import { log } from '../../logger.js';
import { selectSvgElement } from '../../rendering-util/selectSvgElement.js';
import { configureSvgSize } from '../../setupGraphViewbox.js';
import type {
  SmartShapeDB,
  PositionedNode,
  ConnectorPath,
  Bounds,
  LayoutConfig,
  SmartShapeDiagramConfig,
} from './smartshapeTypes.js';
import { getLayoutAlgorithm } from './layouts/index.js';
import { flattenItems } from './smartshapeParser.js';

/**
 * Draw a rectangle node
 */
const drawRect = (
  group: SVGGroup,
  node: PositionedNode,
  themeVariables: MermaidConfig['themeVariables']
) => {
  group
    .append('rect')
    .attr('x', node.x)
    .attr('y', node.y)
    .attr('width', node.width)
    .attr('height', node.height)
    .attr('rx', 8)
    .attr('ry', 8)
    .attr('fill', themeVariables?.primaryColor ?? '#4472C4')
    .attr('stroke', themeVariables?.primaryBorderColor ?? '#2F5496')
    .attr('class', 'smartshapeNode');
};

/**
 * Draw an ellipse node
 */
const drawEllipse = (
  group: SVGGroup,
  node: PositionedNode,
  themeVariables: MermaidConfig['themeVariables']
) => {
  group
    .append('ellipse')
    .attr('cx', node.x + node.width / 2)
    .attr('cy', node.y + node.height / 2)
    .attr('rx', node.width / 2)
    .attr('ry', node.height / 2)
    .attr('fill', themeVariables?.primaryColor ?? '#4472C4')
    .attr('stroke', themeVariables?.primaryBorderColor ?? '#2F5496')
    .attr('class', 'smartshapeNode ellipse');
};

/**
 * Draw a trapezoid node (for pyramid)
 */
const drawTrapezoid = (
  group: SVGGroup,
  node: PositionedNode,
  themeVariables: MermaidConfig['themeVariables'],
  index: number
) => {
  // Calculate trapezoid points (wider at bottom, narrower at top)
  const topInset = node.width * 0.1; // 10% inset at top
  const points = [
    `${node.x + topInset},${node.y}`,
    `${node.x + node.width - topInset},${node.y}`,
    `${node.x + node.width},${node.y + node.height}`,
    `${node.x},${node.y + node.height}`,
  ].join(' ');

  // Use different colors for each layer
  const colors = [
    themeVariables?.pie1 ?? '#4472C4',
    themeVariables?.pie2 ?? '#ED7D31',
    themeVariables?.pie3 ?? '#A5A5A5',
    themeVariables?.pie4 ?? '#FFC000',
    themeVariables?.pie5 ?? '#5B9BD5',
    themeVariables?.pie6 ?? '#70AD47',
  ];

  group
    .append('polygon')
    .attr('points', points)
    .attr('fill', colors[index % colors.length])
    .attr('stroke', themeVariables?.primaryBorderColor ?? '#2F5496')
    .attr('class', 'smartshapeNode trapezoid');
};

/**
 * Draw node label
 */
const drawLabel = (
  group: SVGGroup,
  node: PositionedNode,
  themeVariables: MermaidConfig['themeVariables']
) => {
  group
    .append('text')
    .attr('x', node.x + node.width / 2)
    .attr('y', node.y + node.height / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .attr('fill', '#ffffff')
    .attr('font-family', themeVariables?.fontFamily ?? 'Arial, sans-serif')
    .attr('font-size', '14px')
    .attr('class', 'smartshapeLabel')
    .text(node.text);
};

/**
 * Draw a connector/arrow between nodes
 */
const drawConnector = (
  group: SVGGroup,
  connector: ConnectorPath,
  themeVariables: MermaidConfig['themeVariables']
) => {
  if (connector.type === 'curvedArrow') {
    // Draw curved arrow
    const midX = (connector.from.x + connector.to.x) / 2;
    const midY = (connector.from.y + connector.to.y) / 2;
    const dx = connector.to.x - connector.from.x;
    const dy = connector.to.y - connector.from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Calculate control point perpendicular to the line
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const curveOffset = dist * 0.2;

    const controlX = midX + perpX * curveOffset;
    const controlY = midY + perpY * curveOffset;

    const path = `M ${connector.from.x},${connector.from.y} Q ${controlX},${controlY} ${connector.to.x},${connector.to.y}`;

    group
      .append('path')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', themeVariables?.lineColor ?? '#666')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#smartshapeArrowhead)')
      .attr('class', 'smartshapeConnector arrow');
  } else {
    // Draw straight arrow
    group
      .append('line')
      .attr('x1', connector.from.x)
      .attr('y1', connector.from.y)
      .attr('x2', connector.to.x)
      .attr('y2', connector.to.y)
      .attr('stroke', themeVariables?.lineColor ?? '#666')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#smartshapeArrowhead)')
      .attr('class', 'smartshapeConnector arrow');
  }
};

/**
 * Create arrowhead marker definition
 */
const createArrowheadMarker = (defs: SVGGroup, themeVariables: MermaidConfig['themeVariables']) => {
  const marker = defs
    .append('marker')
    .attr('id', 'smartshapeArrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 8)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto');

  marker
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', themeVariables?.lineColor ?? '#666');
};

/**
 * Main draw function for SmartShape diagrams
 */
export const draw: DrawDefinition = (text, id, _version, diagObj) => {
  log.debug('Rendering SmartShape diagram\n' + text);
  const db = diagObj.db as SmartShapeDB;
  const globalConfig: MermaidConfig = getConfig();
  const smartshapeConfig: Required<SmartShapeDiagramConfig> = db.getConfig();

  const MARGIN = 40;
  const width = 800;
  const height = 600;

  const svg: SVG = selectSvgElement(id);
  const { themeVariables } = globalConfig;

  // Create defs for markers
  const defs = svg.append('defs');
  createArrowheadMarker(defs, themeVariables);

  // Create main group
  const group: SVGGroup = svg.append('g');
  group.attr('transform', `translate(${MARGIN}, ${MARGIN})`);

  // Get items and layout algorithm
  const items = db.getItems();
  const shapeType = db.getShapeType();
  const direction = db.getDirection();

  if (items.length === 0) {
    log.debug('No items to render');
    return;
  }

  // Flatten items for layout (most algorithms work with flat lists)
  const flatItems = flattenItems(items);

  // Get layout algorithm
  const layoutAlgorithm = getLayoutAlgorithm(shapeType);

  // Calculate layout
  const bounds: Bounds = {
    width: width - MARGIN * 2,
    height: height - MARGIN * 2,
  };

  const layoutConfig: LayoutConfig = {
    direction,
    spacing: smartshapeConfig.nodeSpacing ?? 20,
  };

  const positionedNodes = layoutAlgorithm.layout(flatItems, bounds, layoutConfig);

  // Draw connectors first (behind nodes)
  if (layoutAlgorithm.getConnectors && shapeType !== 'pyramid') {
    const connectors = layoutAlgorithm.getConnectors(positionedNodes);
    for (const connector of connectors) {
      drawConnector(group, connector, themeVariables);
    }
  }

  // Draw nodes
  positionedNodes.forEach((node, index) => {
    switch (node.shape) {
      case 'ellipse':
        drawEllipse(group, node, themeVariables);
        break;
      case 'trapezoid':
        drawTrapezoid(group, node, themeVariables, index);
        break;
      default:
        drawRect(group, node, themeVariables);
    }

    // Draw label
    drawLabel(group, node, themeVariables);
  });

  // Draw title if present
  const title = db.getDiagramTitle();
  if (title) {
    group
      .append('text')
      .text(title)
      .attr('x', (width - MARGIN * 2) / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('font-family', themeVariables?.fontFamily ?? 'Arial, sans-serif')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .attr('fill', themeVariables?.textColor ?? '#333')
      .attr('class', 'smartshapeTitleText');
  }

  // Set viewBox
  svg.attr('viewBox', `0 0 ${width} ${height}`);
  configureSvgSize(svg, height, width, smartshapeConfig.useMaxWidth);
};

export const renderer = { draw };

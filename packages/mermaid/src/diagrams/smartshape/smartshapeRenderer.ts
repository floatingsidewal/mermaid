// cspell:ignore smartshape
import type { DrawDefinition } from '../../diagram-api/types.js';
import { log } from '../../logger.js';
import { selectSvgElement } from '../../rendering-util/selectSvgElement.js';
import { configureSvgSize } from '../../setupGraphViewbox.js';
import type { SmartShapeDB, SmartShapeItem, SmartShapeConfig } from './smartshapeTypes.js';
import { renderListBlock } from './shapes/listBlock.js';
import { renderListBullet } from './shapes/listBullet.js';
import { renderListChevron } from './shapes/listChevron.js';
import { renderListPyramid } from './shapes/listPyramid.js';

export interface ShapeRenderResult {
  width: number;
  height: number;
}

export type ShapeRenderer = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  items: SmartShapeItem[],
  config: SmartShapeConfig
) => ShapeRenderResult;

const shapeRenderers: Record<string, ShapeRenderer> = {
  'list-block': renderListBlock,
  'list-bullet': renderListBullet,
  'list-chevron': renderListChevron,
  'list-pyramid': renderListPyramid,
};

export const draw: DrawDefinition = (text, id, _version, diagObj) => {
  log.debug('Rendering smartshape diagram\n' + text);

  const db = diagObj.db as SmartShapeDB;
  const config = db.getConfig();
  const items = db.getItems();
  const title = db.getDiagramTitle();

  log.debug('SmartShape config:', config);
  log.debug('SmartShape items:', items);

  const svg = selectSvgElement(id);
  const group = svg.append('g').attr('class', 'smartshape-container');

  // Add title if present
  let titleHeight = 0;
  if (title) {
    group.append('text').attr('class', 'smartshape-title').attr('x', 10).attr('y', 25).text(title);
    titleHeight = 40;
  }

  // Create content group with title offset
  const contentGroup = group.append('g').attr('transform', `translate(0, ${titleHeight})`);

  // Get the appropriate renderer
  const renderer = shapeRenderers[config.type];
  if (!renderer) {
    log.error(`Unknown shape type: ${config.type}`);
    return;
  }

  // Render the shape
  const result = renderer(contentGroup as any, items, config);

  // Set viewBox and configure size
  const totalHeight = result.height + titleHeight + 20;
  const totalWidth = result.width + 20;

  svg.attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
  configureSvgSize(svg, totalHeight, totalWidth, config.useMaxWidth);
};

export const renderer = { draw };

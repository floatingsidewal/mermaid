// cspell:ignore smartshape
import type { SmartShapeItem, SmartShapeConfig } from '../smartshapeTypes.js';
import type { ShapeRenderResult } from '../smartshapeRenderer.js';

const HEADER_HEIGHT = 40;
const ITEM_LINE_HEIGHT = 24;
const PADDING = 10;
const BULLET_RADIUS = 4;
const INDENT_SIZE = 20;

/**
 * Renders list-bullet shape: Header bars with plain bullets below
 */
export function renderListBullet(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  items: SmartShapeItem[],
  _config: SmartShapeConfig
): ShapeRenderResult {
  let currentY = 0;
  const maxWidth = 300; // Minimum width

  for (const item of items) {
    // Render header bar
    const headerGroup = svg.append('g').attr('transform', `translate(${PADDING}, ${currentY})`);

    // Header background
    headerGroup
      .append('rect')
      .attr('class', 'smartshape-label-bg')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', maxWidth - PADDING * 2)
      .attr('height', HEADER_HEIGHT);

    // Header text
    headerGroup
      .append('text')
      .attr('class', 'smartshape-label')
      .attr('x', PADDING)
      .attr('y', HEADER_HEIGHT / 2 + 5)
      .text(item.text);

    currentY += HEADER_HEIGHT + PADDING / 2;

    // Render sub-items as bullets
    for (const child of item.children) {
      const bulletY = currentY + ITEM_LINE_HEIGHT / 2;

      // Bullet point
      svg
        .append('circle')
        .attr('class', 'smartshape-bullet')
        .attr('cx', PADDING + INDENT_SIZE)
        .attr('cy', bulletY)
        .attr('r', BULLET_RADIUS);

      // Bullet text
      svg
        .append('text')
        .attr('class', 'smartshape-detail-text')
        .attr('x', PADDING + INDENT_SIZE + BULLET_RADIUS * 3)
        .attr('y', bulletY + 5)
        .text(child.text);

      currentY += ITEM_LINE_HEIGHT;
    }

    currentY += PADDING;
  }

  return {
    width: maxWidth,
    height: currentY,
  };
}

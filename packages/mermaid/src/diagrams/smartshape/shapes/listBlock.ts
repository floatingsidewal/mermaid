// cspell:ignore smartshape
import type { SmartShapeItem, SmartShapeConfig } from '../smartshapeTypes.js';
import type { ShapeRenderResult } from '../smartshapeRenderer.js';

const LABEL_WIDTH = 120;
const MIN_ROW_HEIGHT = 60;
const ITEM_LINE_HEIGHT = 24;
const PADDING = 10;
const BULLET_RADIUS = 4;
const GAP = 5;

/**
 * Renders list-block shape: Two-column layout with label + detail boxes
 */
export function renderListBlock(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  items: SmartShapeItem[],
  _config: SmartShapeConfig
): ShapeRenderResult {
  let currentY = PADDING;
  const totalWidth = 400; // Fixed width
  const detailWidth = totalWidth - LABEL_WIDTH - GAP - PADDING * 2;

  for (const item of items) {
    // Calculate row height based on content
    const subItemCount = item.children.length || 1;
    const rowHeight = Math.max(MIN_ROW_HEIGHT, subItemCount * ITEM_LINE_HEIGHT + PADDING * 2);

    const rowGroup = svg.append('g').attr('transform', `translate(${PADDING}, ${currentY})`);

    // Label block (left)
    rowGroup
      .append('rect')
      .attr('class', 'smartshape-label-bg')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', LABEL_WIDTH)
      .attr('height', rowHeight);

    // Label text (centered)
    rowGroup
      .append('text')
      .attr('class', 'smartshape-label')
      .attr('x', LABEL_WIDTH / 2)
      .attr('y', rowHeight / 2 + 5)
      .attr('text-anchor', 'middle')
      .text(item.text);

    // Detail block (right)
    rowGroup
      .append('rect')
      .attr('class', 'smartshape-detail')
      .attr('x', LABEL_WIDTH + GAP)
      .attr('y', 0)
      .attr('width', detailWidth)
      .attr('height', rowHeight);

    // Sub-items as bullets
    let bulletY = PADDING + ITEM_LINE_HEIGHT / 2;
    for (const child of item.children) {
      // Bullet point
      rowGroup
        .append('circle')
        .attr('class', 'smartshape-bullet')
        .attr('cx', LABEL_WIDTH + GAP + PADDING + BULLET_RADIUS)
        .attr('cy', bulletY)
        .attr('r', BULLET_RADIUS);

      // Bullet text
      rowGroup
        .append('text')
        .attr('class', 'smartshape-detail-text')
        .attr('x', LABEL_WIDTH + GAP + PADDING + BULLET_RADIUS * 4)
        .attr('y', bulletY + 5)
        .text(child.text);

      bulletY += ITEM_LINE_HEIGHT;
    }

    // If no children, show a placeholder or just the main text
    if (item.children.length === 0) {
      rowGroup
        .append('text')
        .attr('class', 'smartshape-detail-text')
        .attr('x', LABEL_WIDTH + GAP + PADDING)
        .attr('y', rowHeight / 2 + 5)
        .text('');
    }

    currentY += rowHeight + GAP;
  }

  return {
    width: totalWidth,
    height: currentY,
  };
}

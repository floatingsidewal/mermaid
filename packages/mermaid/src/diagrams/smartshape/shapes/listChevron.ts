// cspell:ignore smartshape
import type { SmartShapeItem, SmartShapeConfig } from '../smartshapeTypes.js';
import type { ShapeRenderResult } from '../smartshapeRenderer.js';

const CHEVRON_WIDTH = 100;
const MIN_ROW_HEIGHT = 80;
const ITEM_LINE_HEIGHT = 24;
const PADDING = 10;
const BULLET_RADIUS = 4;
const GAP = 5;
const CHEVRON_POINT_HEIGHT = 20;

/**
 * Creates a chevron/arrow path pointing down
 */
function createChevronPath(width: number, height: number, pointHeight: number): string {
  const halfWidth = width / 2;
  return `
    M 0 0
    L ${width} 0
    L ${width} ${height - pointHeight}
    L ${halfWidth} ${height}
    L 0 ${height - pointHeight}
    Z
  `;
}

/**
 * Renders list-chevron shape: Vertical chevrons with detail boxes
 */
export function renderListChevron(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  items: SmartShapeItem[],
  _config: SmartShapeConfig
): ShapeRenderResult {
  let currentY = PADDING;
  const totalWidth = 400;
  const detailWidth = totalWidth - CHEVRON_WIDTH - GAP - PADDING * 2;

  for (const item of items) {
    // Calculate row height based on content
    const subItemCount = item.children.length || 1;
    const rowHeight = Math.max(MIN_ROW_HEIGHT, subItemCount * ITEM_LINE_HEIGHT + PADDING * 2);

    const rowGroup = svg.append('g').attr('transform', `translate(${PADDING}, ${currentY})`);

    // Chevron shape (left)
    const chevronPath = createChevronPath(CHEVRON_WIDTH, rowHeight, CHEVRON_POINT_HEIGHT);
    rowGroup.append('path').attr('class', 'smartshape-chevron').attr('d', chevronPath);

    // Chevron label (centered)
    rowGroup
      .append('text')
      .attr('class', 'smartshape-label')
      .attr('x', CHEVRON_WIDTH / 2)
      .attr('y', (rowHeight - CHEVRON_POINT_HEIGHT) / 2 + 5)
      .attr('text-anchor', 'middle')
      .text(item.text);

    // Detail block (right)
    rowGroup
      .append('rect')
      .attr('class', 'smartshape-detail')
      .attr('x', CHEVRON_WIDTH + GAP)
      .attr('y', 0)
      .attr('width', detailWidth)
      .attr('height', rowHeight - CHEVRON_POINT_HEIGHT / 2);

    // Sub-items as bullets
    let bulletY = PADDING + ITEM_LINE_HEIGHT / 2;
    for (const child of item.children) {
      // Bullet point
      rowGroup
        .append('circle')
        .attr('class', 'smartshape-bullet')
        .attr('cx', CHEVRON_WIDTH + GAP + PADDING + BULLET_RADIUS)
        .attr('cy', bulletY)
        .attr('r', BULLET_RADIUS);

      // Bullet text
      rowGroup
        .append('text')
        .attr('class', 'smartshape-detail-text')
        .attr('x', CHEVRON_WIDTH + GAP + PADDING + BULLET_RADIUS * 4)
        .attr('y', bulletY + 5)
        .text(child.text);

      bulletY += ITEM_LINE_HEIGHT;
    }

    // Overlap adjustment for next chevron
    currentY += rowHeight - CHEVRON_POINT_HEIGHT / 2 + GAP;
  }

  return {
    width: totalWidth,
    height: currentY + CHEVRON_POINT_HEIGHT,
  };
}

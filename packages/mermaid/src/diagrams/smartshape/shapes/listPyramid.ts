// cspell:ignore smartshape
import type { SmartShapeItem, SmartShapeConfig } from '../smartshapeTypes.js';
import type { ShapeRenderResult } from '../smartshapeRenderer.js';

const PYRAMID_WIDTH = 300;
const PYRAMID_HEIGHT = 400;
const TEXT_BOX_PADDING = 10;
const ITEM_LINE_HEIGHT = 24;
const BULLET_RADIUS = 4;
const GAP = 10;

/**
 * Creates a triangle/pyramid path
 */
function createPyramidPath(width: number, height: number): string {
  const halfWidth = width / 2;
  return `
    M ${halfWidth} 0
    L ${width} ${height}
    L 0 ${height}
    Z
  `;
}

/**
 * Renders list-pyramid shape: Triangle with text boxes on the right
 */
export function renderListPyramid(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  items: SmartShapeItem[],
  _config: SmartShapeConfig
): ShapeRenderResult {
  const itemCount = items.length || 1;
  const bandHeight = PYRAMID_HEIGHT / itemCount;
  const textBoxStartX = PYRAMID_WIDTH / 2 + GAP;
  const maxTextBoxWidth = PYRAMID_WIDTH / 2 + 100;

  // Draw pyramid background
  const pyramidPath = createPyramidPath(PYRAMID_WIDTH, PYRAMID_HEIGHT);
  svg.append('path').attr('class', 'smartshape-pyramid').attr('d', pyramidPath);

  // Draw each band and text box
  for (const [i, item] of items.entries()) {
    const bandY = i * bandHeight;

    // Calculate text box width at this level (wider at bottom)
    const progressRatio = (i + 0.5) / itemCount;
    const pyramidWidthAtLevel = PYRAMID_WIDTH * progressRatio;
    const textBoxX = (PYRAMID_WIDTH - pyramidWidthAtLevel) / 2 + pyramidWidthAtLevel + GAP;
    const textBoxWidth = Math.min(maxTextBoxWidth, pyramidWidthAtLevel + 100);

    // Calculate text box height based on content
    const subItemCount = item.children.length || 1;
    const textBoxHeight = Math.max(
      bandHeight - GAP,
      subItemCount * ITEM_LINE_HEIGHT + TEXT_BOX_PADDING * 2
    );

    const rowGroup = svg.append('g').attr('transform', `translate(${textBoxX}, ${bandY})`);

    // Text box background
    rowGroup
      .append('rect')
      .attr('class', 'smartshape-detail')
      .attr('x', 0)
      .attr('y', GAP / 2)
      .attr('width', textBoxWidth)
      .attr('height', textBoxHeight)
      .attr('rx', 5)
      .attr('ry', 5)
      .style('stroke', '#333')
      .style('stroke-width', 1);

    // Main item text (bold header)
    rowGroup
      .append('text')
      .attr('class', 'smartshape-detail-text')
      .attr('x', TEXT_BOX_PADDING)
      .attr('y', GAP / 2 + TEXT_BOX_PADDING + 14)
      .style('font-weight', 'bold')
      .text(item.text);

    // Sub-items as bullets
    let bulletY = GAP / 2 + TEXT_BOX_PADDING + ITEM_LINE_HEIGHT + 10;
    for (const child of item.children) {
      // Bullet point
      rowGroup
        .append('circle')
        .attr('class', 'smartshape-bullet')
        .attr('cx', TEXT_BOX_PADDING + BULLET_RADIUS)
        .attr('cy', bulletY)
        .attr('r', BULLET_RADIUS);

      // Bullet text
      rowGroup
        .append('text')
        .attr('class', 'smartshape-detail-text')
        .attr('x', TEXT_BOX_PADDING + BULLET_RADIUS * 4)
        .attr('y', bulletY + 5)
        .text(child.text);

      bulletY += ITEM_LINE_HEIGHT;
    }
  }

  return {
    width: textBoxStartX + maxTextBoxWidth + GAP,
    height: PYRAMID_HEIGHT + GAP,
  };
}

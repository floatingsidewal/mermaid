import type { MermaidConfig, FunnelDiagramConfig } from '../../config.type.js';
import { getConfig } from '../../diagram-api/diagramAPI.js';
import type { DrawDefinition, SVG, SVGGroup } from '../../diagram-api/types.js';
import { log } from '../../logger.js';
import { selectSvgElement } from '../../rendering-util/selectSvgElement.js';
import { configureSvgSize } from '../../setupGraphViewbox.js';
import { cleanAndMerge } from '../../utils.js';
import type { FunnelSection, FunnelDB, Sections } from './funnelTypes.js';

/**
 * Draws a Funnel Chart with the given data.
 *
 * @param text - funnel chart code
 * @param id - diagram id
 * @param _version - MermaidJS version from package.json
 * @param diagObj - A standard diagram containing the DB and the text and type etc of the diagram
 */
export const draw: DrawDefinition = (text, id, _version, diagObj) => {
  log.debug('rendering funnel chart\n' + text);
  const db = diagObj.db as FunnelDB;
  const globalConfig: MermaidConfig = getConfig();
  const funnelConfig: Required<FunnelDiagramConfig> = cleanAndMerge(
    db.getConfig(),
    globalConfig.funnel
  );

  const MARGIN = 40;
  const LEGEND_RECT_SIZE = 18;
  const LEGEND_SPACING = 4;
  const STAGE_SPACING = 10;
  const NOTE_HORIZONTAL_OFFSET = 250;
  const NOTE_MIN_WIDTH = 150;
  const NOTE_MAX_WIDTH = 300;
  const NOTE_PADDING = 12;
  const height = 600;
  const funnelWidth = 500;

  // Helper function to estimate text width
  const estimateTextWidth = (text: string, fontSize = 0.85): number => {
    // Rough estimate: 7 pixels per character for 0.85em, scale for other sizes
    return text.length * 7 * (fontSize / 0.85);
  };

  const svg: SVG = selectSvgElement(id);
  const group: SVGGroup = svg.append('g');
  group.attr('transform', `translate(${MARGIN}, ${MARGIN})`);

  const { themeVariables } = globalConfig;
  const sections: Sections = db.getSections();
  const sectionsArray: FunnelSection[] = [...sections.entries()].map(([label, data]) => ({
    label,
    value: data.value,
    description: data.description,
    color: data.color,
    customNumber: data.customNumber,
  }));

  if (sectionsArray.length === 0) {
    return;
  }

  // Calculate dimensions
  const maxValue = Math.max(...sectionsArray.map((s) => s.value));
  const stageHeight =
    (height - MARGIN * 2 - STAGE_SPACING * (sectionsArray.length - 1)) / sectionsArray.length;

  // Color scale
  const myGeneratedColors = [
    themeVariables.funnel1,
    themeVariables.funnel2,
    themeVariables.funnel3,
    themeVariables.funnel4,
    themeVariables.funnel5,
    themeVariables.funnel6,
    themeVariables.funnel7,
    themeVariables.funnel8,
    themeVariables.funnel9,
    themeVariables.funnel10,
    themeVariables.funnel11,
    themeVariables.funnel12,
  ];

  // Draw funnel stages with colors, numbers, and notes
  let currentY = 0;
  let maxNoteWidth = 0;

  sectionsArray.forEach((section, index) => {
    const topWidth = (section.value / maxValue) * funnelWidth;
    const nextValue =
      index < sectionsArray.length - 1 ? sectionsArray[index + 1].value : section.value;
    const bottomWidth = (nextValue / maxValue) * funnelWidth;

    // Calculate trapezoid points (centered)
    const topLeft = (funnelWidth - topWidth) / 2;
    const topRight = topLeft + topWidth;
    const bottomLeft = (funnelWidth - bottomWidth) / 2;
    const bottomRight = bottomLeft + bottomWidth;

    const points = `${topLeft},${currentY} ${topRight},${currentY} ${bottomRight},${currentY + stageHeight} ${bottomLeft},${currentY + stageHeight}`;

    // Use custom color if provided, otherwise use theme color
    const stageColor = section.color ?? myGeneratedColors[index % myGeneratedColors.length];

    // Draw the stage
    group
      .append('polygon')
      .attr('points', points)
      .attr('fill', stageColor)
      .attr('class', 'funnelStage');

    // Add stage number (auto-generated or custom)
    const stageNumber =
      section.customNumber ?? (db.getAutoNumbering() ? String(index + 1).padStart(2, '0') : '');
    if (stageNumber) {
      group
        .append('text')
        .text(stageNumber)
        .attr('x', funnelWidth / 2)
        .attr('y', currentY + stageHeight / 4)
        .attr('dy', '0.35em')
        .attr('class', 'funnelStageNumber')
        .style('fill', 'white')
        .style('font-weight', '600')
        .style('font-size', '1.2em');
    }

    // Add label
    const labelY = currentY + stageHeight / 2;
    group
      .append('text')
      .text(section.label)
      .attr('x', funnelWidth / 2)
      .attr('y', labelY)
      .attr('dy', '0.35em')
      .attr('class', 'funnelLabel');

    // Add value if showData is enabled
    if (db.getShowData()) {
      group
        .append('text')
        .text(`${section.value}`)
        .attr('x', funnelWidth / 2)
        .attr('y', labelY + 20)
        .attr('dy', '0.35em')
        .attr('class', 'funnelLabel')
        .style('font-size', '0.9em');
    }

    // Add note if description exists
    if (section.description && section.description.length > 0) {
      const notePosition = index % 2 === 0 ? 'left' : 'right';

      // Calculate note width based on content first
      const headerText = `${db.getStageName()} ${index + 1}`;
      const headerWidth = estimateTextWidth(headerText, 0.95);
      const maxLineWidth = Math.max(
        headerWidth,
        ...section.description.map((line) => estimateTextWidth(line, 0.85))
      );
      const noteWidth = Math.min(
        Math.max(maxLineWidth + NOTE_PADDING * 2, NOTE_MIN_WIDTH),
        NOTE_MAX_WIDTH
      );

      const noteY = currentY + stageHeight / 2;

      // Position note boxes:
      // - Left: right edge at fixed offset, extends leftward
      // - Right: left edge at fixed offset, extends rightward
      const noteBgX =
        notePosition === 'left'
          ? -NOTE_HORIZONTAL_OFFSET - noteWidth
          : funnelWidth + NOTE_HORIZONTAL_OFFSET;

      // Create note group
      const noteGroup = group.append('g').attr('class', 'funnelNote');

      // Add connector line
      const connectorStartX = notePosition === 'left' ? topLeft : topRight;
      const connectorEndX =
        notePosition === 'left'
          ? noteBgX + noteWidth // Right edge of left box
          : noteBgX; // Left edge of right box

      noteGroup
        .append('line')
        .attr('x1', connectorStartX)
        .attr('y1', noteY)
        .attr('x2', connectorEndX)
        .attr('y2', noteY)
        .attr('stroke', themeVariables.lineColor ?? '#999')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4')
        .attr('class', 'funnelNoteConnector');

      // Calculate note background dimensions
      const noteLineHeight = 18;
      const noteHeaderHeight = 24;
      const noteHeight =
        noteHeaderHeight + section.description.length * noteLineHeight + NOTE_PADDING * 2 + 20;

      // Add note background
      noteGroup
        .append('rect')
        .attr('x', noteBgX)
        .attr('y', noteY - noteHeight / 2)
        .attr('width', noteWidth)
        .attr('height', noteHeight)
        .attr('rx', 6)
        .attr('fill', themeVariables.noteBkg ?? '#f9f9f9')
        .attr('stroke', themeVariables.noteBorderColor ?? '#ddd')
        .attr('stroke-width', 1)
        .attr('class', 'funnelNoteBackground');

      // Add note header (e.g., "Stage N", "Phase N", "Step N")
      noteGroup
        .append('text')
        .text(headerText)
        .attr('x', noteBgX + NOTE_PADDING)
        .attr('y', noteY - noteHeight / 2 + NOTE_PADDING + 12)
        .attr('text-anchor', 'start')
        .attr('class', 'funnelNoteHeader')
        .style('font-weight', 'bold')
        .style('font-size', '0.95em')
        .style('fill', themeVariables.textColor ?? '#333');

      // Add description lines
      section.description.forEach((line, lineIndex) => {
        noteGroup
          .append('text')
          .text(line)
          .attr('x', noteBgX + NOTE_PADDING)
          .attr(
            'y',
            noteY -
              noteHeight / 2 +
              NOTE_PADDING +
              noteHeaderHeight +
              lineIndex * noteLineHeight +
              12
          )
          .attr('text-anchor', 'start')
          .attr('class', 'funnelNoteText')
          .style('font-size', '0.85em')
          .style('fill', themeVariables.textColor ?? '#666');
      });

      maxNoteWidth = Math.max(maxNoteWidth, noteWidth);
    }

    currentY += stageHeight + STAGE_SPACING;
  });

  // Add title
  if (db.getDiagramTitle()) {
    group
      .append('text')
      .text(db.getDiagramTitle())
      .attr('x', funnelWidth / 2)
      .attr('y', -20)
      .attr('class', 'funnelTitleText');
  }

  // Add legend
  const legend = group
    .selectAll('.funnelLegend')
    .data(sectionsArray)
    .enter()
    .append('g')
    .attr('class', 'funnelLegend')
    .attr('transform', (_datum, index: number): string => {
      const legendHeight = LEGEND_RECT_SIZE + LEGEND_SPACING;
      const offset = (legendHeight * sectionsArray.length) / 2;
      const horizontal = funnelWidth + 20;
      const vertical = index * legendHeight - offset + height / 2;
      return `translate(${horizontal}, ${vertical})`;
    });

  legend
    .append('rect')
    .attr('width', LEGEND_RECT_SIZE)
    .attr('height', LEGEND_RECT_SIZE)
    .style('fill', (_d, i) => myGeneratedColors[i % myGeneratedColors.length])
    .style('stroke', (_d, i) => myGeneratedColors[i % myGeneratedColors.length]);

  legend
    .append('text')
    .attr('x', LEGEND_RECT_SIZE + LEGEND_SPACING)
    .attr('y', LEGEND_RECT_SIZE - LEGEND_SPACING)
    .text((d) => {
      if (db.getShowData()) {
        return `${d.label} [${d.value}]`;
      }
      return d.label;
    });

  const longestTextWidth = Math.max(
    ...legend
      .selectAll('text')
      .nodes()
      .map((node) => (node as Element)?.getBoundingClientRect().width ?? 0)
  );

  // Calculate total width including notes on both sides
  const noteSpace = maxNoteWidth > 0 ? NOTE_HORIZONTAL_OFFSET + maxNoteWidth : 0;
  const totalWidth =
    noteSpace + // left notes
    funnelWidth +
    noteSpace + // right notes
    MARGIN * 2 +
    LEGEND_RECT_SIZE +
    LEGEND_SPACING +
    longestTextWidth +
    20; // legend
  const totalHeight = height + MARGIN * 2;

  // Adjust group transform to account for left notes
  if (maxNoteWidth > 0) {
    group.attr('transform', `translate(${MARGIN + noteSpace}, ${MARGIN})`);
  }

  // Set viewBox
  svg.attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
  configureSvgSize(svg, totalHeight, totalWidth, funnelConfig.useMaxWidth);
};

export const renderer = { draw };

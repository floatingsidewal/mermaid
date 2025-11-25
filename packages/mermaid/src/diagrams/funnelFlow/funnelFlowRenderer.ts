import type { MermaidConfig, FunnelDiagramConfig } from '../../config.type.js';
import { getConfig } from '../../diagram-api/diagramAPI.js';
import type { DrawDefinition, SVG, SVGGroup } from '../../diagram-api/types.js';
import { log } from '../../logger.js';
import { selectSvgElement } from '../../rendering-util/selectSvgElement.js';
import { configureSvgSize } from '../../setupGraphViewbox.js';
import { cleanAndMerge } from '../../utils.js';
import type { FunnelFlowStage, FunnelFlowDB, Stages } from './funnelFlowTypes.js';
import { darken, lighten } from 'khroma';

/**
 * Draws a FunnelFlow Chart with the given data.
 *
 * @param text - funnelFlow chart code
 * @param id - diagram id
 * @param _version - MermaidJS version from package.json
 * @param diagObj - A standard diagram containing the DB and the text and type etc of the diagram
 */
export const draw: DrawDefinition = (text, id, _version, diagObj) => {
  log.debug('rendering funnelFlow chart\n' + text);
  const db = diagObj.db as FunnelFlowDB;
  const globalConfig: MermaidConfig = getConfig();
  const funnelConfig: Required<FunnelDiagramConfig> = cleanAndMerge(
    db.getConfig(),
    globalConfig.funnel
  );

  const MARGIN = 40;
  const LEGEND_RECT_SIZE = 16;
  const LEGEND_SPACING = 4;
  const STAGE_OVERLAP = 5;
  const NOTE_HORIZONTAL_OFFSET = 250;
  const NOTE_MIN_WIDTH = 150;
  const NOTE_MAX_WIDTH = 300;
  const NOTE_PADDING = 12;
  const CORNER_RADIUS = 8;
  const LEGEND_ITEMS_PER_ROW = 2;
  const LEGEND_ITEM_WIDTH = 200;
  const LEGEND_ROW_HEIGHT = 28;
  const height = 600;
  const funnelWidth = 500;

  const estimateTextWidth = (text: string, fontSize = 0.85): number => {
    return text.length * 7 * (fontSize / 0.85);
  };

  const buildRoundedTrapezoid = (
    topLeft: number,
    topRight: number,
    bottomLeft: number,
    bottomRight: number,
    y: number,
    stageHeight: number,
    radius: number
  ): string => {
    const r = Math.min(radius, stageHeight / 4, Math.abs(topRight - topLeft) / 4);
    return `
      M ${topLeft + r},${y}
      L ${topRight - r},${y}
      Q ${topRight},${y} ${topRight},${y + r}
      L ${bottomRight},${y + stageHeight - r}
      Q ${bottomRight},${y + stageHeight} ${bottomRight - r},${y + stageHeight}
      L ${bottomLeft + r},${y + stageHeight}
      Q ${bottomLeft},${y + stageHeight} ${bottomLeft},${y + stageHeight - r}
      L ${topLeft},${y + r}
      Q ${topLeft},${y} ${topLeft + r},${y}
      Z
    `
      .replace(/\s+/g, ' ')
      .trim();
  };

  const drawCurvedConnector = (
    noteGroup: SVGGroup,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    side: 'left' | 'right',
    color: string
  ): void => {
    const controlOffset = Math.abs(endX - startX) * 0.4;
    const path =
      side === 'left'
        ? `M ${startX},${startY} Q ${startX - controlOffset},${startY} ${endX},${endY}`
        : `M ${startX},${startY} Q ${startX + controlOffset},${startY} ${endX},${endY}`;

    noteGroup
      .append('path')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,4')
      .attr('class', 'funnelNoteConnector');
  };

  const svg: SVG = selectSvgElement(id);
  const { themeVariables } = globalConfig;

  const defs = svg.append('defs');

  const shadowFilter = defs
    .append('filter')
    .attr('id', 'funnelDropShadow')
    .attr('x', '-20%')
    .attr('y', '-20%')
    .attr('width', '150%')
    .attr('height', '150%');

  shadowFilter
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 3)
    .attr('stdDeviation', 4)
    .attr('flood-color', 'rgba(0,0,0,0.25)');

  const noteShadowFilter = defs
    .append('filter')
    .attr('id', 'funnelNoteShadow')
    .attr('x', '-10%')
    .attr('y', '-10%')
    .attr('width', '130%')
    .attr('height', '130%');

  noteShadowFilter
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 2)
    .attr('stdDeviation', 3)
    .attr('flood-color', 'rgba(0,0,0,0.12)');

  const group: SVGGroup = svg.append('g');
  group.attr('transform', `translate(${MARGIN}, ${MARGIN})`);

  const stages: Stages = db.getStages();
  // Convert to array with id included, using label || id for display
  const stagesArray: FunnelFlowStage[] = [...stages.entries()].map(([id, data]) => ({
    id,
    label: data.label,
    value: data.value,
    description: data.description,
    color: data.color,
    customNumber: data.customNumber,
  }));

  if (stagesArray.length === 0) {
    return;
  }

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

  stagesArray.forEach((stage, index) => {
    const baseColor = stage.color ?? myGeneratedColors[index % myGeneratedColors.length];
    const gradient = defs
      .append('linearGradient')
      .attr('id', `funnelGradient-${index}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', lighten(baseColor, 12));
    gradient.append('stop').attr('offset', '100%').attr('stop-color', darken(baseColor, 12));
  });

  const maxValue = Math.max(...stagesArray.map((s) => s.value));
  const minValue = Math.min(...stagesArray.map((s) => s.value));
  const totalOverlap = STAGE_OVERLAP * (stagesArray.length - 1);
  const stageHeight = (height - MARGIN * 2 + totalOverlap) / stagesArray.length;

  const MIN_STAGE_PADDING = 40;
  const maxLabelWidth = Math.max(
    ...stagesArray.map((stage) => estimateTextWidth(stage.label ?? stage.id, 1.0))
  );
  const minStageWidth = Math.max(maxLabelWidth + MIN_STAGE_PADDING * 2, 120);

  const useTrueScale = db.getTrueScale();
  const TAPER_PERCENT = 0.12;

  const calculateWidth = (value: number, stageIndex: number): number => {
    if (useTrueScale) {
      if (maxValue === minValue) {
        return funnelWidth;
      }
      const valueRatio = (value - minValue) / (maxValue - minValue);
      return minStageWidth + valueRatio * (funnelWidth - minStageWidth);
    } else {
      const taperAmount = funnelWidth * TAPER_PERCENT * stageIndex;
      const width = funnelWidth - taperAmount;
      return Math.max(width, minStageWidth);
    }
  };

  interface StagePosition {
    y: number;
    topWidth: number;
    bottomWidth: number;
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  }

  const stagePositions: StagePosition[] = [];
  let currentY = 0;
  let maxNoteWidth = 0;

  stagesArray.forEach((stage, index) => {
    const topWidth = calculateWidth(stage.value, index);

    const nextIndex = index + 1;
    const nextValue = index < stagesArray.length - 1 ? stagesArray[nextIndex].value : stage.value;
    const bottomWidth = calculateWidth(nextValue, nextIndex);

    const topLeft = (funnelWidth - topWidth) / 2;
    const topRight = topLeft + topWidth;
    const bottomLeft = (funnelWidth - bottomWidth) / 2;
    const bottomRight = bottomLeft + bottomWidth;

    stagePositions.push({
      y: currentY,
      topWidth,
      bottomWidth,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    });

    currentY += stageHeight - STAGE_OVERLAP;
  });

  [...stagesArray].reverse().forEach((_, reverseIndex) => {
    const index = stagesArray.length - 1 - reverseIndex;
    const pos = stagePositions[index];

    group
      .append('path')
      .attr(
        'd',
        buildRoundedTrapezoid(
          pos.topLeft,
          pos.topRight,
          pos.bottomLeft,
          pos.bottomRight,
          pos.y,
          stageHeight,
          CORNER_RADIUS
        )
      )
      .attr('fill', `url(#funnelGradient-${index})`)
      .attr('filter', 'url(#funnelDropShadow)')
      .attr('class', 'funnelStage');
  });

  stagesArray.forEach((stage, index) => {
    const pos = stagePositions[index];

    // Stage number (auto-generated or custom)
    const stageNumber = stage.customNumber ?? String(index + 1).padStart(2, '0');
    if (stageNumber) {
      group
        .append('rect')
        .attr('x', funnelWidth / 2 - 18)
        .attr('y', pos.y + stageHeight * 0.2 - 10)
        .attr('width', 36)
        .attr('height', 20)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('fill', 'rgba(255,255,255,0.2)')
        .attr('class', 'funnelStageBadge');

      group
        .append('text')
        .text(stageNumber)
        .attr('x', funnelWidth / 2)
        .attr('y', pos.y + stageHeight * 0.2)
        .attr('dy', '0.35em')
        .attr('class', 'funnelStageNumber');
    }

    // Use label if provided, otherwise use id
    const labelY = pos.y + stageHeight * 0.5;
    const labelText = stage.label ?? stage.id;
    const labelWidth = estimateTextWidth(labelText, 1.0);

    const labelRatio = 0.5;
    const stageWidthAtLabel = pos.topWidth + (pos.bottomWidth - pos.topWidth) * labelRatio;
    const labelOverflows = labelWidth > stageWidthAtLabel - 20;

    if (labelOverflows) {
      const pillPadding = 12;
      const pillWidth = labelWidth + pillPadding * 2;
      const pillHeight = db.getShowData() ? 48 : 28;
      const pillY = labelY - (db.getShowData() ? 8 : 14);

      group
        .append('rect')
        .attr('x', funnelWidth / 2 - pillWidth / 2)
        .attr('y', pillY)
        .attr('width', pillWidth)
        .attr('height', pillHeight)
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('fill', 'rgba(0, 0, 0, 0.35)')
        .attr('class', 'funnelLabelBackground');
    }

    group
      .append('text')
      .text(labelText)
      .attr('x', funnelWidth / 2)
      .attr('y', labelY)
      .attr('dy', '0.35em')
      .attr('class', 'funnelLabel');

    if (db.getShowData()) {
      group
        .append('text')
        .text(`${stage.value}`)
        .attr('x', funnelWidth / 2)
        .attr('y', labelY + 22)
        .attr('dy', '0.35em')
        .attr('class', 'funnelValue');
    }

    if (stage.description && stage.description.length > 0) {
      const notePosition: 'left' | 'right' = index % 2 === 0 ? 'left' : 'right';

      const headerText = `Stage ${index + 1}`;
      const headerWidth = estimateTextWidth(headerText, 0.95);
      const maxLineWidth = Math.max(
        headerWidth,
        ...stage.description.map((line) => estimateTextWidth(line, 0.85))
      );
      const noteWidth = Math.min(
        Math.max(maxLineWidth + NOTE_PADDING * 2, NOTE_MIN_WIDTH),
        NOTE_MAX_WIDTH
      );

      const noteY = pos.y + stageHeight / 2;

      const noteBgX =
        notePosition === 'left'
          ? -NOTE_HORIZONTAL_OFFSET - noteWidth
          : funnelWidth + NOTE_HORIZONTAL_OFFSET;

      const noteGroup = group.append('g').attr('class', 'funnelNote');

      const connectorStartX = notePosition === 'left' ? pos.topLeft : pos.topRight;
      const connectorEndX = notePosition === 'left' ? noteBgX + noteWidth : noteBgX;

      drawCurvedConnector(
        noteGroup,
        connectorStartX,
        noteY,
        connectorEndX,
        noteY,
        notePosition,
        themeVariables.lineColor ?? '#999'
      );

      const noteLineHeight = 18;
      const noteHeaderHeight = 24;
      const noteHeight =
        noteHeaderHeight + stage.description.length * noteLineHeight + NOTE_PADDING * 2 + 20;

      noteGroup
        .append('rect')
        .attr('x', noteBgX)
        .attr('y', noteY - noteHeight / 2)
        .attr('width', noteWidth)
        .attr('height', noteHeight)
        .attr('rx', 8)
        .attr('fill', themeVariables.noteBkg ?? '#f9f9f9')
        .attr('stroke', themeVariables.noteBorderColor ?? '#e0e0e0')
        .attr('stroke-width', 1)
        .attr('filter', 'url(#funnelNoteShadow)')
        .attr('class', 'funnelNoteBackground');

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

      stage.description.forEach((line, lineIndex) => {
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
  });

  if (db.getDiagramTitle()) {
    group
      .append('text')
      .text(db.getDiagramTitle())
      .attr('x', funnelWidth / 2)
      .attr('y', -20)
      .attr('class', 'funnelTitleText');
  }

  const actualFunnelHeight =
    stagesArray.length * stageHeight - (stagesArray.length - 1) * STAGE_OVERLAP;

  const legendStartY = actualFunnelHeight + 50;
  const numLegendRows = Math.ceil(stagesArray.length / LEGEND_ITEMS_PER_ROW);
  const totalLegendHeight = numLegendRows * LEGEND_ROW_HEIGHT;

  const legend = group
    .selectAll('.funnelLegend')
    .data(stagesArray)
    .enter()
    .append('g')
    .attr('class', 'funnelLegend')
    .attr('transform', (_datum, index: number): string => {
      const row = Math.floor(index / LEGEND_ITEMS_PER_ROW);
      const col = index % LEGEND_ITEMS_PER_ROW;
      const itemsInCurrentRow = Math.min(
        stagesArray.length - row * LEGEND_ITEMS_PER_ROW,
        LEGEND_ITEMS_PER_ROW
      );
      const rowWidth = itemsInCurrentRow * LEGEND_ITEM_WIDTH;
      const startX = (funnelWidth - rowWidth) / 2;
      return `translate(${startX + col * LEGEND_ITEM_WIDTH}, ${legendStartY + row * LEGEND_ROW_HEIGHT})`;
    });

  legend
    .append('rect')
    .attr('width', LEGEND_RECT_SIZE)
    .attr('height', LEGEND_RECT_SIZE)
    .attr('rx', 4)
    .attr('ry', 4)
    .style('fill', (_d, i) => `url(#funnelGradient-${i})`);

  legend
    .append('text')
    .attr('x', LEGEND_RECT_SIZE + LEGEND_SPACING + 4)
    .attr('y', LEGEND_RECT_SIZE - LEGEND_SPACING)
    .text((d) => {
      const displayLabel = d.label ?? d.id;
      if (db.getShowData()) {
        return `${displayLabel} [${d.value}]`;
      }
      return displayLabel;
    });

  const noteSpace = maxNoteWidth > 0 ? NOTE_HORIZONTAL_OFFSET + maxNoteWidth : 0;
  const legendWidth = Math.min(stagesArray.length, LEGEND_ITEMS_PER_ROW) * LEGEND_ITEM_WIDTH;
  const contentWidth = Math.max(funnelWidth, legendWidth);
  const totalWidth = noteSpace + contentWidth + noteSpace + MARGIN * 2;
  const totalHeight = actualFunnelHeight + MARGIN * 2 + 60 + totalLegendHeight;

  if (maxNoteWidth > 0) {
    group.attr('transform', `translate(${MARGIN + noteSpace}, ${MARGIN})`);
  }

  svg.attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
  configureSvgSize(svg, totalHeight, totalWidth, funnelConfig.useMaxWidth);
};

export const renderer = { draw };

import type {
  DiagramDetector,
  DiagramLoader,
  ExternalDiagramDefinition,
} from '../../diagram-api/types.js';

const id = 'funnel';

const detector: DiagramDetector = (txt) => {
  return /^\s*funnel/.test(txt);
};

const loader: DiagramLoader = async () => {
  const { diagram } = await import('./funnelDiagram.js');
  return { id, diagram };
};

export const funnel: ExternalDiagramDefinition = {
  id,
  detector,
  loader,
};

import type {
  DiagramDetector,
  DiagramLoader,
  ExternalDiagramDefinition,
} from '../../diagram-api/types.js';

const id = 'funnelFlow';

const detector: DiagramDetector = (txt) => {
  return /^\s*funnelFlow/.test(txt);
};

const loader: DiagramLoader = async () => {
  const { diagram } = await import('./funnelFlowDiagram.js');
  return { id, diagram };
};

export const funnelFlow: ExternalDiagramDefinition = {
  id,
  detector,
  loader,
};

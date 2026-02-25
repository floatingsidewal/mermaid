import type {
  DiagramDetector,
  DiagramLoader,
  ExternalDiagramDefinition,
} from '../../diagram-api/types.js';

const id = 'smartshape';

const detector: DiagramDetector = (txt) => {
  return /^\s*smartshape/.test(txt);
};

const loader: DiagramLoader = async () => {
  const { diagram } = await import('./smartshapeDiagram.js');
  return { id, diagram };
};

export const smartshape: ExternalDiagramDefinition = {
  id,
  detector,
  loader,
};

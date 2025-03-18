import { ConnectionMode } from 'reactflow';
import { ObjectNode } from '../nodes/ObjectNode';

export const nodeTypes = {
  object: ObjectNode,
};

export const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: {
    stroke: '#4B5563',
    strokeWidth: 2,
  },
};

export const flowConfig = {
  fitView: false,
  minZoom: 0.1,
  maxZoom: 1.5,
  connectionMode: ConnectionMode.Loose,
  defaultViewport: { x: 0, y: 0, zoom: 0.85 },
  fitViewOptions: {
    padding: 0.3,
    includeHiddenNodes: false,
    duration: 400,
  },
  nodesDraggable: false,
  nodesConnectable: false,
  elementsSelectable: false,
};
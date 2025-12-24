import { Edge } from 'reactflow';
import { DataNode } from '../../types';

export const createEdges = (nodes: DataNode[]): Edge[] => {
  const edges: Edge[] = [];

  // Loop through nodes and create edges for those with a parent
  for (const node of nodes) {
    if (node.parent) {
      edges.push({
        id: `e-${node.parent}-${node.id}`,
        source: node.parent,
        target: node.id,
        type: 'smoothstep',
        style: {
          stroke: '#879AF8',
          strokeWidth: 1.5,
          strokeDasharray: '5 5',
        },
        animated: true,
      });
    }
  }

  return edges;
};
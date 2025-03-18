import { Edge } from 'reactflow';
import { DataNode } from '../../types';

export const createEdges = (nodes: DataNode[]): Edge[] => {
  return nodes
    .filter(node => node.parent)
    .map(node => ({
      id: `e-${node.parent}-${node.id}`,
      source: node.parent,
      target: node.id,
      type: 'smoothstep',
      style: { 
        stroke: '#94a3b8',
        strokeWidth: 1.5,
      },
      animated: false,
    }));
};
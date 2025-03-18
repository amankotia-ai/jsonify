import { DataNode, DataEdge } from '../types';

const VERTICAL_SPACING = 200;
const HORIZONTAL_SPACING = 400;

export const calculateNodePositions = (nodes: DataNode[]): DataNode[] => {
  // Find root node
  const rootNode = nodes.find(node => !node.parent);
  if (!rootNode) return nodes;

  const positioned = new Set<string>();
  const positions: { [key: string]: { x: number; y: number } } = {};

  // Position root node
  positions[rootNode.id] = { x: 0, y: 0 };
  positioned.add(rootNode.id);

  // Helper function to get child nodes
  const getChildren = (parentId: string) => 
    nodes.filter(node => node.parent === parentId);

  // Position nodes level by level
  const positionLevel = (parentId: string, level: number) => {
    const children = getChildren(parentId);
    const totalHeight = children.length * VERTICAL_SPACING;
    const startY = -(totalHeight / 2);

    children.forEach((child, index) => {
      if (!positioned.has(child.id)) {
        positions[child.id] = {
          x: level * HORIZONTAL_SPACING,
          y: startY + (index * VERTICAL_SPACING)
        };
        positioned.add(child.id);
        positionLevel(child.id, level + 1);
      }
    });
  };

  positionLevel(rootNode.id, 1);

  return nodes.map(node => ({
    ...node,
    position: positions[node.id] || { x: 0, y: 0 }
  }));
};

export const createEdges = (nodes: DataNode[]): DataEdge[] => {
  return nodes
    .filter(node => node.parent)
    .map(node => ({
      id: `${node.parent}-${node.id}`,
      source: node.parent!,
      target: node.id,
      type: 'smoothstep',
    }));
};
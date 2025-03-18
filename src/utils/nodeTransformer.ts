import { DataNode } from '../types';
import { SPACING } from './layout/constants';

interface FlowNode {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
}

export const transformToFlowNodes = (nodes: DataNode[]): FlowNode[] => {
  const flowNodes: FlowNode[] = [];
  const rootNode = nodes.find(node => !node.parent);
  if (!rootNode) return [];

  const getChildNodes = (nodeId: string) => nodes.filter(n => n.parent === nodeId);
  const getNestedObjects = (nodeId: string) => 
    nodes.filter(n => n.parent === nodeId && (n.type === 'object' || n.type === 'array'));

  const processNode = (node: DataNode, level: number, verticalOffset: number) => {
    const childObjects = getNestedObjects(node.id);
    const totalHeight = Math.max(
      node.properties.length * SPACING.PROPERTY,
      childObjects.length * SPACING.VERTICAL
    );

    // Add main node
    flowNodes.push({
      id: node.id,
      type: 'objectNode',
      data: {
        id: node.id,
        label: node.key,
        isArray: node.type === 'array',
        expanded: node.expanded,
        propertyCount: node.properties.length,
        childCount: childObjects.length,
      },
      position: {
        x: level * SPACING.HORIZONTAL,
        y: verticalOffset
      },
    });

    if (node.expanded !== false) {
      let currentY = verticalOffset - (totalHeight / 2);

      // Add property nodes
      node.properties.forEach((prop) => {
        flowNodes.push({
          id: `${node.id}-${prop.key}`,
          type: 'propertyNode',
          data: {
            property: prop,
            parentId: node.id,
          },
          position: {
            x: level * SPACING.HORIZONTAL + SPACING.HORIZONTAL * 0.75,
            y: currentY
          },
        });
        currentY += SPACING.PROPERTY;
      });

      // Process nested objects
      childObjects.forEach((child, index) => {
        const childOffset = verticalOffset + 
          (index - (childObjects.length - 1) / 2) * SPACING.VERTICAL;
        processNode(child, level + 1, childOffset);
      });
    }
  };

  // Start processing from root
  processNode(rootNode, 0, 0);
  return flowNodes;
};
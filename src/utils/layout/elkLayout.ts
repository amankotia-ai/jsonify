import ELK, { ElkNode } from 'elkjs/lib/elk.bundled.js';
import { DataNode as VisDataNode } from '../../types/nodes';
import { DataNode as EditorDataNode } from '../../types';
import { SPACING } from './constants';
import { Edge } from 'reactflow';

// Initialize ELK
const elk = new ELK();

type SupportedNode = VisDataNode | EditorDataNode;

// Constants copied from positioning.ts
const MAX_PROPS_PER_COLUMN = 5;

// Check if the node has properties array (visualization node)
const hasProperties = (node: SupportedNode): node is VisDataNode => {
    return 'properties' in node && Array.isArray((node as VisDataNode).properties);
};

// Helper function to get node width based on property count
const getNodeWidth = (node: SupportedNode): number => {
    if (!hasProperties(node)) {
        return SPACING.NODE_WIDTH;
    }

    // Root nodes should always use single column layout
    const isRootNode = !node.parent;
    if (isRootNode) {
        return SPACING.NODE_WIDTH;
    }

    // Get simple properties count
    const simplePropsCount = node.properties.filter(
        prop => typeof prop.value !== 'object' || prop.value === null
    ).length;

    // Calculate columns needed
    let colCount = Math.ceil(simplePropsCount / MAX_PROPS_PER_COLUMN);

    // Cap at 3 columns and use min 2 columns only if we have >= 10 props
    if (colCount > 2 && simplePropsCount < 10) {
        colCount = 2;
    }
    colCount = Math.min(colCount, 3);

    // Return appropriate width based on column count
    if (colCount === 1) {
        return SPACING.NODE_WIDTH;
    } else if (colCount === 2) {
        return SPACING.MULTI_COLUMN_WIDTH.TWO_COLUMNS;
    } else {
        return SPACING.MULTI_COLUMN_WIDTH.THREE_COLUMNS;
    }
};

// Helper function to estimate node height based on content
const estimateNodeHeight = (node: SupportedNode, allNodes: SupportedNode[]): number => {
    // Base height for node container (Header + Padding)
    // Header is approx 48px, Padding is approx 24px total
    let height = 72;

    // Check if node is collapsed (expanded === false)
    // Default to true if undefined
    const isExpanded = (node as any).expanded !== false;

    if (!isExpanded) {
        return 60; // Height for collapsed node (Header only)
    }

    if (hasProperties(node) && node.properties) {
        // Check if this is a root node - always use single column for root
        const isRootNode = !node.parent;

        // Get simple properties (non-object values)
        const simpleProperties = node.properties.filter(prop =>
            typeof prop.value !== 'object' || prop.value === null
        );

        // Get complex properties (object values)
        const complexProperties = node.properties.filter(prop =>
            typeof prop.value === 'object' && prop.value !== null
        );

        // Get child nodes info (links to other nodes)
        // These are visualized in the ObjectNode
        const childNodes = allNodes.filter(n => n.parent === node.id);

        // --- Calculate height for Simple Properties ---
        if (simpleProperties.length > 0) {
            // Calculate number of columns needed (force single column for root)
            // Logic matches ObjectNode.tsx
            const numColumns = isRootNode ? 1 : Math.min(
                Math.ceil(simpleProperties.length / MAX_PROPS_PER_COLUMN),
                simpleProperties.length >= 10 ? 3 : 2
            );

            // Calculate rows
            const propsPerColumn = Math.ceil(simpleProperties.length / numColumns);

            // Height per row (approx 36px with padding/margins) + Gap (4px)
            height += propsPerColumn * 40;

            // Add extra buffer layout
            if (numColumns > 1) {
                height += 10;
            }
        }

        // --- Calculate height for Child Nodes Info ---
        if (childNodes.length > 0) {
            // Add divider if we have simple props above
            if (simpleProperties.length > 0) {
                height += 17; // Divider height + margin
            }

            // Grid layout logic from ObjectNode.tsx
            // className={childNodesInfo.length > 2 ? "grid grid-cols-2 gap-2" : ""}
            const isGrid = childNodes.length > 2;
            const rows = isGrid ? Math.ceil(childNodes.length / 2) : childNodes.length;

            // Approx 32px per row + gap
            height += rows * 36;
        }

        // --- Calculate height for Complex Properties (NestedProperty) ---
        if (complexProperties.length > 0) {
            // Add divider if we have previous content
            if (simpleProperties.length > 0 || childNodes.length > 0) {
                height += 17; // Divider height + margin
            }

            // Each NestedProperty is approx 40px (header)
            // If expanded, it would be more, but usually they start collapsed or rely on recursive layout?
            // "expanded" state is in the store, not here. We assume collapsed state for initial layout
            // or we might need to check if we can access that state. 
            // For now, assume collapsed size per property + gap
            height += complexProperties.length * 40;
        }

        // Add extra height for properties with long string values
        for (const prop of node.properties) {
            if (prop.type === 'string' && typeof prop.value === 'string' && prop.value.length > 60) {
                height += 20; // Add a line for wrapped text
            }
        }
    }

    // Extra buffer for safety
    height += 20;

    return height;
};

export type LayoutedNode = SupportedNode & { position: { x: number; y: number } };

export const getLayoutedElements = async (nodes: SupportedNode[], edges: Edge[]): Promise<{ nodes: LayoutedNode[], edges: Edge[] }> => {
    const isHorizontal = true; // Use horizontal layout

    // Convert nodes to ELK format
    const elkNodes: ElkNode[] = nodes.map((node) => ({
        id: node.id,
        width: getNodeWidth(node),
        height: estimateNodeHeight(node, nodes),
        // Pass original data for later reconstruction if needed
        labels: [{ text: node.key }] // Just for debugging/logging
    }));

    // Convert edges to ELK format
    const elkEdges = edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target]
    }));

    // Build the graph
    const graph: ElkNode = {
        id: 'root',
        layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.direction': isHorizontal ? 'RIGHT' : 'DOWN',
            'nodePlacement.strategy': 'SIMPLE',
            'elk.spacing.nodeNode': '80', // Horizontal spacing
            'elk.layered.spacing.nodeNodeBetweenLayers': '100', // Vertical spacing between layers
            // 'elk.padding': '[top=50,left=50,bottom=50,right=50]',
        },
        children: elkNodes,
        edges: elkEdges as any // Type assertion to bypass ElkEdge/ElkExtendedEdge mismatch
    };

    try {
        const layoutedGraph = await elk.layout(graph);

        // Map positions back
        const layoutedNodes: LayoutedNode[] = nodes.map((node) => {
            const elkNode = layoutedGraph.children?.find((n) => n.id === node.id);

            if (elkNode) {
                return {
                    ...node,
                    position: {
                        x: elkNode.x || 0,
                        y: elkNode.y || 0,
                    },
                };
            }
            return {
                ...node,
                position: { x: 0, y: 0 }
            };
        });

        return { nodes: layoutedNodes, edges };
    } catch (error) {
        console.error('ELK Layout Error:', error);
        // Return with default positions if layout fails
        const fallbackNodes: LayoutedNode[] = nodes.map(node => ({
            ...node,
            position: { x: 0, y: 0 }
        }));
        return { nodes: fallbackNodes, edges };
    }
};

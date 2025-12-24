import React, { useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataNodeProps } from './NodeTypes';
import { useEditorStore } from '../../store/editorStore';
import { PropertyRow } from './PropertyRow';
import { NestedProperty } from './NestedProperty';
import { TypeBadge } from './TypeBadge';
import { DataNode as VisDataNode, Property } from '../../types/nodes';
import { SPACING } from '../../utils/layout/constants';

// The maximum number of properties to display in a single column
const MAX_PROPS_PER_COLUMN = 5;
// The threshold for when to start using 3 columns
const THREE_COLUMN_THRESHOLD = 10;

// Type guard to check if node has properties array
const hasProperties = (node: any): node is VisDataNode => {
  return 'properties' in node && Array.isArray(node.properties);
};

export const ObjectNode: React.FC<DataNodeProps> = ({ data }) => {
  // Type cast data to any to prevent TS errors with potentially incompatible DataNode types
  const nodeData = data as any;

  const toggleNodeExpansion = useEditorStore((state) => state.toggleNodeExpansion);
  const nodes = useEditorStore((state) => state.nodes);
  const hoveredNodeId = useEditorStore((state) => state.hoveredNodeId);
  const expanded = nodeData.expanded !== false;

  const isDimmed = useMemo(() => {
    if (!hoveredNodeId) return false;
    if (hoveredNodeId === nodeData.id) return false;

    // Check if this node is an ancestor of the hovered node
    let currentId: string | undefined = hoveredNodeId;
    while (currentId) {
      const currentNode = nodes.find(n => n.id === currentId);
      if (!currentNode) break;

      if (currentNode.parent === nodeData.id) return false;
      currentId = currentNode.parent;
    }

    return true;
  }, [hoveredNodeId, nodeData.id, nodes]);

  // Ensure we're working with a node that has properties
  if (!hasProperties(nodeData)) {
    // Render a fallback for nodes without properties
    return (
      <div className="relative group">
        <Handle
          type="target"
          position={Position.Left}
          className="!w-2 !h-2 !bg-primary/70 !border-2 !border-white"
        />
        <div className="bg-[#F4F6FF] rounded-lg border border-accent2/30 w-[320px]">
          <div className="p-3">
            <span className="text-primary font-medium">{nodeData.key || 'Unknown'}</span>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="!w-2 !h-2 !bg-primary/70 !border-2 !border-white"
        />
      </div>
    );
  }

  // Now we know nodeData has properties
  const typedData = nodeData as VisDataNode;

  const simpleProperties = typedData.properties.filter(prop =>
    typeof prop.value !== 'object' || prop.value === null
  );

  const complexProperties = typedData.properties.filter(prop =>
    typeof prop.value === 'object' && prop.value !== null
  );

  // Get child nodes information
  const childNodes = nodes.filter(node => node.parent === typedData.id);
  const childNodesInfo = childNodes.map(node => {
    const anyNode = node as any;
    const propertyCount = anyNode.properties?.length || 0;
    return {
      key: node.key,
      propertyCount
    };
  });

  // Calculate number of columns based on number of simple properties
  const simplePropertyColumns = useMemo(() => {
    // Check if this is a root node
    const isRootNode = !typedData.parent;

    // For root nodes, always use single column
    if (isRootNode) {
      return [simpleProperties];
    }

    const columns = [];
    let totalColumns = Math.ceil(simpleProperties.length / MAX_PROPS_PER_COLUMN);

    // Only use multi-column layout if we have more than MAX_PROPS_PER_COLUMN properties
    if (totalColumns <= 1) {
      return [simpleProperties];
    }

    // Limit to 2 columns for nodes with less than THREE_COLUMN_THRESHOLD properties
    if (totalColumns > 2 && simpleProperties.length < THREE_COLUMN_THRESHOLD) {
      totalColumns = 2;
    }

    // Cap at 3 columns maximum
    totalColumns = Math.min(totalColumns, 3);

    // Sort properties to put similar types of properties in the same column
    const sortedProperties = [...simpleProperties].sort((a, b) => {
      // First sort by property type
      if (a.type !== b.type) {
        const typeOrder = { string: 1, number: 2, boolean: 3, null: 4 };
        return typeOrder[a.type as keyof typeof typeOrder] - typeOrder[b.type as keyof typeof typeOrder];
      }
      // Then by key length (shorter keys first)
      return a.key.length - b.key.length;
    });

    // Distribute properties evenly across columns
    const itemsPerColumn = Math.ceil(sortedProperties.length / totalColumns);

    for (let i = 0; i < totalColumns; i++) {
      const start = i * itemsPerColumn;
      const end = Math.min((i + 1) * itemsPerColumn, sortedProperties.length);
      columns.push(sortedProperties.slice(start, end));
    }

    return columns;
  }, [simpleProperties]);

  // Dynamic width for the node based on number of columns
  const nodeWidth = useMemo(() => {
    // Root nodes should always use single column width
    if (!typedData.parent) {
      return SPACING.NODE_WIDTH;
    }

    if (simplePropertyColumns.length === 1) {
      return SPACING.NODE_WIDTH;
    } else if (simplePropertyColumns.length === 2) {
      return SPACING.MULTI_COLUMN_WIDTH.TWO_COLUMNS;
    } else {
      return SPACING.MULTI_COLUMN_WIDTH.THREE_COLUMNS;
    }
  }, [simplePropertyColumns.length, typedData.parent]);

  return (
    <div
      className={`relative group transition-opacity duration-300 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-primary/70 !border-2 !border-white"
      />

      <div
        className="bg-[#F4F6FF] rounded-lg border border-accent2/30"
        style={{ width: `${nodeWidth}px`, maxWidth: '90vw' }}
      >
        <div className="flex items-center gap-2 p-3 border-b border-accent2/20">
          <button
            onClick={() => toggleNodeExpansion(typedData.id)}
            className="text-accent1 hover:text-primary transition-colors"
          >
            {expanded ? <Minus size={14} /> : <Plus size={14} />}
          </button>
          <span className="text-primary font-medium">{typedData.key}</span>
          <TypeBadge type={typedData.type} />
          {simpleProperties.length > 0 && (
            <span className="text-accent1 text-xs ml-2">
              {simpleProperties.length} {simpleProperties.length === 1 ? 'property' : 'properties'}
            </span>
          )}
          {simplePropertyColumns.length > 1 && (
            <span className="text-accent1 text-xs ml-2">
              ({simplePropertyColumns.length} columns)
            </span>
          )}
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 space-y-1">
                {/* Multi-column layout for simple properties */}
                {simplePropertyColumns.length > 0 && (
                  <div className={`grid gap-x-4 gap-y-0 ${simplePropertyColumns.length === 2 ? 'grid-cols-2' :
                    simplePropertyColumns.length === 3 ? 'grid-cols-3' :
                      'grid-cols-1'
                    }`}>
                    {simplePropertyColumns.map((column, columnIndex) => (
                      <div key={columnIndex} className="space-y-0">
                        {column.map((prop: Property) => (
                          <PropertyRow key={prop.key} property={prop} />
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {simpleProperties.length > 0 && (childNodesInfo.length > 0 || complexProperties.length > 0) && (
                  <div className="border-t border-accent2/20 my-2" />
                )}

                {/* Display child nodes information in a cleaner format */}
                {childNodesInfo.length > 0 && (
                  <div className={childNodesInfo.length > 2 ? "grid grid-cols-2 gap-2" : ""}>
                    {childNodesInfo.map(child => (
                      <div key={child.key} className="flex items-center gap-2 py-1.5 px-2 text-sm">
                        <span className="text-primary font-medium">{child.key}:</span>
                        <span className="text-accent1">
                          {child.propertyCount} {child.propertyCount === 1 ? 'property' : 'properties'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {childNodesInfo.length > 0 && complexProperties.length > 0 && (
                  <div className="border-t border-accent2/20 my-2" />
                )}

                {/* Complex properties in a more compressed view */}
                {complexProperties.map((prop: Property) => (
                  <NestedProperty
                    key={prop.key}
                    property={prop}
                    expanded={expanded}
                    onToggle={() => toggleNodeExpansion(`${typedData.id}-${prop.key}`)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-primary/70 !border-2 !border-white"
      />
    </div>
  );
};
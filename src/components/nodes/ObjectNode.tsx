import React from 'react';
import { Handle, Position } from 'reactflow';
import { Minus, Plus } from 'lucide-react';
import { DataNodeProps } from './NodeTypes';
import { useEditorStore } from '../../store/editorStore';
import { PropertyRow } from './PropertyRow';
import { NestedProperty } from './NestedProperty';

export const ObjectNode: React.FC<DataNodeProps> = ({ data }) => {
  const toggleNodeExpansion = useEditorStore((state) => state.toggleNodeExpansion);
  const nodes = useEditorStore((state) => state.nodes);
  const expanded = data.expanded !== false;

  const simpleProperties = data.properties?.filter(prop => 
    typeof prop.value !== 'object' || prop.value === null
  ) || [];
  
  const complexProperties = data.properties?.filter(prop => 
    typeof prop.value === 'object' && prop.value !== null
  ) || [];

  // Get child nodes information
  const childNodes = nodes.filter(node => node.parent === data.id);
  const childNodesInfo = childNodes.map(node => {
    const propertyCount = node.properties?.length || 0;
    return {
      key: node.key,
      propertyCount
    };
  });

  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-gray-400 !border-2 !border-white"
      />
      
      <div className="bg-white rounded-lg border border-gray-200 w-[320px] max-w-[90vw]">
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <button
            onClick={() => toggleNodeExpansion(data.id)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {expanded ? <Minus size={14} /> : <Plus size={14} />}
          </button>
          <span className="text-gray-700 font-medium">{data.key}</span>
          <span className="text-gray-400 text-sm">
            {data.type === 'array' ? '[]' : '{}'}
          </span>
        </div>

        <div className="p-3 space-y-2">
          {simpleProperties.map(prop => (
            <PropertyRow key={prop.key} property={prop} />
          ))}

          {simpleProperties.length > 0 && (childNodesInfo.length > 0 || complexProperties.length > 0) && (
            <div className="border-t border-gray-100 my-2" />
          )}

          {/* Display child nodes information */}
          {childNodesInfo.map(child => (
            <div key={child.key} className="flex items-center gap-2 py-1.5 px-2 text-sm">
              <span className="text-blue-600 font-medium">{child.key}:</span>
              <span className="text-gray-500">
                {child.propertyCount} {child.propertyCount === 1 ? 'property' : 'properties'}
              </span>
            </div>
          ))}

          {childNodesInfo.length > 0 && complexProperties.length > 0 && (
            <div className="border-t border-gray-100 my-2" />
          )}

          {complexProperties.map(prop => (
            <NestedProperty
              key={prop.key}
              property={prop}
              expanded={expanded}
              onToggle={() => toggleNodeExpansion(`${data.id}-${prop.key}`)}
            />
          ))}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-gray-400 !border-2 !border-white"
      />
    </div>
  );
};
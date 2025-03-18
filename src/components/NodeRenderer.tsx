import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { Property } from '../types';

const PropertyRow: React.FC<{ property: Property }> = ({ property }) => (
  <div className="flex items-center gap-2 py-1">
    <span className="text-blue-600 font-medium">{property.key}:</span>
    <span className="text-gray-800">
      {property.type === 'string' ? `"${property.value}"` : String(property.value)}
    </span>
  </div>
);

export const NodeRenderer: React.FC<{ data: any }> = ({ data }) => {
  const toggleNodeExpansion = useEditorStore(state => state.toggleNodeExpansion);
  const expanded = data.expanded !== false;

  const handleToggle = () => {
    toggleNodeExpansion(data.id);
  };

  const bgColor = data.type === 'array' ? 'rgb(254, 226, 226)' : 'rgb(220, 252, 231)';
  const hasNestedObjects = data.type === 'object' || data.type === 'array';

  return (
    <div className="relative" style={{ minWidth: '250px' }}>
      <div 
        className="rounded-lg p-4 shadow-sm border border-gray-200"
        style={{ backgroundColor: bgColor }}
      >
        <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-gray-400" />
        
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
          {hasNestedObjects && (
            <button
              onClick={handleToggle}
              className="text-gray-600 hover:text-gray-800"
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          <span className="font-semibold text-gray-800">
            {data.key}
          </span>
        </div>

        <div className="space-y-1">
          {data.properties.map((prop: Property) => (
            <PropertyRow key={prop.key} property={prop} />
          ))}
        </div>
        
        <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-gray-400" />
      </div>
    </div>
  );
};
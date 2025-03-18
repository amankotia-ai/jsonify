import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Property } from '../../types';

interface NestedPropertyProps {
  property: Property;
  expanded: boolean;
  onToggle: () => void;
}

export const NestedProperty: React.FC<NestedPropertyProps> = ({
  property,
  expanded,
  onToggle,
}) => {
  const isArray = Array.isArray(property.value);
  
  return (
    <div 
      onClick={onToggle}
      className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-700/30 rounded cursor-pointer group"
    >
      {expanded ? (
        <ChevronDown size={14} className="text-gray-400" />
      ) : (
        <ChevronRight size={14} className="text-gray-400" />
      )}
      <span className="text-blue-400 font-medium">{property.key}:</span>
      <span className="text-gray-400">
        {isArray ? '[]' : '{}'}
      </span>
    </div>
  );
};
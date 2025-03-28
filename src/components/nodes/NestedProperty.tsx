import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Property } from '../../types/nodes';

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
      className="flex items-center gap-2 py-1.5 px-2 hover:bg-primary/5 rounded cursor-pointer group"
    >
      {expanded ? (
        <ChevronDown size={14} className="text-accent1" />
      ) : (
        <ChevronRight size={14} className="text-accent1" />
      )}
      <span className="text-primary font-medium">{property.key}:</span>
      <span className="text-accent1">
        {isArray ? '[]' : '{}'}
      </span>
    </div>
  );
};
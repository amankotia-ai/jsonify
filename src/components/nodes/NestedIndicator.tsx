import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Property } from '../../types';

interface NestedIndicatorProps {
  property: Property;
  parentId: string;
  expanded: boolean;
}

export const NestedIndicator: React.FC<NestedIndicatorProps> = ({
  property,
  expanded
}) => {
  const isArray = Array.isArray(property.value);
  
  return (
    <div className="flex items-center gap-2 text-sm group cursor-pointer hover:bg-gray-700/30 rounded px-2 py-1">
      <ChevronRight size={14} className="text-gray-500" />
      <span className="text-blue-400">{property.key}</span>
      <span className="text-gray-500">
        {isArray ? '[]' : '{}'}
      </span>
    </div>
  );
};
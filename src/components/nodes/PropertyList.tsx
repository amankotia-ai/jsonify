import React from 'react';
import { Property } from '../../types';

interface PropertyListProps {
  properties: Property[];
}

export const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  if (properties.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {properties.map(prop => (
        <div key={prop.key} className="flex items-center gap-2 overflow-hidden">
          <span className="text-blue-400 whitespace-nowrap">{prop.key}:</span>
          <span className="text-gray-300 truncate">
            {typeof prop.value === 'string' 
              ? `"${prop.value}"`
              : String(prop.value)
            }
          </span>
        </div>
      ))}
    </div>
  );
};
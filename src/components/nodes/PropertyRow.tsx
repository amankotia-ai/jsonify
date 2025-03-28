import React from 'react';
import { PropertyValue } from './PropertyValue';
import { Property } from '../../types/nodes';

interface PropertyRowProps {
  property: Property;
}

export const PropertyRow: React.FC<PropertyRowProps> = ({ property }) => {
  return (
    <div className="flex items-start gap-2 py-2 px-2 hover:bg-primary/5 rounded group">
      <span className="text-primary font-medium text-sm whitespace-nowrap pt-0.5 flex-shrink-0">{property.key}:</span>
      <div className="flex-1 min-w-0">
        <PropertyValue value={property.value} type={property.type} />
      </div>
    </div>
  );
};
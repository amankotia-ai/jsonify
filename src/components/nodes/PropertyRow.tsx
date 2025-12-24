import React from 'react';
import { PropertyValue } from './PropertyValue';
import { Property } from '../../types/nodes';
import { TypeBadge } from './TypeBadge';

interface PropertyRowProps {
  property: Property;
}

export const PropertyRow: React.FC<PropertyRowProps> = ({ property }) => {
  return (
    <div className="flex items-start gap-2 py-2 px-2 hover:bg-primary/5 rounded group">
      <div className="flex items-center min-w-[30%] max-w-[40%] pt-0.5">
        <TypeBadge type={property.type} />
        <span className="text-primary font-medium text-sm whitespace-nowrap truncate" title={property.key}>{property.key}:</span>
      </div>
      <div className="flex-1 min-w-0">
        <PropertyValue value={property.value} type={property.type} />
      </div>
    </div>
  );
};
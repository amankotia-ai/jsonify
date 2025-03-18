import React from 'react';
import { BaseNode } from './BaseNode';
import { Property } from '../../types/nodes';
import { nodeStyles } from './styles';

interface PropertyNodeProps {
  data: {
    property: Property;
    parentId: string;
  };
}

export const PropertyNode: React.FC<PropertyNodeProps> = ({ data }) => {
  const { property, parentId } = data;
  const valueDisplay = property.type === 'string' ? `"${property.value}"` : String(property.value);
  
  return (
    <BaseNode 
      id={`${parentId}-${property.key}`}
      className={nodeStyles.property.wrapper}
      showSourceHandle={false}
    >
      <div className={nodeStyles.property.content}>
        <span className={nodeStyles.property.key}>{property.key}:</span>
        <span className={nodeStyles.property.value}>{valueDisplay}</span>
      </div>
    </BaseNode>
  );
};
import React from 'react';

interface PropertyValueProps {
  value: any;
  type: string;
}

export const PropertyValue: React.FC<PropertyValueProps> = ({ value, type }) => {
  if (value === null) return <span className="text-accent1 text-sm">null</span>;
  
  // If value is a very long string, handle it specially
  if (type === 'string' && typeof value === 'string' && value.length > 100) {
    return (
      <div className="relative">
        <span className="text-primary text-sm break-words whitespace-pre-wrap">{JSON.stringify(value, null, 0).replace(/^"|"$/g, '')}</span>
      </div>
    );
  }
  
  switch (type) {
    case 'string':
      return <span className="text-primary text-sm break-words whitespace-pre-wrap">"{value}"</span>;
    case 'number':
      return <span className="text-primary text-sm">{value}</span>;
    case 'boolean':
      return <span className="text-primary text-sm">{String(value)}</span>;
    default:
      return <span className="text-accent1 text-sm break-words whitespace-pre-wrap">{String(value)}</span>;
  }
};
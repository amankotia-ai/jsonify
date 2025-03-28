import React from 'react';
import { Handle, Position } from 'reactflow';
import { DataNodeProps } from './NodeTypes';

export const BaseNode: React.FC<DataNodeProps> = ({ data }) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-primary/70"
      />
      
      <div className="bg-[#F4F6FF] rounded-lg p-4 shadow-sm border border-accent2/30 min-w-[280px]">
        {data.key && (
          <div className="text-primary font-medium mb-2">{data.key}</div>
        )}
        <div className="text-accent1">
          {data.type === 'value' ? (
            <span className="text-primary">{JSON.stringify(data.value)}</span>
          ) : (
            <span>{data.type === 'array' ? '[]' : '{}'}</span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-primary/70"
      />
    </div>
  );
};
import React from 'react';
import { Handle, Position } from 'reactflow';
import { DataNodeProps } from './NodeTypes';
import { COLORS } from '../../utils/layout/constants';

export const BaseNode: React.FC<DataNodeProps> = ({ data }) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-gray-500"
      />
      
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 min-w-[280px]">
        {data.key && (
          <div className="text-gray-300 font-medium mb-2">{data.key}</div>
        )}
        <div className="text-gray-400">
          {data.type === 'value' ? (
            <span className="text-blue-400">{JSON.stringify(data.value)}</span>
          ) : (
            <span>{data.type === 'array' ? '[]' : '{}'}</span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-gray-500"
      />
    </div>
  );
};
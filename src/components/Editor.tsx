import React from 'react';
import { useEditorStore } from '../store/editorStore';

export const Editor: React.FC = () => {
  const { rawData, selectedFormat, updateRawData, updateFormat } = useEditorStore();

  return (
    <div className="h-full flex flex-col bg-gray-800 border-r border-gray-700">
      <div className="flex items-center p-4 border-b border-gray-700">
        <select
          value={selectedFormat}
          onChange={(e) => updateFormat(e.target.value as 'json' | 'yaml')}
          className="bg-gray-700 text-gray-200 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="json">JSON</option>
          <option value="yaml">YAML</option>
        </select>
      </div>
      
      <textarea
        value={rawData}
        onChange={(e) => updateRawData(e.target.value)}
        className="flex-1 bg-gray-900 text-gray-300 p-4 font-mono resize-none outline-none"
        placeholder={`Enter your ${selectedFormat.toUpperCase()} data here...`}
      />
    </div>
  );
};
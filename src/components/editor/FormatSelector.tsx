import React from 'react';
import { useEditorStore } from '../../store/editorStore';

export const FormatSelector: React.FC = () => {
  const { selectedFormat, updateFormat } = useEditorStore();

  return (
    <select
      value={selectedFormat}
      onChange={(e) => updateFormat(e.target.value as 'json')}
      className="bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 
                h-8 pl-3 pr-8 appearance-none cursor-pointer hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.5rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
      }}
    >
      <option value="json">JSON</option>
    </select>
  );
};
import React, { useEffect } from 'react';
import { FileJson, Code } from 'lucide-react';
import { FormatSelector } from './FormatSelector';
import { CodeEditor } from './CodeEditor';
import { useEditorStore } from '../../store/editorStore';
import yaml from 'js-yaml';

const exampleData = {
  "Harry Potter": {
    "name": "Harry Potter",
    "gender": "male",
    "eyeColour": "#00ff00",
    "hairColour": "#000000",
    "wand": {
      "wood": "holly",
      "core": "phoenix feather"
    },
    "actor": "Daniel Radcliffe"
  },
  "Hermione Granger": {
    "name": "Hermione Granger",
    "gender": "female",
    "house": "Gryffindor",
    "eyeColour": "#964B00",
    "hairColour": "#964B00",
    "wand": {
      "wood": "vine",
      "core": "dragon heartstring"
    },
    "actor": "Emma Watson"
  },
  "Ron Weasley": {
    "name": "Ron Weasley",
    "gender": "male",
    "house": "Gryffindor",
    "ancestry": "pure-blood",
    "eyeColour": "#0000FF",
    "hairColour": "#FF0000",
    "wand": {
      "wood": "willow",
      "core": "unicorn tail-hair"
    },
    "actor": "Rupert Grint"
  }
};

export const Editor: React.FC = () => {
  const { updateRawData, selectedFormat, rawData } = useEditorStore(state => state);

  const handleGenerateExample = () => {
    updateRawData(JSON.stringify(exampleData, null, 2));
  };

  const handleFormatData = () => {
    if (!rawData.trim()) return;
    
    try {
      if (selectedFormat === 'json') {
        // Format JSON
        const parsed = JSON.parse(rawData);
        updateRawData(JSON.stringify(parsed, null, 2));
      } else {
        // Format YAML
        const parsed = yaml.load(rawData);
        updateRawData(yaml.dump(parsed, { indent: 2, lineWidth: -1 }));
      }
    } catch (error) {
      // If parsing fails, don't update
      console.error('Failed to format:', error);
    }
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Format shortcut: Cmd+Shift+F (Mac) or Ctrl+Shift+F (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        handleFormatData();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [rawData, selectedFormat]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-gray-700 font-semibold">Data Editor</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateExample}
            className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700 
                     bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            title="Generate Example"
          >
            <FileJson size={16} />
          </button>
          <button
            onClick={handleFormatData}
            className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700 
                     bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            title="Format Code"
          >
            <Code size={16} />
          </button>
          <FormatSelector />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeEditor />
      </div>
    </div>
  );
};
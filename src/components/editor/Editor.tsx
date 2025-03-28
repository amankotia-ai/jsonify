import React, { useEffect, useState } from 'react';
import { FileJson, Code, DownloadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.div 
      className="h-full flex flex-col overflow-hidden rounded-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.h1 
          className="text-gray-700 font-semibold"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          JSON Explorer
        </motion.h1>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleGenerateExample}
            className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700 
                     bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            title="Generate Example Data"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <DownloadCloud size={16} />
          </motion.button>
          <motion.button
            onClick={handleFormatData}
            className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700 
                     bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            title="Format Code"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Code size={16} />
          </motion.button>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex-1 overflow-hidden flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <motion.div 
          className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="text-sm font-medium text-gray-700">
            Data Editor
          </div>
          <motion.div 
            className="text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            Format: {selectedFormat.toUpperCase()}
          </motion.div>
        </motion.div>
        <motion.div 
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <CodeEditor />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
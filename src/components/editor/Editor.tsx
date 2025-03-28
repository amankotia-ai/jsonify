import React, { useEffect, useState } from 'react';
import { FileJson, Code, DownloadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { CodeEditor } from './CodeEditor';
import { useEditorStore } from '../../store/editorStore';

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
  const { updateRawData, rawData } = useEditorStore(state => state);

  const handleGenerateExample = () => {
    updateRawData(JSON.stringify(exampleData, null, 2));
  };

  const handleFormatData = () => {
    if (!rawData.trim()) return;
    
    try {
      // Format JSON
      const parsed = JSON.parse(rawData);
      updateRawData(JSON.stringify(parsed, null, 2));
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
  }, [rawData]);

  return (
    <motion.div 
      className="h-full flex flex-col overflow-hidden rounded-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex items-center justify-between px-4 py-4 bg-secondary border-b border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <img src="/favicon.png" alt="JSON Map Logo" className="h-6 w-6" />
          <h1 className="text-primary font-semibold">JSON Map</h1>
        </motion.div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleGenerateExample}
            className="h-8 w-8 flex items-center justify-center text-accent1 hover:text-primary 
                     bg-secondary hover:bg-accent2/10 rounded-md transition-colors"
            title="Generate Example Data"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <DownloadCloud size={16} />
          </motion.button>
          <motion.button
            onClick={handleFormatData}
            className="h-8 w-8 flex items-center justify-center text-accent1 hover:text-primary 
                     bg-secondary hover:bg-accent2/10 rounded-md transition-colors"
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
          className="px-4 py-2 bg-accent2/5 border-b border-gray-100 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="text-sm font-medium text-primary">
            Data Editor
          </div>
          <motion.div 
            className="text-xs text-accent1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            Format: JSON
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
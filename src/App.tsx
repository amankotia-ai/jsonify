import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from './components/editor/Editor';
import { DataFlow } from './components/flow/DataFlow';
import { ApiPanel } from './components/editor/ApiPanel';

function App() {
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [isApiPanelOpen, setIsApiPanelOpen] = useState(false);

  return (
    <motion.div 
      className="h-screen relative bg-secondary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Full-width diagram */}
      <motion.div 
        className="h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <DataFlow openApiPanel={() => setIsApiPanelOpen(true)} />
      </motion.div>
      
      {/* Mobile toggle button */}
      <motion.button
        onClick={() => setIsEditorOpen(!isEditorOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] bg-secondary p-2 rounded-md border border-accent2 shadow-sm text-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isEditorOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </motion.button>
      
      {/* Floating editor panel */}
      <AnimatePresence>
        <motion.div 
          className="fixed top-1.5 bottom-1.5 left-1.5 w-[400px] rounded-md bg-secondary border border-gray-200 shadow-sm z-50 overflow-hidden max-w-[calc(100%-12px)] md:max-w-[400px)]"
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ 
            opacity: 1,
            x: isEditorOpen ? 0 : '-calc(100% + 6px)'
          }}
          exit={{ opacity: 0, x: '-100%' }}
          transition={{ 
            type: "tween",
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2
          }}
          key="editor-panel"
        >
          <Editor />
        </motion.div>
      </AnimatePresence>
      
      {/* API Panel at root level */}
      <ApiPanel isOpen={isApiPanelOpen} onClose={() => setIsApiPanelOpen(false)} />
    </motion.div>
  );
}

export default App;
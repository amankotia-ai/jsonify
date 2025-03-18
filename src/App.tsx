import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Editor } from './components/editor/Editor';
import { DataFlow } from './components/flow/DataFlow';

function App() {
  const [isEditorOpen, setIsEditorOpen] = useState(true);

  return (
    <div className="h-screen relative bg-gray-100">
      {/* Full-width diagram */}
      <div className="h-full w-full">
        <DataFlow />
      </div>
      
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsEditorOpen(!isEditorOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] bg-white p-2 rounded-md border border-gray-200 shadow-sm"
      >
        {isEditorOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      
      {/* Floating editor panel */}
      <div className={`
        fixed top-1.5 bottom-1.5 left-1.5 w-[400px] rounded-md bg-white border border-gray-200 z-50
        transition-transform duration-300 md:translate-x-0 overflow-hidden
        ${isEditorOpen ? 'translate-x-0' : '-translate-x-[calc(100%+6px)]'}
        max-w-[calc(100%-12px)] md:max-w-[400px]
      `}>
        <Editor />
      </div>
    </div>
  );
}

export default App;
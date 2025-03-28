import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Background, useReactFlow, BackgroundVariant, Viewport } from 'reactflow';
import { ZoomIn, ZoomOut, Maximize, Move, MousePointer, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlowControlsProps {
  isPanning?: boolean;
  setSpacePressed?: (isPressed: boolean) => void;
  openApiPanel?: () => void;
}

export const FlowControls: React.FC<FlowControlsProps> = ({ 
  isPanning = false, 
  setSpacePressed = () => {},
  openApiPanel = () => {}
}) => {
  const { zoomIn, zoomOut, fitView, getViewport, setViewport, getNodes } = useReactFlow();
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const flowContainerRef = useRef<HTMLElement | null>(null);

  // Define handleFitView before using it in useEffect
  const handleFitView = useCallback(() => {
    const nodes = getNodes();
    if (nodes.length === 0) return;
    
    // Get the editor width
    const editorWidth = isEditorOpen ? 400 : 0;
    
    // Instead of using ReactFlow's built-in fitView, we'll calculate
    // the viewport transformation ourselves and apply it in a single step
    
    // Custom fit view with offset for editor panel
    // Only show this to ReactFlow to calculate bounds
    const bounds = fitView({
      padding: 0.3,
      includeHiddenNodes: false,
      duration: 0, // Don't animate yet
    });
    
    // Get the new viewport calculation done by fitView
    const newViewport = getViewport();
    
    // Apply the editor offset to the x position
    // We only need half the editor width to center in the available space
    const offsetX = isEditorOpen ? (editorWidth / 2) : 0;
    
    // Apply viewport change with offset in a single animation
    setViewport(
      {
        x: newViewport.x + offsetX,
        y: newViewport.y,
        zoom: newViewport.zoom
      },
      { duration: 400 } // Single smooth animation
    );
  }, [fitView, getViewport, setViewport, isEditorOpen, getNodes]);

  // Detect if editor is open
  useEffect(() => {
    const checkEditorState = () => {
      const editorPanel = document.querySelector('[class*="fixed top-1.5 bottom-1.5 left-1.5 w-[400px]"]');
      const isOpen = editorPanel ? !editorPanel.classList.contains('-translate-x-[calc(100%+6px)]') : false;
      setIsEditorOpen(isOpen);
    };
    
    // Check initial state
    checkEditorState();
    
    // Set up observer to monitor changes
    const observer = new MutationObserver(checkEditorState);
    const body = document.body;
    observer.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    
    // Store reference to flow container
    flowContainerRef.current = document.querySelector('.react-flow') as HTMLElement;
    
    return () => observer.disconnect();
  }, []);

  // Listen for API response complete event to fit view
  useEffect(() => {
    const flowContainer = document.querySelector('.react-flow');
    
    if (flowContainer) {
      const handleApiResponseComplete = () => {
        // Delay slightly to ensure DOM is updated
        setTimeout(() => handleFitView(), 100);
      };
      
      flowContainer.addEventListener('api-response-complete', handleApiResponseComplete);
      
      return () => {
        flowContainer.removeEventListener('api-response-complete', handleApiResponseComplete);
      };
    }
  }, [handleFitView]);

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 });
  }, [zoomOut]);

  const togglePanMode = useCallback(() => {
    // Toggle the pan mode without using a function parameter
    setSpacePressed(!isPanning);
  }, [setSpacePressed, isPanning]);

  const controlButton = "bg-white border border-gray-200 rounded-md p-1.5 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-800 z-50";

  return (
    <>
      {/* Background patterns */}
      <Background
        color="#EBEBEB"
        variant={BackgroundVariant.Dots}
        gap={20}
        size={2}
        style={{ backgroundColor: '#F7F7F7' }}
      />
      <Background
        color="#e5e7eb"
        variant={BackgroundVariant.Lines}
        gap={100}
        size={0.5}
        style={{ backgroundColor: 'transparent' }}
      />
      
      {/* API Button - Top Right */}
      <motion.div 
        className="absolute top-4 right-4 z-[100]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          onClick={openApiPanel}
          className="bg-white border border-gray-200 rounded-md p-2 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-800 shadow-sm flex items-center gap-1.5"
          title="API Request"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Globe size={16} className="text-gray-700" />
          <span className="text-xs font-medium">API</span>
        </motion.button>
      </motion.div>
      
      {/* Controls - Bottom Right */}
      <motion.div 
        className="absolute bottom-4 right-4 flex items-center gap-1.5 z-[100]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.button
          onClick={togglePanMode}
          className={`${controlButton} ${isPanning ? 'bg-blue-50 border-blue-200 text-blue-600' : ''}`}
          title="Toggle Pan Mode (Spacebar)"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MousePointer size={16} />
        </motion.button>
        <motion.button
          onClick={handleZoomOut}
          className={controlButton}
          title="Zoom Out"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomOut size={16} />
        </motion.button>
        <motion.button
          onClick={handleZoomIn}
          className={controlButton}
          title="Zoom In"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomIn size={16} />
        </motion.button>
        <motion.button
          onClick={handleFitView}
          className={controlButton}
          title="Fit View"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Maximize size={16} />
        </motion.button>
      </motion.div>
    </>
  );
};
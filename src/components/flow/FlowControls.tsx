import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Background, useReactFlow, BackgroundVariant, FitViewOptions, Viewport } from 'reactflow';
import { Download, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { exportFlowAsSvg } from '../../utils/export/svgExport';

export const FlowControls: React.FC = () => {
  const { zoomIn, zoomOut, fitView, getViewport, setViewport, getNodes } = useReactFlow();
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const flowContainerRef = useRef<HTMLElement | null>(null);

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

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 });
  }, [zoomOut]);

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
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-[100]">
        <button
          onClick={handleZoomOut}
          className={controlButton}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleZoomIn}
          className={controlButton}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleFitView}
          className={controlButton}
          title="Fit View"
        >
          <Maximize size={16} />
        </button>
        <button
          onClick={exportFlowAsSvg}
          className={controlButton}
          title="Export as SVG"
        >
          <Download size={16} />
        </button>
      </div>
    </>
  );
};
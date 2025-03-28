import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, { 
  ReactFlowProvider, 
  Node, 
  Edge, 
  ConnectionMode,
  useReactFlow,
  Panel,
} from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import 'reactflow/dist/style.css';
import { useEditorStore } from '../../store/editorStore';
import { FlowControls } from './FlowControls';
import { nodeTypes } from './FlowConfig';
import { calculateNodePositions } from '../../utils/layout/positioning';
import { createEdges } from '../../utils/layout/edges';

interface FlowProps {
  openApiPanel: () => void;
}

const Flow: React.FC<FlowProps> = ({ openApiPanel }) => {
  const nodes = useEditorStore((state) => state.nodes);
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  
  const { flowNodes, flowEdges } = React.useMemo(() => {
    const positions = calculateNodePositions(nodes);
    
    const elements: Node[] = nodes.map((node) => ({
      id: node.id,
      type: 'object',
      data: node,
      position: positions.get(node.id) || { x: 0, y: 0 },
      draggable: false,
      selectable: false,
    }));

    const edges: Edge[] = createEdges(nodes);
    
    return {
      flowNodes: elements,
      flowEdges: edges,
    };
  }, [nodes]);

  // Initialize view once nodes are loaded
  React.useEffect(() => {
    if (flowNodes.length > 0) {
      // Check if editor is open
      const editorPanel = document.querySelector('[class*="fixed top-1.5 bottom-1.5 left-1.5 w-[400px]"]');
      const isEditorOpen = editorPanel && !editorPanel.classList.contains('-translate-x-[calc(100%+6px)]');
      
      // Get the editor width
      const editorWidth = isEditorOpen ? 400 : 0;
      
      // Calculate the bounds without animation
      reactFlowInstance.fitView({
        padding: 0.3,
        duration: 0, // No animation for this step
      });
      
      // Get the calculated viewport
      const viewport = reactFlowInstance.getViewport();
      
      // Apply the viewport with editor offset in a single animation
      const offsetX = isEditorOpen ? (editorWidth / 2) : 0;
      
      // Set the viewport with offset in one smooth animation
      reactFlowInstance.setViewport(
        {
          x: viewport.x + offsetX,
          y: viewport.y,
          zoom: viewport.zoom
        },
        { duration: 400 } // Single smooth animation
      );
    }
  }, [flowNodes.length, reactFlowInstance]);
  
  // Handle keyboard events for spacebar panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space key (32) - used for panning
      if (e.code === 'Space' && !spacePressed) {
        setSpacePressed(true);
        document.body.style.cursor = 'grab';
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
        setIsPanning(false);
        document.body.style.cursor = 'default';
      }
    };
    
    // Only add event listeners if reactFlowWrapper is available
    if (reactFlowWrapper.current) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.body.style.cursor = 'default';
    };
  }, [spacePressed, reactFlowWrapper]);
  
  // Handle mouse events for spacebar+drag panning
  useEffect(() => {
    const handleMouseDown = () => {
      if (spacePressed) {
        setIsPanning(true);
        document.body.style.cursor = 'grabbing';
      }
    };
    
    const handleMouseUp = () => {
      if (spacePressed) {
        setIsPanning(false);
        document.body.style.cursor = 'grab';
      }
    };
    
    if (reactFlowWrapper.current) {
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [spacePressed, reactFlowWrapper]);
  
  const onInit = (instance: any) => {
    // Enable zooming with mouse wheel
    if (reactFlowWrapper.current) {
      reactFlowWrapper.current.addEventListener('wheel', (event) => {
        // Prevent default behavior only if not pressing spacebar
        // This allows normal scrolling when space is not pressed
        if (!spacePressed) {
          event.preventDefault();
        }
      }, { passive: false });
    }
  };

  // Custom animation for nodes
  const customNodeAnimation = React.useMemo(() => {
    return flowNodes.map((node, index) => ({
      ...node,
      // Add animation data to each node
      data: {
        ...node.data,
        animationDelay: index * 0.05, // Stagger the animations
      }
    }));
  }, [flowNodes]);

  return (
    <motion.div 
      className="h-full w-full relative" 
      ref={reactFlowWrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0 flex items-center justify-center">
        <img src="/Web Banner.png" alt="JSON Map" className="w-96 max-w-full" />
      </div>
      <ReactFlow
        nodes={customNodeAnimation}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#879AF8', strokeWidth: 1.5 },
          animated: true, // Add animation to edges
        }}
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        className="bg-secondary"
        proOptions={{ hideAttribution: true }}
        fitView={false} // Disable default fitView to use our custom one
        onInit={onInit}
        panOnScroll={true}
        zoomOnScroll={true}
        panOnDrag={spacePressed} // Enable panning when space is pressed
        selectionOnDrag={false}
        panActivationKeyCode="Space"
      >
        <FlowControls 
          isPanning={isPanning} 
          setSpacePressed={setSpacePressed}
          openApiPanel={openApiPanel}
        />
      </ReactFlow>
    </motion.div>
  );
};

// Wrap the Flow component with ReactFlowProvider
interface DataFlowProps {
  openApiPanel: () => void;
}

export const DataFlow: React.FC<DataFlowProps> = ({ openApiPanel }) => (
  <ReactFlowProvider>
    <Flow openApiPanel={openApiPanel} />
  </ReactFlowProvider>
);
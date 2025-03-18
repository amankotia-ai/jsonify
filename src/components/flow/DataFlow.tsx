import React, { useCallback } from 'react';
import ReactFlow, { 
  ReactFlowProvider, 
  Node, 
  Edge, 
  ConnectionMode,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useEditorStore } from '../../store/editorStore';
import { FlowControls } from './FlowControls';
import { nodeTypes } from './FlowConfig';
import { calculateNodePositions } from '../../utils/layout/positioning';
import { createEdges } from '../../utils/layout/edges';

const Flow: React.FC = () => {
  const nodes = useEditorStore((state) => state.nodes);
  const reactFlowInstance = useReactFlow();
  
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

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#94a3b8', strokeWidth: 1.5 },
        }}
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        className="bg-gray-100"
        proOptions={{ hideAttribution: true }}
        fitView={false} // Disable default fitView to use our custom one
      >
        <FlowControls />
      </ReactFlow>
    </div>
  );
};

// Wrap the Flow component with ReactFlowProvider
export const DataFlow: React.FC = () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);
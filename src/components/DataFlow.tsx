import React from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import { useEditorStore } from '../store/editorStore';
import { transformToFlowNodes } from '../utils/nodeTransformer';
import { FlowControls } from './flow/FlowControls';
import { nodeTypes, defaultEdgeOptions, flowConfig } from './flow/FlowConfig';

export const DataFlow: React.FC = () => {
  const { nodes, edges } = useEditorStore();
  const flowNodes = React.useMemo(() => transformToFlowNodes(nodes), [nodes]);

  return (
    <div className="h-full w-full bg-gray-50">
      <ReactFlow
        nodes={flowNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        {...flowConfig}
        fitView
        className="bg-gray-50"
      >
        <FlowControls />
      </ReactFlow>
    </div>
  );
};
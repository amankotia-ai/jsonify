import { DataNode, DataEdge } from './nodes';

export interface EditorState {
  nodes: DataNode[];
  edges: DataEdge[];
  selectedFormat: 'json' | 'yaml';
  rawData: string;
  updateRawData: (data: string) => void;
  updateFormat: (format: 'json' | 'yaml') => void;
  updateNodes: (nodes: DataNode[]) => void;
  toggleNodeExpansion: (nodeId: string) => void;
}
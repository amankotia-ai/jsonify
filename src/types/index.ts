export interface DataNode {
  id: string;
  type: 'object' | 'array' | 'value';
  key: string;
  value: any;
  parent?: string;
  expanded?: boolean;
}

export interface EditorState {
  nodes: DataNode[];
  selectedFormat: 'json' | 'yaml';
  rawData: string;
  updateRawData: (data: string) => void;
  updateFormat: (format: 'json' | 'yaml') => void;
  updateNodes: (nodes: DataNode[]) => void;
  toggleNodeExpansion: (nodeId: string) => void;
}
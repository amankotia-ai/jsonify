import { Position } from 'reactflow';

export interface Property {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';
}

export interface DataNode {
  id: string;
  type: 'object' | 'array';
  key: string;
  properties: Property[];
  parent?: string;
  expanded?: boolean;
}

export interface DataEdge {
  id: string;
  source: string;
  target: string;
}

export interface FlowNode {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
}
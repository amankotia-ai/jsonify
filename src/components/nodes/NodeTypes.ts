import { NodeProps } from 'reactflow';
import { DataNode } from '../../types/nodes';

export interface DataNodeProps extends NodeProps {
  data: DataNode;
}
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { useEditorStore } from '../../store/editorStore';
import { nodeStyles } from './styles';

interface RootNodeProps {
  data: {
    children: Array<{
      id: string;
      label: string;
      keyCount: number;
      expanded: boolean;
    }>;
  };
}

export const RootNode: React.FC<RootNodeProps> = ({ data }) => {
  const toggleNodeExpansion = useEditorStore(state => state.toggleNodeExpansion);

  return (
    <BaseNode className={nodeStyles.root.wrapper} showTargetHandle={false}>
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-500 mb-2">− Root</div>
        {data.children.map(child => (
          <div key={child.id} className={nodeStyles.root.item}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleNodeExpansion(child.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                {child.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              <span className="text-blue-600">{child.label}</span>
            </div>
            <span className={nodeStyles.root.count}>
              {child.keyCount} keys
            </span>
          </div>
        ))}
      </div>
    </BaseNode>
  );
};
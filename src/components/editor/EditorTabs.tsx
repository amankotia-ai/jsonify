import React from 'react';
import { FileJson, Globe, Server } from 'lucide-react';

interface EditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'editor', label: 'Editor', icon: FileJson },
    { id: 'api', label: 'API Request', icon: Server },
  ];

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="flex px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              className={`
                flex items-center gap-1.5 px-5 py-3 text-sm font-medium transition-colors
                relative
                ${isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}; 
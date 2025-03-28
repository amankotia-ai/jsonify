import React from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../store/editorStore';
import { DataNode } from '../types';

interface Property {
  key: string;
  value: any;
  type: string;
}

const PropertyRow: React.FC<{ property: Property; index: number }> = ({ property, index }) => (
  <motion.div 
    className="flex items-center gap-2 py-1"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2, delay: 0.1 + (index * 0.05) }}
  >
    <span className="text-blue-600 font-medium">{property.key}:</span>
    <span className="text-gray-800">
      {property.type === 'string' ? `"${property.value}"` : String(property.value)}
    </span>
  </motion.div>
);

export const NodeRenderer: React.FC<{ data: any }> = ({ data }) => {
  const toggleNodeExpansion = useEditorStore(state => state.toggleNodeExpansion);
  const expanded = data.expanded !== false;

  const handleToggle = () => {
    toggleNodeExpansion(data.id);
  };

  const bgColor = data.type === 'array' ? 'rgb(254, 226, 226)' : 'rgb(220, 252, 231)';
  const hasNestedObjects = data.type === 'object' || data.type === 'array';
  const animationDelay = data.animationDelay || 0;

  return (
    <motion.div 
      className="relative" 
      style={{ minWidth: '250px' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: animationDelay }}
    >
      <motion.div 
        className="rounded-lg p-4 shadow-sm border border-gray-200"
        style={{ backgroundColor: bgColor }}
        whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      >
        <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-gray-400" />
        
        <motion.div 
          className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: animationDelay + 0.1 }}
        >
          {hasNestedObjects && (
            <motion.button
              onClick={handleToggle}
              className="text-gray-600 hover:text-gray-800"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {expanded ? (
                  <motion.div
                    key="expanded"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
          
          <motion.span 
            className="font-semibold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: animationDelay + 0.2 }}
          >
            {data.key}
          </motion.span>
        </motion.div>

        <AnimatePresence>
          {expanded && (
            <motion.div 
              className="space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {data.properties.map((prop: Property, index: number) => (
                <PropertyRow key={prop.key} property={prop} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-gray-400" />
      </motion.div>
    </motion.div>
  );
};
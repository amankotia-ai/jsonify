import yaml from 'js-yaml';
import { DataNode } from '../types';

const getPropertyType = (value: any): 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array' => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value as any;
};

const createProperty = (key: string, value: any) => ({
  key,
  value,
  type: getPropertyType(value),
});

export const parseData = (data: string, format: 'json' | 'yaml'): DataNode[] => {
  if (!data.trim()) return [];
  
  try {
    const parsed = format === 'json' ? JSON.parse(data) : yaml.load(data);
    return convertToNodes(parsed);
  } catch (error) {
    console.error('Failed to parse data:', error);
    return [];
  }
};

const convertToNodes = (data: any, parentId?: string, parentKey: string = 'root'): DataNode[] => {
  const nodes: DataNode[] = [];
  
  if (typeof data === 'object' && data !== null) {
    const currentId = parentId ? `${parentId}-${parentKey}` : parentKey;
    const isArray = Array.isArray(data);
    
    // Create properties for primitive values
    const properties = Object.entries(data)
      .filter(([_, v]) => typeof v !== 'object' || v === null)
      .map(([k, v]) => createProperty(k, v));

    // Add the current node
    nodes.push({
      id: currentId,
      type: isArray ? 'array' : 'object',
      key: parentKey,
      value: data,
      properties,
      parent: parentId,
      expanded: true,
    });

    // Process nested objects
    Object.entries(data)
      .filter(([_, v]) => typeof v === 'object' && v !== null)
      .forEach(([k, v]) => {
        nodes.push(...convertToNodes(v, currentId, k));
      });
  }

  return nodes;
};
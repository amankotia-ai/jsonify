import { create } from 'zustand';
import { EditorState } from '../types';
import { parseData } from '../utils/dataParser';

export const useEditorStore = create<EditorState>((set) => ({
  nodes: [],
  selectedFormat: 'json',
  rawData: '',
  updateRawData: (data) => {
    set((state) => ({
      rawData: data,
      nodes: parseData(data, state.selectedFormat),
    }));
  },
  updateFormat: (format) => set({ selectedFormat: format }),
  updateNodes: (nodes) => set({ nodes }),
  toggleNodeExpansion: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, expanded: !node.expanded }
          : node
      ),
    })),
}));
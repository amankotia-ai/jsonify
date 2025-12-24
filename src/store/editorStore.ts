import { create } from 'zustand';
import { EditorState, RequestMethod, APIRequest, ImportableAPIConfig } from '../types';
import { parseData } from '../utils/dataParser';

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: [],
  selectedFormat: 'json',
  rawData: '',
  apiRequest: {
    url: '',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: '',
    loading: false,
    error: null,
  },
  hoveredNodeId: null,
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
  updateApiUrl: (url) => set((state) => ({
    apiRequest: { ...state.apiRequest, url }
  })),
  updateApiMethod: (method) => set((state) => ({
    apiRequest: { ...state.apiRequest, method }
  })),
  updateApiHeaders: (headers) => set((state) => ({
    apiRequest: { ...state.apiRequest, headers }
  })),
  updateApiBody: (body) => set((state) => ({
    apiRequest: { ...state.apiRequest, body }
  })),
  importApiRequest: (apiConfig: ImportableAPIConfig) => {
    // Handle Postman collection format
    if (apiConfig.info && apiConfig.item && Array.isArray(apiConfig.item)) {
      // Get the first request from a Postman collection
      const firstItem = apiConfig.item[0];
      if (firstItem.request) {
        const request = firstItem.request;

        // Extract URL
        let url = '';
        if (typeof request.url === 'string') {
          url = request.url;
        } else if (request.url && request.url.raw) {
          url = request.url.raw;
        }

        // Extract method
        const method = request.method as RequestMethod || 'GET';

        // Extract headers
        const headers: Record<string, string> = {};
        if (request.header && Array.isArray(request.header)) {
          request.header.forEach(h => {
            if (h.key && h.value) {
              headers[h.key] = h.value;
            }
          });
        }

        // Extract body
        let body = '';
        if (request.body) {
          if (request.body.raw) {
            body = request.body.raw;
          } else if (request.body.json) {
            body = JSON.stringify(request.body.json, null, 2);
          }
        }

        // Update API request
        set((state) => ({
          apiRequest: {
            ...state.apiRequest,
            url,
            method,
            headers: Object.keys(headers).length > 0 ? headers : state.apiRequest.headers,
            body
          }
        }));

        return;
      }
    }

    // Handle simple JSON format
    const { url, method, headers, body } = apiConfig;

    const updatedRequest: Partial<APIRequest> = {
      loading: false,
      error: null
    };

    if (url) updatedRequest.url = url;
    if (method && ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      updatedRequest.method = method as RequestMethod;
    }
    if (headers && typeof headers === 'object') updatedRequest.headers = headers;
    if (body !== undefined) {
      if (typeof body === 'string') {
        updatedRequest.body = body;
      } else {
        try {
          updatedRequest.body = JSON.stringify(body, null, 2);
        } catch (e) {
          // Ignore JSON stringify errors
        }
      }
    }

    set((state) => ({
      apiRequest: { ...state.apiRequest, ...updatedRequest }
    }));
  },
  sendApiRequest: async () => {
    const { apiRequest, updateRawData, selectedFormat } = get();
    const { url, method, headers, body } = apiRequest;

    if (!url) {
      set((state) => ({
        apiRequest: { ...state.apiRequest, error: 'URL is required' }
      }));
      return;
    }

    set((state) => ({
      apiRequest: { ...state.apiRequest, loading: true, error: null, statusCode: undefined }
    }));

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: ['GET', 'HEAD'].includes(method) ? undefined : body,
      });

      const contentType = response.headers.get('content-type') || '';
      const statusCode = response.status;

      if (contentType.includes('application/json')) {
        const jsonData = await response.json();

        // Format and display the JSON data
        updateRawData(JSON.stringify(jsonData, null, 2));

        set((state) => ({
          apiRequest: {
            ...state.apiRequest,
            loading: false,
            response: jsonData,
            statusCode
          }
        }));
      } else {
        const textData = await response.text();
        updateRawData(textData);

        set((state) => ({
          apiRequest: {
            ...state.apiRequest,
            loading: false,
            response: textData,
            statusCode
          }
        }));
      }

    } catch (error) {
      set((state) => ({
        apiRequest: {
          ...state.apiRequest,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch',
          statusCode: undefined
        }
      }));
    }
  },
  setHoveredNodeId: (nodeId) => set({ hoveredNodeId: nodeId }),
}));
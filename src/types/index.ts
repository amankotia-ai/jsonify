export interface DataNode {
  id: string;
  type: 'object' | 'array' | 'value';
  key: string;
  value: any;
  parent?: string;
  expanded?: boolean;
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface APIRequest {
  url: string;
  method: RequestMethod;
  headers: Record<string, string>;
  body: string;
  loading: boolean;
  error: string | null;
  response?: any;
  statusCode?: number;
}

// For importing from Postman and other API tools
export interface ImportableAPIConfig {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string | any;
  // Postman specific fields
  info?: any;
  item?: Array<{
    request?: {
      url?: string | { raw?: string };
      method?: string;
      header?: Array<{ key: string; value: string }>;
      body?: {
        raw?: string;
        json?: any;
      };
    };
  }>;
}

export interface EditorState {
  nodes: DataNode[];
  selectedFormat: 'json' | 'yaml';
  rawData: string;
  apiRequest: APIRequest;
  updateRawData: (data: string) => void;
  updateFormat: (format: 'json' | 'yaml') => void;
  updateNodes: (nodes: DataNode[]) => void;
  toggleNodeExpansion: (nodeId: string) => void;
  updateApiUrl: (url: string) => void;
  updateApiMethod: (method: RequestMethod) => void;
  updateApiHeaders: (headers: Record<string, string>) => void;
  updateApiBody: (body: string) => void;
  importApiRequest: (apiConfig: ImportableAPIConfig) => void;
  sendApiRequest: () => Promise<void>;
}
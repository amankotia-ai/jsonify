import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Trash2, ChevronDown, ChevronUp, Clipboard, CheckCircle, AlertCircle, Download, Upload, Settings, Code, X, Globe, Key, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../store/editorStore';
import { RequestMethod } from '../../types';

interface ApiPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  showFloatingButton?: boolean;
}

type AuthType = 'noAuth' | 'bearerToken' | 'basicAuth' | 'apiKey' | 'oauth2';

// Example API calls from the list
const exampleApiCalls = [
  {
    url: 'https://fake-json-api.mock.beeceptor.com/users',
    description: 'Returns a list of ten users in JSON format. Every time you hit this, you get a new set of users.'
  },
  {
    url: 'https://fake-json-api.mock.beeceptor.com/companies',
    description: 'Get a list of ten random companies.'
  },
  {
    url: 'https://dummy-json.mock.beeceptor.com/todos',
    description: 'A sample Rest API to get a list of To Do tasks.'
  },
  {
    url: 'https://dummy-json.mock.beeceptor.com/posts',
    description: 'A sample JSON Rest API to get a list of blog posts.'
  },
  {
    url: 'https://dummy-json.mock.beeceptor.com/continents',
    description: 'A sample JSON API to get continents\' information.'
  }
];

export const ApiPanel: React.FC<ApiPanelProps> = ({ 
  isOpen = false, 
  onClose,
  showFloatingButton = false 
}) => {
  const { 
    apiRequest, 
    updateApiUrl, 
    updateApiMethod, 
    updateApiHeaders,
    updateApiBody,
    sendApiRequest,
    importApiRequest
  } = useEditorStore();
  
  const [showHeaders, setShowHeaders] = useState(false);
  const [showBody, setShowBody] = useState(false);
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('params');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [authType, setAuthType] = useState<AuthType>('noAuth');
  
  // Auth related state
  const [bearerToken, setBearerToken] = useState('');
  const [basicAuthUsername, setBasicAuthUsername] = useState('');
  const [basicAuthPassword, setBasicAuthPassword] = useState('');
  const [apiKeyName, setApiKeyName] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [apiKeyLocation, setApiKeyLocation] = useState<'header' | 'query'>('header');
  const [oauthAccessToken, setOauthAccessToken] = useState('');
  
  // Add state for response metrics
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseSize, setResponseSize] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get HTTP status text from status code
  const getStatusText = (statusCode: number | undefined): string => {
    if (!statusCode) return '';
    
    switch (statusCode) {
      // 1xx Informational
      case 100: return 'Continue';
      case 101: return 'Switching Protocols';
      case 102: return 'Processing';
      case 103: return 'Early Hints';
      
      // 2xx Success
      case 200: return 'OK';
      case 201: return 'Created';
      case 202: return 'Accepted';
      case 203: return 'Non-Authoritative Information';
      case 204: return 'No Content';
      case 205: return 'Reset Content';
      case 206: return 'Partial Content';
      
      // 3xx Redirection
      case 300: return 'Multiple Choices';
      case 301: return 'Moved Permanently';
      case 302: return 'Found';
      case 303: return 'See Other';
      case 304: return 'Not Modified';
      case 307: return 'Temporary Redirect';
      case 308: return 'Permanent Redirect';
      
      // 4xx Client Errors
      case 400: return 'Bad Request';
      case 401: return 'Unauthorized';
      case 402: return 'Payment Required';
      case 403: return 'Forbidden';
      case 404: return 'Not Found';
      case 405: return 'Method Not Allowed';
      case 406: return 'Not Acceptable';
      case 407: return 'Proxy Authentication Required';
      case 408: return 'Request Timeout';
      case 409: return 'Conflict';
      case 410: return 'Gone';
      case 411: return 'Length Required';
      case 412: return 'Precondition Failed';
      case 413: return 'Payload Too Large';
      case 414: return 'URI Too Long';
      case 415: return 'Unsupported Media Type';
      case 416: return 'Range Not Satisfiable';
      case 417: return 'Expectation Failed';
      case 418: return 'I\'m a teapot';
      case 429: return 'Too Many Requests';
      
      // 5xx Server Errors
      case 500: return 'Internal Server Error';
      case 501: return 'Not Implemented';
      case 502: return 'Bad Gateway';
      case 503: return 'Service Unavailable';
      case 504: return 'Gateway Timeout';
      case 505: return 'HTTP Version Not Supported';
      
      default: return '';
    }
  };

  // Effect to close modal on successful API response
  useEffect(() => {
    if (apiRequest.response && !apiRequest.loading && !apiRequest.error) {
      // Close the modal after a small delay to show the success response
      const timer = setTimeout(() => {
        handleClose();
        
        // Trigger fitView on the ReactFlow canvas to show nodes
        // Find the ReactFlow container and dispatch a custom event
        const flowContainer = document.querySelector('.react-flow');
        if (flowContainer) {
          const customEvent = new CustomEvent('api-response-complete');
          flowContainer.dispatchEvent(customEvent);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [apiRequest.response, apiRequest.loading, apiRequest.error]);

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateApiMethod(e.target.value as RequestMethod);
  };
  
  const addHeader = () => {
    if (!newHeaderKey.trim()) return;
    
    const newHeaders = {
      ...apiRequest.headers,
      [newHeaderKey]: newHeaderValue
    };
    
    updateApiHeaders(newHeaders);
    setNewHeaderKey('');
    setNewHeaderValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newHeaderKey.trim()) {
      addHeader();
    }
  };
  
  const removeHeader = (key: string) => {
    const newHeaders = { ...apiRequest.headers };
    delete newHeaders[key];
    updateApiHeaders(newHeaders);
  };

  const handleSendRequest = async () => {
    // Reset metrics
    setResponseTime(null);
    setResponseSize(null);
    
    const startTime = Date.now();
    await sendApiRequest();
    const endTime = Date.now();
    setResponseTime(endTime - startTime);
    
    // Calculate response size if we have a response
    if (apiRequest.response) {
      const responseStr = JSON.stringify(apiRequest.response);
      setResponseSize(new Blob([responseStr]).size);
    }
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(apiRequest.url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsPanelOpen(false);
    }
  };

  const handleOpen = () => {
    setIsPanelOpen(true);
  };

  // Determine if panel should be open based on props or internal state
  const shouldShowPanel = isOpen || isPanelOpen;

  const methods = [
    { value: 'GET', color: 'bg-green-100 text-green-800' },
    { value: 'POST', color: 'bg-blue-100 text-blue-800' },
    { value: 'PUT', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'DELETE', color: 'bg-red-100 text-red-800' },
    { value: 'PATCH', color: 'bg-purple-100 text-purple-800' }
  ];

  const getMethodColor = (method: string) => {
    return methods.find(m => m.value === method)?.color || '';
  };

  const formatRequestBody = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(apiRequest.body || '{}'), null, 2);
      updateApiBody(formatted);
    } catch (e) {
      // Ignore formatting errors
    }
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportError(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const json = JSON.parse(content);
        importApiRequest(json);
      } catch (error) {
        setImportError("Failed to import. Please make sure the file contains valid JSON.");
        console.error('Import error:', error);
      }
    };
    
    reader.onerror = () => {
      setImportError("Error reading file. Please try again.");
    };
    
    reader.readAsText(file);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update headers based on authorization
  const updateAuthorizationHeaders = (type: AuthType) => {
    setAuthType(type);
    const newHeaders = { ...apiRequest.headers };
    
    // First remove any existing auth headers
    delete newHeaders['Authorization'];
    delete newHeaders[apiKeyName];
    
    // Add new auth headers based on type
    if (type === 'bearerToken' && bearerToken) {
      newHeaders['Authorization'] = `Bearer ${bearerToken}`;
    } else if (type === 'basicAuth' && basicAuthUsername) {
      const credentials = btoa(`${basicAuthUsername}:${basicAuthPassword}`);
      newHeaders['Authorization'] = `Basic ${credentials}`;
    } else if (type === 'apiKey' && apiKeyName && apiKeyValue && apiKeyLocation === 'header') {
      newHeaders[apiKeyName] = apiKeyValue;
    }
    
    updateApiHeaders(newHeaders);
    
    // If API Key is in query params, update the URL
    if (type === 'apiKey' && apiKeyName && apiKeyValue && apiKeyLocation === 'query') {
      const url = new URL(apiRequest.url || 'https://example.com');
      url.searchParams.set(apiKeyName, apiKeyValue);
      updateApiUrl(url.toString());
    }
  };

  return (
    <>
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".json"
        onChange={handleFileImport}
      />
      
      {/* Collapsed view - button to open panel */}
      <AnimatePresence>
        {!shouldShowPanel && !isOpen && showFloatingButton && (
          <motion.div 
            className="fixed top-6 right-6 z-[100]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={handleOpen}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="mr-2" size={16} />
              API Request
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded panel */}
      <AnimatePresence>
        {shouldShowPanel && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] flex flex-col overflow-hidden"
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ 
                type: "tween", 
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier curve
              }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <motion.h2 
                    className="text-xl font-semibold text-gray-800"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                  >API Request</motion.h2>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button 
                    className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors text-sm font-medium"
                    title="Import API"
                    onClick={handleImportClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.12, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Download size={14} className="mr-1.5" />
                    Import
                  </motion.button>
                  <motion.button 
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                    onClick={handleClose}
                    title="Close"
                    whileHover={{ scale: 1.1, backgroundColor: "rgb(243 244 246)" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.14, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>
              
              {/* Import error message */}
              <AnimatePresence>
                {importError && (
                  <motion.div 
                    className="mx-6 mt-4 flex items-start p-3 bg-red-50 rounded-md border border-red-200 text-red-700 text-sm"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-0.5">Import failed</p>
                      <p className="text-red-600">{importError}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Request section */}
              <div className="flex-1 overflow-auto">
                <motion.div 
                  className="p-6 space-y-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* URL Bar with Method Selector */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">URL</label>
                    <div className="flex">
                      <select
                        value={apiRequest.method}
                        onChange={handleMethodChange}
                        className={`h-10 rounded-l-md border border-gray-300 font-medium px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[95px] ${getMethodColor(apiRequest.method)}`}
                      >
                        {methods.map(method => (
                          <option key={method.value} value={method.value}>{method.value}</option>
                        ))}
                      </select>
                      
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={apiRequest.url}
                          onChange={(e) => updateApiUrl(e.target.value)}
                          placeholder="https://api.example.com/endpoint"
                          className="h-10 w-full rounded-r-md border border-l-0 border-gray-300 px-3 pr-10
                                  text-sm text-gray-700 focus:outline-none focus:ring-2 
                                  focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button 
                          onClick={copyUrlToClipboard}
                          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                          title="Copy URL"
                        >
                          {copySuccess ? <CheckCircle size={16} className="text-green-500" /> : <Clipboard size={16} />}
                        </button>
                      </div>
                      
                      <button
                        onClick={handleSendRequest}
                        disabled={apiRequest.loading}
                        className={`ml-2 h-10 px-5 rounded-md flex items-center justify-center 
                                  text-white font-medium transition-colors ${apiRequest.loading 
                                              ? 'bg-blue-400 cursor-not-allowed' 
                                              : 'bg-blue-600 hover:bg-blue-700 shadow-sm'}`}
                      >
                        {apiRequest.loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} className="mr-1.5" />
                            Send
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {apiRequest.error && (
                      <motion.div 
                        className="flex items-start p-3 bg-red-50 rounded-md border border-red-200 text-red-700 text-sm"
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-0.5">Request failed</p>
                          <p className="text-red-600">{apiRequest.error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Request options tabs */}
                  <motion.div 
                    className="border border-gray-200 rounded-md overflow-hidden"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="bg-gray-50 border-b border-gray-200">
                      <div className="flex">
                        {['params', 'authorization', 'headers', 'body', 'examples'].map((tab) => (
                          <button
                            key={tab}
                            className={`
                              px-4 py-2 text-sm font-medium relative
                              ${activeTab === tab 
                                ? 'text-blue-600' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                            `}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {activeTab === tab && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {activeTab === 'headers' && (
                        <div className="space-y-3">
                          {/* Headers List */}
                          {Object.entries(apiRequest.headers).length > 0 ? (
                            <div className="space-y-2">
                              {Object.entries(apiRequest.headers).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={key}
                                    disabled
                                    className="h-9 w-1/3 rounded-md border border-gray-300 px-3 
                                            text-sm font-medium text-gray-700 bg-gray-50"
                                  />
                                  <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => {
                                      const newHeaders = { ...apiRequest.headers, [key]: e.target.value };
                                      updateApiHeaders(newHeaders);
                                    }}
                                    className="h-9 flex-1 rounded-md border border-gray-300 px-3 
                                            text-sm text-gray-700 focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <button
                                    onClick={() => removeHeader(key)}
                                    className="h-9 w-9 flex items-center justify-center text-gray-500 
                                              hover:text-red-500 hover:bg-gray-100 rounded-md"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-2 text-sm text-gray-500 italic">No headers added yet</div>
                          )}
                          
                          {/* Add New Header */}
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <input
                              type="text"
                              value={newHeaderKey}
                              onChange={(e) => setNewHeaderKey(e.target.value)}
                              onKeyDown={handleKeyDown}
                              placeholder="Header Name"
                              className="h-9 w-1/3 rounded-md border border-gray-300 px-3 
                                      text-sm text-gray-700 focus:outline-none focus:ring-2 
                                      focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="text"
                              value={newHeaderValue}
                              onChange={(e) => setNewHeaderValue(e.target.value)}
                              onKeyDown={handleKeyDown}
                              placeholder="Value"
                              className="h-9 flex-1 rounded-md border border-gray-300 px-3 
                                      text-sm text-gray-700 focus:outline-none focus:ring-2 
                                      focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              onClick={addHeader}
                              disabled={!newHeaderKey.trim()}
                              className={`h-9 px-3 rounded-md flex items-center justify-center
                                        ${!newHeaderKey.trim() 
                                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                            >
                              <Plus size={16} className="mr-1" />
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'body' && (
                        <div>
                          <div className="mb-2 flex items-center space-x-2">
                            <label className="flex items-center">
                              <input type="radio" name="body-type" className="mr-1.5" defaultChecked />
                              <span className="text-sm font-medium">raw</span>
                            </label>
                            <label className="flex items-center">
                              <input type="radio" name="body-type" className="mr-1.5" />
                              <span className="text-sm font-medium">form-data</span>
                            </label>
                            <label className="flex items-center">
                              <input type="radio" name="body-type" className="mr-1.5" />
                              <span className="text-sm font-medium">x-www-form-urlencoded</span>
                            </label>
                          </div>
                          
                          <textarea
                            value={apiRequest.body}
                            onChange={(e) => updateApiBody(e.target.value)}
                            placeholder='{\n  "key": "value"\n}'
                            className="w-full rounded-md border border-gray-300 p-3 h-36
                                     text-sm text-gray-700 focus:outline-none focus:ring-2 
                                     focus:ring-blue-500 focus:border-blue-500 font-mono"
                          />
                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={formatRequestBody}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Format JSON
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'params' && (
                        <div className="py-2 text-sm">
                          <p className="text-gray-500 mb-2">Add query parameters to the URL:</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Parameter name"
                                className="h-9 w-1/3 rounded-md border border-gray-300 px-3 
                                        text-sm text-gray-700 focus:outline-none focus:ring-2 
                                        focus:ring-blue-500 focus:border-blue-500"
                              />
                              <input
                                type="text"
                                placeholder="Value"
                                className="h-9 flex-1 rounded-md border border-gray-300 px-3 
                                        text-sm text-gray-700 focus:outline-none focus:ring-2 
                                        focus:ring-blue-500 focus:border-blue-500"
                              />
                              <button
                                className="h-9 px-3 rounded-md flex items-center justify-center
                                          bg-blue-50 text-blue-600 hover:bg-blue-100"
                              >
                                <Plus size={16} className="mr-1" />
                                Add
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Parameters will be added as <span className="font-mono">?param=value</span> to the URL
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'examples' && (
                        <div className="py-2 text-sm">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Example API calls</h3>
                          <div className="space-y-2">
                            {exampleApiCalls.map((example, index) => (
                              <div 
                                key={index}
                                className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                                onClick={() => updateApiUrl(example.url)}
                                title="Click to use this API"
                              >
                                <p className="text-sm font-medium text-blue-600 font-mono mb-1">{example.url}</p>
                                <p className="text-xs text-gray-600">{example.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'authorization' && (
                        <div className="py-2 text-sm space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select 
                              className="w-full h-9 rounded-md border border-gray-300 px-3 text-sm"
                              value={authType}
                              onChange={(e) => updateAuthorizationHeaders(e.target.value as AuthType)}
                            >
                              <option value="noAuth">No Auth</option>
                              <option value="bearerToken">Bearer Token</option>
                              <option value="basicAuth">Basic Auth</option>
                              <option value="apiKey">API Key</option>
                              <option value="oauth2">OAuth 2.0</option>
                            </select>
                          </div>
                          
                          {/* Bearer Token Auth */}
                          {authType === 'bearerToken' && (
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Token</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={bearerToken}
                                  onChange={(e) => {
                                    setBearerToken(e.target.value);
                                    if (e.target.value) {
                                      const newHeaders = { ...apiRequest.headers };
                                      newHeaders['Authorization'] = `Bearer ${e.target.value}`;
                                      updateApiHeaders(newHeaders);
                                    }
                                  }}
                                  placeholder="Enter token"
                                  className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-3 
                                          text-sm text-gray-700 focus:outline-none focus:ring-2 
                                          focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Key size={16} className="absolute left-3 top-2.5 text-gray-400" />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Token will be sent as: <span className="font-mono bg-gray-100 px-1">Authorization: Bearer {bearerToken || 'token'}</span>
                              </p>
                            </div>
                          )}
                          
                          {/* Basic Auth */}
                          {authType === 'basicAuth' && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                  type="text"
                                  value={basicAuthUsername}
                                  onChange={(e) => {
                                    setBasicAuthUsername(e.target.value);
                                    if (e.target.value) {
                                      const credentials = btoa(`${e.target.value}:${basicAuthPassword}`);
                                      const newHeaders = { ...apiRequest.headers };
                                      newHeaders['Authorization'] = `Basic ${credentials}`;
                                      updateApiHeaders(newHeaders);
                                    }
                                  }}
                                  placeholder="Username"
                                  className="h-9 w-full rounded-md border border-gray-300 px-3 
                                          text-sm text-gray-700 focus:outline-none focus:ring-2 
                                          focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                  <input
                                    type="password"
                                    value={basicAuthPassword}
                                    onChange={(e) => {
                                      setBasicAuthPassword(e.target.value);
                                      if (basicAuthUsername) {
                                        const credentials = btoa(`${basicAuthUsername}:${e.target.value}`);
                                        const newHeaders = { ...apiRequest.headers };
                                        newHeaders['Authorization'] = `Basic ${credentials}`;
                                        updateApiHeaders(newHeaders);
                                      }
                                    }}
                                    placeholder="Password"
                                    className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-3 
                                            text-sm text-gray-700 focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <Lock size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* API Key Auth */}
                          {authType === 'apiKey' && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
                                <input
                                  type="text"
                                  value={apiKeyName}
                                  onChange={(e) => setApiKeyName(e.target.value)}
                                  placeholder="API Key Name (e.g. X-API-Key)"
                                  className="h-9 w-full rounded-md border border-gray-300 px-3 
                                          text-sm text-gray-700 focus:outline-none focus:ring-2 
                                          focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Key Value</label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={apiKeyValue}
                                    onChange={(e) => setApiKeyValue(e.target.value)}
                                    placeholder="API Key Value"
                                    className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-3 
                                            text-sm text-gray-700 focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <Key size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Add to</label>
                                <div className="flex gap-4">
                                  <label className="flex items-center">
                                    <input 
                                      type="radio" 
                                      name="api-key-location"
                                      checked={apiKeyLocation === 'header'} 
                                      onChange={() => setApiKeyLocation('header')}
                                      className="mr-1.5" 
                                    />
                                    <span className="text-sm">Header</span>
                                  </label>
                                  <label className="flex items-center">
                                    <input 
                                      type="radio" 
                                      name="api-key-location" 
                                      checked={apiKeyLocation === 'query'}
                                      onChange={() => setApiKeyLocation('query')}
                                      className="mr-1.5" 
                                    />
                                    <span className="text-sm">Query Param</span>
                                  </label>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  if (apiKeyName && apiKeyValue) {
                                    if (apiKeyLocation === 'header') {
                                      const newHeaders = { ...apiRequest.headers };
                                      newHeaders[apiKeyName] = apiKeyValue;
                                      updateApiHeaders(newHeaders);
                                    } else {
                                      // Add as query parameter to URL
                                      try {
                                        const url = new URL(apiRequest.url || 'https://example.com');
                                        url.searchParams.set(apiKeyName, apiKeyValue);
                                        updateApiUrl(url.toString());
                                      } catch (e) {
                                        // If URL is invalid, just skip
                                      }
                                    }
                                  }
                                }}
                                disabled={!apiKeyName || !apiKeyValue}
                                className={`h-9 px-4 rounded-md flex items-center justify-center
                                          ${!apiKeyName || !apiKeyValue
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                              >
                                Apply
                              </button>
                            </div>
                          )}
                          
                          {/* OAuth 2.0 */}
                          {authType === 'oauth2' && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={oauthAccessToken}
                                    onChange={(e) => {
                                      setOauthAccessToken(e.target.value);
                                      if (e.target.value) {
                                        const newHeaders = { ...apiRequest.headers };
                                        newHeaders['Authorization'] = `Bearer ${e.target.value}`;
                                        updateApiHeaders(newHeaders);
                                      }
                                    }}
                                    placeholder="Enter access token"
                                    className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-3 
                                            text-sm text-gray-700 focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <Key size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Token will be sent as: <span className="font-mono bg-gray-100 px-1">Authorization: Bearer {oauthAccessToken || 'token'}</span>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Response section */}
              <motion.div 
                className="border-t border-gray-200 bg-gray-50 p-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">Response</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {apiRequest.loading ? (
                        <svg className="animate-spin mr-2 h-3.5 w-3.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      <span className="text-xs font-medium text-gray-600">
                        Status: {
                          apiRequest.loading ? 
                            <span className="text-blue-500">Loading...</span> : 
                            apiRequest.error ? 
                              <span className="text-red-500">Error</span> :
                              apiRequest.statusCode ? 
                                <span className={
                                  apiRequest.statusCode >= 200 && apiRequest.statusCode < 300 
                                    ? "text-green-500" 
                                    : apiRequest.statusCode >= 400 
                                      ? "text-red-500" 
                                      : "text-yellow-500"
                                }>
                                  {apiRequest.statusCode} {getStatusText(apiRequest.statusCode)}
                                </span> :
                                <span className="text-gray-500">Waiting</span>
                        }
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">
                      Time: {responseTime ? `${responseTime}ms` : '--'}
                    </span>
                    <span className="text-xs text-gray-600">
                      Size: {responseSize ? 
                        responseSize < 1024 ? 
                          `${responseSize}B` : 
                          `${(responseSize / 1024).toFixed(1)}KB` 
                        : '--'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 
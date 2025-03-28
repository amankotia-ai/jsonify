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

// Example API calls from the list (kept for examples tab only)
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
    { value: 'GET' },
    { value: 'POST' },
    { value: 'PUT' },
    { value: 'DELETE' },
    { value: 'PATCH' }
  ];

  const getMethodColor = (method: string) => {
    return 'bg-[#F4F6FF] text-primary';
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
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        if (importApiRequest) {
          importApiRequest(data);
          setImportError(null);
        }
      } catch (err) {
        setImportError('Invalid JSON format');
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Update auth headers based on auth type
  const updateAuthorizationHeaders = (type: AuthType) => {
    setAuthType(type);
    
    // Reset all auth headers first
    const newHeaders = { ...apiRequest.headers };
    delete newHeaders['Authorization'];
    delete newHeaders[apiKeyName];
    
    // Set appropriate auth headers based on type
    switch (type) {
      case 'bearerToken':
        if (bearerToken) {
          newHeaders['Authorization'] = `Bearer ${bearerToken}`;
        }
        break;
      case 'basicAuth':
        if (basicAuthUsername && basicAuthPassword) {
          const encoded = btoa(`${basicAuthUsername}:${basicAuthPassword}`);
          newHeaders['Authorization'] = `Basic ${encoded}`;
        }
        break;
      case 'apiKey':
        if (apiKeyName && apiKeyValue) {
          if (apiKeyLocation === 'header') {
            newHeaders[apiKeyName] = apiKeyValue;
          }
          // Query params handled separately when making the request
        }
        break;
      case 'oauth2':
        if (oauthAccessToken) {
          newHeaders['Authorization'] = `Bearer ${oauthAccessToken}`;
        }
        break;
    }
    
    updateApiHeaders(newHeaders);
  };

  return (
    <>
      {/* Import file input (hidden) */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json"
        onChange={handleFileImport}
      />
    
      {/* Floating toggle button */}
      {showFloatingButton && !shouldShowPanel && (
        <motion.button
          onClick={handleOpen}
          className="fixed bottom-4 right-4 z-[100] bg-secondary shadow-lg rounded-full p-3 border border-accent2 text-primary"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Globe size={24} />
        </motion.button>
      )}
      
      {/* Main API Panel */}
      <AnimatePresence>
        {shouldShowPanel && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-secondary rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="text-primary" size={20} />
                  <h2 className="text-lg font-medium text-primary">API Request</h2>
                </div>
                <button 
                  onClick={handleClose}
                  className="text-accent1 hover:text-primary rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* URL Bar */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0 w-28">
                      <select 
                        value={apiRequest.method} 
                        onChange={handleMethodChange}
                        className="bg-[#F4F6FF] text-primary text-sm font-medium rounded px-2 py-2 pr-8 border border-accent2/30 focus:outline-none focus:ring-1 focus:ring-primary appearance-none h-[42px] w-full"
                        style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23364CD5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                      >
                        {methods.map(method => (
                          <option key={method.value} value={method.value}>{method.value}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex-1 relative group">
                      <input 
                        type="text" 
                        value={apiRequest.url} 
                        onChange={(e) => updateApiUrl(e.target.value)}
                        placeholder="Enter API URL e.g. https://api.example.com/data"
                        className="w-full h-[42px] py-2 px-3 border border-accent2/30 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-secondary"
                      />
                      
                      <button 
                        onClick={copyUrlToClipboard}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent1 hover:text-primary transition-colors"
                        title="Copy URL"
                      >
                        {copySuccess ? <CheckCircle size={16} /> : <Clipboard size={16} />}
                      </button>
                    </div>
                    
                    <button
                      onClick={handleSendRequest}
                      disabled={apiRequest.loading || !apiRequest.url.trim()}
                      className={`h-[42px] px-4 rounded font-medium text-sm flex items-center justify-center transition-colors ${
                        apiRequest.loading || !apiRequest.url.trim() 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      {apiRequest.loading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-1" />
                      ) : (
                        <Send size={16} className="mr-1" />
                      )}
                      {apiRequest.loading ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                  
                  {/* Removed URL suggestions/example buttons */}
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {apiRequest.error && (
                    <motion.div 
                      className="flex items-start p-3 bg-primary/5 rounded-md border border-primary/20 text-primary text-sm"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium mb-0.5">Request failed</p>
                        <p className="text-primary/80">{apiRequest.error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Request options tabs - fixed height container */}
                <motion.div 
                  className="border border-accent2/30 rounded-md overflow-hidden"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="bg-accent2/5 border-b border-accent2/30">
                    <div className="flex">
                      {['params', 'authorization', 'headers', 'body', 'examples'].map((tab) => (
                        <button
                          key={tab}
                          className={`
                            px-4 py-2 text-sm font-medium relative
                            ${activeTab === tab 
                              ? 'text-primary' 
                              : 'text-accent1 hover:text-primary hover:bg-accent2/10'}
                          `}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Fixed height content area */}
                  <div className="p-4 overflow-y-auto" style={{ height: '300px' }}>
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
                                  className="h-9 w-1/3 rounded-md border border-accent2/30 px-3 
                                          text-sm font-medium text-primary bg-accent2/5"
                                />
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => {
                                    const newHeaders = { ...apiRequest.headers, [key]: e.target.value };
                                    updateApiHeaders(newHeaders);
                                  }}
                                  className="h-9 flex-1 rounded-md border border-accent2/30 px-3 
                                          text-sm text-primary focus:outline-none focus:ring-1 
                                          focus:ring-primary focus:border-primary bg-secondary"
                                />
                                <button
                                  onClick={() => removeHeader(key)}
                                  className="h-9 w-9 flex items-center justify-center text-accent1 
                                            hover:text-primary hover:bg-accent2/10 rounded-md"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-2 text-sm text-accent1 italic">No headers added yet</div>
                        )}
                        
                        {/* Add New Header */}
                        <div className="flex items-center gap-2 pt-2 border-t border-accent2/10">
                          <input
                            type="text"
                            value={newHeaderKey}
                            onChange={(e) => setNewHeaderKey(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Header Name"
                            className="h-9 w-1/3 rounded-md border border-accent2/30 px-3 
                                    text-sm text-primary focus:outline-none focus:ring-1 
                                    focus:ring-primary focus:border-primary bg-secondary"
                          />
                          <input
                            type="text"
                            value={newHeaderValue}
                            onChange={(e) => setNewHeaderValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Value"
                            className="h-9 flex-1 rounded-md border border-accent2/30 px-3 
                                    text-sm text-primary focus:outline-none focus:ring-1 
                                    focus:ring-primary focus:border-primary bg-secondary"
                          />
                          <button
                            onClick={addHeader}
                            disabled={!newHeaderKey.trim()}
                            className={`h-9 px-3 rounded-md flex items-center justify-center
                                      ${!newHeaderKey.trim() 
                                        ? 'bg-accent2/5 text-accent1/50 cursor-not-allowed'
                                        : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
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
                            <input type="radio" name="body-type" className="mr-1.5 text-primary" defaultChecked />
                            <span className="text-sm font-medium text-primary">raw</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="body-type" className="mr-1.5 text-primary" />
                            <span className="text-sm font-medium text-primary">form-data</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="body-type" className="mr-1.5 text-primary" />
                            <span className="text-sm font-medium text-primary">x-www-form-urlencoded</span>
                          </label>
                        </div>
                        
                        <textarea
                          value={apiRequest.body}
                          onChange={(e) => updateApiBody(e.target.value)}
                          placeholder='{\n  "key": "value"\n}'
                          className="w-full rounded-md border border-accent2/30 p-3 h-36
                                   text-sm text-primary focus:outline-none focus:ring-1 
                                   focus:ring-primary focus:border-primary bg-secondary font-mono"
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={formatRequestBody}
                            className="text-xs text-primary hover:text-primary/80 font-medium"
                          >
                            Format JSON
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'params' && (
                      <div className="py-2 text-sm">
                        <p className="text-accent1 mb-2">Add query parameters to the URL:</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Parameter name"
                              className="h-9 w-1/3 rounded-md border border-accent2/30 px-3 
                                      text-sm text-primary focus:outline-none focus:ring-1 
                                      focus:ring-primary focus:border-primary bg-secondary"
                            />
                            <input
                              type="text"
                              placeholder="Value"
                              className="h-9 flex-1 rounded-md border border-accent2/30 px-3 
                                      text-sm text-primary focus:outline-none focus:ring-1 
                                      focus:ring-primary focus:border-primary bg-secondary"
                            />
                            <button
                              className="h-9 px-3 rounded-md flex items-center justify-center
                                        bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              <Plus size={16} className="mr-1" />
                              Add
                            </button>
                          </div>
                          <p className="text-xs text-accent1 mt-2">
                            Parameters will be added as <span className="font-mono bg-accent2/10 px-1">?param=value</span> to the URL
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'examples' && (
                      <div className="py-2 text-sm">
                        <h3 className="text-sm font-medium text-primary mb-2">Example API calls</h3>
                        <div className="space-y-2">
                          {exampleApiCalls.map((example, index) => (
                            <div 
                              key={index}
                              className="p-2 border border-accent2/30 rounded-md hover:bg-accent2/10 cursor-pointer"
                              onClick={() => updateApiUrl(example.url)}
                              title="Click to use this API"
                            >
                              <p className="text-sm font-medium text-primary font-mono mb-1">{example.url}</p>
                              <p className="text-xs text-accent1">{example.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'authorization' && (
                      <div className="py-2 text-sm space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-1">Type</label>
                          <select 
                            className="w-full h-9 rounded-md border border-accent2/30 px-3 text-sm text-primary 
                                      focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-secondary"
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
                            <label className="block text-sm font-medium text-primary">Token</label>
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
                                className="h-9 w-full rounded-md border border-accent2/30 pl-9 pr-3 
                                        text-sm text-primary focus:outline-none focus:ring-1 
                                        focus:ring-primary focus:border-primary bg-secondary"
                              />
                              <Key size={16} className="absolute left-3 top-2.5 text-accent1" />
                            </div>
                            <p className="text-xs text-accent1 mt-1">
                              Token will be sent as: <span className="font-mono bg-accent2/10 px-1">Authorization: Bearer {bearerToken || 'token'}</span>
                            </p>
                          </div>
                        )}
                        
                        {/* Basic Auth */}
                        {authType === 'basicAuth' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-primary mb-1">Username</label>
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
                                className="h-9 w-full rounded-md border border-accent2/30 px-3 
                                        text-sm text-primary focus:outline-none focus:ring-1 
                                        focus:ring-primary focus:border-primary bg-secondary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-primary mb-1">Password</label>
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
                                  className="h-9 w-full rounded-md border border-accent2/30 pl-9 pr-3 
                                          text-sm text-primary focus:outline-none focus:ring-1 
                                          focus:ring-primary focus:border-primary bg-secondary"
                                />
                                <Lock size={16} className="absolute left-3 top-2.5 text-accent1" />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* API Key Auth */}
                        {authType === 'apiKey' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-primary mb-1">Key Name</label>
                              <input
                                type="text"
                                value={apiKeyName}
                                onChange={(e) => setApiKeyName(e.target.value)}
                                placeholder="API Key Name (e.g. X-API-Key)"
                                className="h-9 w-full rounded-md border border-accent2/30 px-3 
                                        text-sm text-primary focus:outline-none focus:ring-1 
                                        focus:ring-primary focus:border-primary bg-secondary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-primary mb-1">Key Value</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={apiKeyValue}
                                  onChange={(e) => setApiKeyValue(e.target.value)}
                                  placeholder="API Key Value"
                                  className="h-9 w-full rounded-md border border-accent2/30 pl-9 pr-3 
                                          text-sm text-primary focus:outline-none focus:ring-1 
                                          focus:ring-primary focus:border-primary bg-secondary"
                                />
                                <Key size={16} className="absolute left-3 top-2.5 text-accent1" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-primary mb-1">Add to</label>
                              <div className="flex gap-4">
                                <label className="flex items-center">
                                  <input 
                                    type="radio" 
                                    name="api-key-location"
                                    checked={apiKeyLocation === 'header'} 
                                    onChange={() => setApiKeyLocation('header')}
                                    className="mr-1.5 text-primary" 
                                  />
                                  <span className="text-sm text-primary">Header</span>
                                </label>
                                <label className="flex items-center">
                                  <input 
                                    type="radio" 
                                    name="api-key-location" 
                                    checked={apiKeyLocation === 'query'}
                                    onChange={() => setApiKeyLocation('query')}
                                    className="mr-1.5 text-primary" 
                                  />
                                  <span className="text-sm text-primary">Query Param</span>
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
                                          ? 'bg-accent2/5 text-accent1/50 cursor-not-allowed'
                                          : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                            >
                              Apply
                            </button>
                          </div>
                        )}
                        
                        {/* OAuth 2.0 */}
                        {authType === 'oauth2' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-primary mb-1">Access Token</label>
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
                                  className="h-9 w-full rounded-md border border-accent2/30 pl-9 pr-3 
                                          text-sm text-primary focus:outline-none focus:ring-1 
                                          focus:ring-primary focus:border-primary bg-secondary"
                                />
                                <Key size={16} className="absolute left-3 top-2.5 text-accent1" />
                              </div>
                              <p className="text-xs text-accent1 mt-1">
                                Token will be sent as: <span className="font-mono bg-accent2/10 px-1">Authorization: Bearer {oauthAccessToken || 'token'}</span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
              
              {/* Response section styled to match monotone UI */}
              <motion.div 
                className="border-t border-accent2/30 bg-accent2/5 p-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-primary">Response</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {apiRequest.loading ? (
                        <svg className="animate-spin mr-2 h-3.5 w-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      <span className="text-xs font-medium text-accent1">
                        Status: {
                          apiRequest.loading ? 
                            <span className="text-primary">Loading...</span> : 
                            apiRequest.error ? 
                              <span className="text-primary/80">Error</span> :
                              apiRequest.statusCode ? 
                                <span className={
                                  apiRequest.statusCode >= 200 && apiRequest.statusCode < 300 
                                    ? "text-primary" 
                                    : apiRequest.statusCode >= 400 
                                      ? "text-primary/80" 
                                      : "text-accent1"
                                }>
                                  {apiRequest.statusCode} {getStatusText(apiRequest.statusCode)}
                                </span> :
                                <span className="text-accent1/80">Waiting</span>
                        }
                      </span>
                    </div>
                    <span className="text-xs text-accent1">
                      Time: {responseTime ? `${responseTime}ms` : '--'}
                    </span>
                    <span className="text-xs text-accent1">
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
import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { yaml as yamlLanguage } from '@codemirror/lang-yaml';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import yaml from 'js-yaml';
import { useEditorStore } from '../../store/editorStore';

export const CodeEditor: React.FC = () => {
  const { rawData, selectedFormat, updateRawData } = useEditorStore();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for system dark mode preference
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    
    const updateTheme = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', updateTheme);
    return () => darkModeMediaQuery.removeEventListener('change', updateTheme);
  }, []);

  // Validate data whenever it changes
  useEffect(() => {
    if (!rawData.trim()) {
      setValidationError(null);
      return;
    }

    try {
      if (selectedFormat === 'json') {
        JSON.parse(rawData);
      } else {
        // YAML validation
        yaml.load(rawData);
      }
      setValidationError(null);
    } catch (error) {
      if (error instanceof Error) {
        setValidationError(error.message);
      } else {
        setValidationError('Invalid format');
      }
    }
  }, [rawData, selectedFormat]);

  const handleChange = React.useCallback((value: string) => {
    updateRawData(value);
  }, [updateRawData]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        {!rawData.trim() && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-400 text-sm">
              Enter your {selectedFormat.toUpperCase()} data here...
            </span>
          </div>
        )}
        <CodeMirror
          value={rawData}
          height="100%"
          theme={isDarkMode ? 'dark' : 'light'}
          onChange={handleChange}
          extensions={[
            selectedFormat === 'json' ? json() : yamlLanguage(),
            EditorView.lineWrapping,
            ...(isDarkMode ? [oneDark] : []),
          ]}
          basicSetup={{
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            lineNumbers: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
          }}
          className="h-full text-sm"
        />
      </div>
      
      {validationError && (
        <div className="p-3 bg-red-50 border-t border-red-300 text-red-700 text-sm font-medium shadow-sm z-10 sticky bottom-0">
          <p className="leading-tight">Error: {validationError}</p>
        </div>
      )}
    </div>
  );
};
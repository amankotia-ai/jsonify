import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { useEditorStore } from '../../store/editorStore';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Tag, tags } from '@lezer/highlight';

// Create custom syntax highlighting for our monotone theme
const monotoneHighlightStyle = HighlightStyle.define([
  { tag: [tags.comment], color: '#879AF8' },
  { tag: [tags.variableName], color: '#364CD5' },
  { tag: [tags.definition], color: '#364CD5', fontWeight: 'bold' },
  { tag: [tags.punctuation], color: '#5067F5' },
  { tag: [tags.propertyName], color: '#5067F5' },
  { tag: [tags.number], color: '#5067F5' },
  { tag: [tags.string], color: '#364CD5' },
  { tag: [tags.keyword], color: '#5067F5', fontWeight: 'bold' },
  { tag: [tags.operator], color: '#5067F5' },
  { tag: [tags.bracket], color: '#879AF8' },
  { tag: [tags.invalid], color: '#FF0000' },
]);

// Light theme styles
const monotoneTheme = EditorView.theme({
  '&': {
    backgroundColor: '#F4F6FF',
    color: '#364CD5',
  },
  '.cm-content': {
    caretColor: '#364CD5',
  },
  '.cm-cursor': {
    borderLeftColor: '#364CD5',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#364CD5',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
    backgroundColor: '#879AF850',
  },
  '.cm-gutters': {
    backgroundColor: '#F4F6FF',
    color: '#5067F5',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#879AF815',
  },
  '.cm-activeLine': {
    backgroundColor: '#879AF810',
  },
  '.cm-selectionMatch': {
    backgroundColor: '#879AF830',
  },
});

// Combine theme with syntax highlighting
const monotoneCodeTheme = [monotoneTheme, syntaxHighlighting(monotoneHighlightStyle)];

export const CodeEditor: React.FC = () => {
  const { rawData, updateRawData } = useEditorStore();
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
      JSON.parse(rawData);
      setValidationError(null);
    } catch (error) {
      if (error instanceof Error) {
        setValidationError(error.message);
      } else {
        setValidationError('Invalid format');
      }
    }
  }, [rawData]);

  const handleChange = React.useCallback((value: string) => {
    updateRawData(value);
  }, [updateRawData]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        {!rawData.trim() && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-accent1 text-sm">
              Enter your JSON data here...
            </span>
          </div>
        )}
        <CodeMirror
          value={rawData}
          height="100%"
          theme={isDarkMode ? "dark" : "light"}
          onChange={handleChange}
          extensions={[
            json(),
            EditorView.lineWrapping,
            ...(isDarkMode ? [oneDark] : monotoneCodeTheme),
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
        <div className="p-3 bg-primary/5 border-t border-primary/20 text-primary text-sm font-medium shadow-sm z-10 sticky bottom-0">
          <p className="leading-tight">Error: {validationError}</p>
        </div>
      )}
    </div>
  );
};
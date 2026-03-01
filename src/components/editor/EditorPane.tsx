'use client';

import { useRef, useEffect, useCallback } from 'react';
import Editor, { OnMount, OnChange, BeforeMount } from '@monaco-editor/react';
import { usePrismStore } from '@/store/usePrismStore';
import * as monaco from 'monaco-editor';
import { PanelLeftIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function EditorPane() {
  const { activeFile, files, updateFileContent, isSidebarOpen, toggleSidebar, saveFile, unsavedFiles } = usePrismStore();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);
  const suggestionRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const providerRef = useRef<monaco.IDisposable | null>(null);

  const file = files.find((f) => f.name === activeFile);
  const isDirty = activeFile ? unsavedFiles.includes(activeFile) : false;

  const triggerAutocomplete = useCallback(async (code: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/autocomplete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) throw new Error('Backend disconnected');

      const data = await response.json();
      suggestionRef.current = data.suggestion;
      editorRef.current?.trigger('keyboard', 'editor.action.inlineSuggest.trigger', {});

    } catch {
      // Mock suggestion
      suggestionRef.current = '  # Mock Autocomplete: print("Hello Prism")';
      editorRef.current?.trigger('keyboard', 'editor.action.inlineSuggest.trigger', {});
    }
  }, []);

  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined && activeFile) {
      updateFileContent(activeFile, value);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        triggerAutocomplete(value);
      }, 400);
    }
  };

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    // Dispose previous provider if exists
    if (providerRef.current) {
        providerRef.current.dispose();
    }

    providerRef.current = monacoInstance.languages.registerInlineCompletionsProvider('python', {
      provideInlineCompletions: async (model: monaco.editor.ITextModel, position: monaco.Position) => {
        if (suggestionRef.current) {
          const text = suggestionRef.current;
          suggestionRef.current = '';
          return {
            items: [{
              insertText: text,
              range: new monacoInstance.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
              )
            }]
          };
        }
        return { items: [] };
      },
      freeInlineCompletions: () => {}
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (activeFile) {
          saveFile(activeFile);
          toast.success('File saved');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, saveFile]);

  // Cleanup on unmount
  useEffect(() => {
      return () => {
          if (providerRef.current) {
              providerRef.current.dispose();
          }
      };
  }, []);

  const handleBeforeMount: BeforeMount = (monacoInstance) => {
    monacoInstance.editor.defineTheme('vercel-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#ededed',
        'editor.lineHighlightBackground': '#111111',
        'editor.selectionBackground': '#262626',
        'editor.inactiveSelectionBackground': '#111111'
      }
    });
  };

  return (
    <div className="h-full w-full bg-black overflow-hidden relative flex flex-col">
       <div className="h-9 border-b border-[#333333] flex items-center px-4 bg-[#0a0a0a] shrink-0 gap-3 justify-between">
          <div className="flex items-center gap-3">
            <button
                onClick={toggleSidebar}
                className="text-[#888888] hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
                <PanelLeftIcon className="w-4 h-4" />
            </button>
            <span className="text-sm text-[#888888] font-mono flex items-center gap-2">
                {activeFile}
                {isDirty && <span className="w-2 h-2 rounded-full bg-yellow-500" title="Unsaved changes"></span>}
            </span>
          </div>

          {activeFile && (
             <div className="flex items-center gap-2">
               <span className="text-xs text-[#444] font-mono hidden sm:block">
                 {isDirty ? 'Unsaved' : 'Saved'}
               </span>
             </div>
          )}
       </div>

       <div className="flex-1 relative">
         <Editor
            height="100%"
            theme="vercel-dark"
            language={activeFile?.endsWith('.py') ? 'python' : 'plaintext'}
            value={file?.content || ''}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            beforeMount={handleBeforeMount}
            options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'var(--font-geist-mono)',
            lineHeight: 24,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            }}
        />
       </div>
    </div>
  );
}

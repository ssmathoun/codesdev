import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import type { BeforeMount, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useRef, useEffect } from 'react';
import type { folderStructureData } from "../types/types";
import FileTabs from './FileTabs';
import WelcomePage from "./WelcomePage";

export default function CodeEditor({
  data,
  readOnly = false,
  getPath,
  handleOpenTab,
  isSaving,
  setIsSaving,
  updateFileContent,
  addItemToData,
  openedId,
  handleOpenedId,
  openedFileTabsId,
  handleOpenedFileTabsId,
  expandedIds,
  handleExpandedIds,
  itemLookup,
}: {
  data: folderStructureData[];
  readOnly?: boolean;
  getPath: (id: number) => number[];
  handleOpenTab: (id: number) => void;
  updateFileContent: (id: number, newContent: string) => void;
  addItemToData: (item: folderStructureData) => void;
  openedId: number | null;
  handleOpenedId: (opened: number) => void;
  openedFileTabsId: number[];
  handleOpenedFileTabsId: (id: number, toggle?: boolean) => void;
  expandedIds: number[];
  handleExpandedIds: (id: number) => void;
  itemLookup: Map<number, folderStructureData>;
  isSaving: boolean;
  setIsSaving: (prev: boolean) => void;
}) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null); // Stores current editor content
  const monaco = useMonaco(); // Access the monaco instance
  const activeFile = openedId !== null ? itemLookup.get(openedId) : null;

  const getLanguage = (fileName?: string) => {
    if (!fileName) return 'plaintext';
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    const languageMap: Record<string, string> = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'md': 'markdown',
        'c': 'c',
        'cpp': 'cpp',
        'java': 'java',
        'rb': 'ruby',
        'go': 'go'
    };

    return languageMap[ext!] || 'plaintext';
};
  
  const virtualPath =
    activeFile && openedId
      ? getPath(openedId)
          .map((id) => itemLookup.get(id)?.name)
          .join('/')
      : '';

  useEffect(() => {
    if (!monaco || !data) return;

    const currentUris = new Set<string>();

    const syncModelsRecursively = (items: folderStructureData[]) => {
      items.forEach((item) => {
        if (item.type === 'file') {
          const pathParts = getPath(item.id).map((id) => itemLookup.get(id)?.name);
          const fullPath = `file:///${pathParts.join('/')}`;
          const uri = monaco.Uri.parse(fullPath);
          currentUris.add(uri.toString());

          const model = monaco.editor.getModel(uri);

          if (model) {
            if (model.getValue() !== item.content) {
              model.setValue(item.content || '');
            }
          } else {
            // Use getLanguage to set the correct language per model
            monaco.editor.createModel(item.content || '', getLanguage(item.name), uri);
          }
        } else if (item.children) {
          syncModelsRecursively(item.children);
        }
      });
    };

    syncModelsRecursively(data);

    // Dispose of models that were deleted from the tree
    monaco.editor.getModels().forEach(model => {
      if (!currentUris.has(model.uri.toString())) {
          model.dispose();
      }
  });
  }, [data, monaco, getPath, itemLookup]);

  /*
    Setup TypeScript Compiler Options Before Mount
  */
  const handleEditorBeforeMount: BeforeMount = (monaco: any) => {
    const tsDefaults = monaco.languages.typescript.typescriptDefaults;

    tsDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      typeRoots: ['node_modules/@types'],
      baseUrl: 'file:///',
      paths: {
        "*": ["*"]
      }
    });
  };

  /*
    Function to handle editor mount event
  */
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();
  };

  /*
    Function to handle editor content change event
  */
    function handleEditorChange(value: string | undefined) {
      // Prevent updates if we are in read-only/preview mode
      if (readOnly) return; 
  
      if (openedId !== null && typeof value === 'string') {
        setIsSaving(true);
        updateFileContent(openedId, value);
      }
    }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">
      {openedId !== null && activeFile ? (
        <FileTabs
          data={data}
          getPath={getPath}
          handleOpenTab={handleOpenTab}
          openedId={openedId}
          handleOpenedId={handleOpenedId}
          openedFileTabsId={openedFileTabsId}
          handleOpenedFileTabsId={handleOpenedFileTabsId}
          expandedIds={expandedIds}
          handleExpandedIds={handleExpandedIds}
          itemLookup={itemLookup}
        />
      ) : null}

      {openedId !== null ? (
        <Editor
          height="100%"
          theme="vs-dark"
          path={`file:///${virtualPath}`}
          language = {getLanguage(activeFile?.name)}
          value={itemLookup.get(openedId)?.content}
          onMount={handleEditorDidMount}
          beforeMount={handleEditorBeforeMount}
          onChange={handleEditorChange}
          options={{
            readOnly: readOnly,
            domReadOnly: readOnly,
            automaticLayout: true,
            fontFamily:
              "'Fira Code', 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, 'Courier New', monospace",
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fixedOverflowWidgets: true,
          }}
        />
      ) : (
        <WelcomePage />
      )}
    </div>
  );
}
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import type { BeforeMount, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useRef, useEffect, useCallback, useMemo } from 'react';
import type { folderStructureData } from "../../../shared/types";
import FileTabs from './FileTabs';
import WelcomePage from "./WelcomePage";
import { socket } from '../services/socket';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness';

export default function CodeEditor({
  data,
  readOnly = false,
  projectId,
  getPath,
  currentUser,
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
  projectId: string | undefined;
  getPath: (id: number) => number[];
  currentUser: { username: string; avatar_id: string } | null;
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
  const modelPool = useRef<Map<string, { model: editor.ITextModel, binding: MonacoBinding }>>(new Map());
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monaco = useMonaco();
  
  const yDoc = useMemo(() => new Y.Doc(), []);
  const awareness = useMemo(() => new Awareness(yDoc), [yDoc]);
  
  const activeFile = openedId !== null ? itemLookup.get(openedId) : null;
  const virtualPath = useMemo(() => {
    return activeFile && openedId
      ? getPath(openedId).map((id) => itemLookup.get(id)?.name).join('/')
      : '';
  }, [openedId, activeFile, getPath, itemLookup]);


  const setupModel = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || !monaco || !openedId || !virtualPath || (editor as any)._isDisposed) return;
  
    const uri = monaco.Uri.parse(`file:///${virtualPath}`);
    const modelKey = uri.toString();
  
    try {
      let pooled = modelPool.current.get(modelKey);
  
      if (!pooled) {
        let model = monaco.editor.getModel(uri);
        const dbContent = itemLookup.get(openedId)?.content || "";
  
        if (!model) {
          model = monaco.editor.createModel(dbContent, getLanguage(activeFile?.name), uri);
        }
        
        const yText = yDoc.getText(openedId.toString());
        
        // If Yjs is new/empty, fill it with DB content immediately
        if (yText.toString().length === 0 && dbContent.length > 0) {
          yText.insert(0, dbContent);
        }
  
        const binding = new MonacoBinding(yText, model, new Set([editor]), awareness);
        pooled = { model, binding };
        modelPool.current.set(modelKey, pooled);
      }
  
      if (pooled.model && !pooled.model.isDisposed()) {
        if (editor.getModel() !== pooled.model) {
          editor.setModel(pooled.model);
        }
        
        editor.layout();
        setTimeout(() => editor.layout(), 10); 
      }
    } catch (e) {
      console.warn("Retrying model swap...");
      setTimeout(setupModel, 100);
    }
  }, [monaco, openedId, virtualPath, awareness, yDoc, activeFile?.name, itemLookup]);

// Stable Connection Effect
useEffect(() => {
  if (!projectId || !currentUser) return;
  const onYjs = (update: any) => Y.applyUpdate(yDoc, new Uint8Array(update));
  const onAware = (update: any) => applyAwarenessUpdate(awareness, new Uint8Array(update), 'remote');
  socket.on("yjs-update", onYjs);
  socket.on("awareness-update", onAware);
  const broadcastY = (update: Uint8Array) => socket.emit("yjs-update", update, projectId);
  const broadcastA = ({ added, updated, removed }: any) => {
    const changedIds = added.concat(updated).concat(removed);
    socket.emit("awareness-update", encodeAwarenessUpdate(awareness, changedIds), projectId);
  };
  yDoc.on('update', broadcastY);
  awareness.on('update', broadcastA);
  awareness.setLocalStateField('user', {
    name: currentUser.username,
    color: '#' + Math.floor(Math.random() * 16777215).toString(16)
  });
  return () => {
    socket.off("yjs-update", onYjs);
    socket.off("awareness-update", onAware);
    yDoc.off('update', broadcastY);
    awareness.off('update', broadcastA);
  };
}, [projectId, currentUser?.username, yDoc, awareness]);

// Fixes Visibility and the Disposed Error
useEffect(() => {
  setupModel();
}, [setupModel]);

// Cleanup on exit
useEffect(() => {
  return () => {
    modelPool.current.forEach(item => {
      item.binding.destroy();
      item.model.dispose();
    });
    modelPool.current.clear();
  };
}, [projectId]);

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
    Responsible for PostgreSQL persistence 
  */
  function handleEditorChange(value: string | undefined) {
    if (readOnly || value === undefined || !openedId) return;

    const currentContent = itemLookup.get(openedId)?.content;

    if (value !== currentContent) {
        setIsSaving(true);
        // Only updates the local React state which triggers the 2s debounce save to DB
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
          key="persistent-editor"
          height="100%"
          theme="vs-dark"
          beforeMount={handleEditorBeforeMount}
          onChange={handleEditorChange}
          onMount={(editor) => {
            editorRef.current = editor;
            setupModel();
            editor.focus();
          }}
          options={{
            readOnly: readOnly,
            domReadOnly: readOnly,
            automaticLayout: true,
            fontFamily: "'Fira Code', 'Cascadia Code', 'Source Code Pro', monospace",
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
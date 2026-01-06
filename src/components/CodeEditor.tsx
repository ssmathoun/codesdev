import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useRef } from 'react';
import type { folderStructureData } from "../types/types";
import FileTabs from './FileTabs';

export default function CodeEditor({data, isSaving, setIsSaving, updateFileContent, addItemToData, openedId, handleOpenedId, openedFileTabsId, handleOpenedFileTabsId, expandedIds, handleExpandedIds, itemLookup}: {data: folderStructureData[], updateFileContent: (id: number, newContent: string) => void, addItemToData: (item: folderStructureData) => void, openedId: number | null, handleOpenedId: (opened: number) => void, openedFileTabsId: number[], handleOpenedFileTabsId: (id: number, toggle?: boolean) => void, expandedIds: number[], handleExpandedIds: (id: number) => void, itemLookup: Map<number, folderStructureData>, isSaving: boolean, setIsSaving: (prev: boolean) => void}) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null); // Stores current editor content

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
    if (openedId !== null && typeof(value) === "string") {
      setIsSaving(true);
      updateFileContent(openedId, value);
    }
  }
  
  function showValue() {
    alert(editorRef.current?.getValue());
  }

  return (
    <>
      {openedId !== null ? (
      <FileTabs data={data} openedId={openedId} handleOpenedId={handleOpenedId}
      openedFileTabsId={openedFileTabsId} handleOpenedFileTabsId={handleOpenedFileTabsId}
      expandedIds={expandedIds} handleExpandedIds={handleExpandedIds} itemLookup={itemLookup}/>
      ) : null}

      {openedId !== null ? (
      <Editor 
        height="100%"
        theme="vs-dark" 
        defaultLanguage="javascript" 
        value={itemLookup.get(openedId)?.content}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          automaticLayout: true,
          fontFamily: "'Fira Code', 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, 'Courier New', monospace",
          fontSize: 14,
          minimap: { enabled: false },
        }}
      />
      ) : null}
    </>
  );
}
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useRef } from 'react';
import type folderStructureData from "../types/types";
import FileTabs from './FileTabs';

export default function CodeEditor({data, openedId, handleOpenedId, openedFileTabsId, handleOpenedFileTabsId, expandedIds, handleExpandedIds, itemLookup}: {data: folderStructureData[], openedId: number | null, handleOpenedId: (opened: number) => void, openedFileTabsId: number[], handleOpenedFileTabsId: (id: number) => void, expandedIds: number[], handleExpandedIds: (id: number) => void, itemLookup: Map<number, folderStructureData>}) {
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
    console.log('Editor value changed:', value);
  }
  
  function showValue() {
    alert(editorRef.current?.getValue());
  }

  return (
    <>
      <FileTabs data={data} openedId={openedId} handleOpenedId={handleOpenedId}
      openedFileTabsId={openedFileTabsId} handleOpenedFileTabsId={handleOpenedFileTabsId}
      expandedIds={expandedIds} handleExpandedIds={handleExpandedIds} itemLookup={itemLookup}/>

      <Editor 
        height="100vh"
        theme="vs-dark" 
        defaultLanguage="javascript" 
        defaultValue="// some comment" 
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
          fontFamily: "'Fira Code', 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, 'Courier New', monospace",
          fontSize: 14,
          minimap: { enabled: false },
        }}
      />
    </>
  );
}
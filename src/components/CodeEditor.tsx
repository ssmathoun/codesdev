import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useRef } from 'react';

export default function CodeEditor() {
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
    <button onClick={showValue}>Show Value</button>
    <Editor 
      height="90vh"
      theme="vs-dark" 
      defaultLanguage="javascript" 
      defaultValue="// some comment" 
      onMount={handleEditorDidMount}
      options={{
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: false },
      }}
    />
    </>

  );
}
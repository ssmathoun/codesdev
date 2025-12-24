import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CodeEditor from './components/CodeEditor'
import './App.css'

function App() {
   
  const router = createBrowserRouter([
    {
      path: "/",
      element: "<h1>Home Page</h1>"

    },
    {
      path: "/editor",
      element: <CodeEditor />
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App

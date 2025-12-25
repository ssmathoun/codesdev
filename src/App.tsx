import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import './index.css'

function App() {
   
  const router = createBrowserRouter([
    {
      path: "/",
      element: "<h1>Home Page</h1>"

    },
    {
      path: "/editor/:id",
      element: <MainLayout />
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App

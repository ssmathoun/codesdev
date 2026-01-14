import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/LandingPage'
// import HomePage from './pages/HomePage'
import './index.css'

function App() {
   
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />

    },
    {
      path: "/editor/:projectId",
      element: <MainLayout />
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Register from './pages/Register/Register.jsx'
import Login from './pages/Login/Login.jsx'
import Home from './pages/Home/Home.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/register",
        element:<Register />
      },
      {
        path:"/login",
        element:<Login/>
      },{
        path:"/home",
        element:<Home />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}><App /></RouterProvider>
  </StrictMode>,
)

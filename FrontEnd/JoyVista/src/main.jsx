import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Register from './pages/Register/Register.jsx'
import Login from './pages/Login/Login.jsx'
import Home from './pages/Home/Home.jsx'
import { Provider } from 'react-redux'
import Store from './store/store.js'

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
        path:"/",
        element:<Home />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}><RouterProvider router={router}><App /></RouterProvider></Provider>
  </StrictMode>,
)

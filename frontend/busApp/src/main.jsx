import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {RouterProvider,createBrowserRouter} from "react-router-dom"
import { Busdetails } from './components/Busdetails/Busdetails.jsx'
import { Gotdetails } from './components/Geodetails/Gotdetails.jsx'
import { Properdetails } from './components/Properdetails/Properdetails.jsx'
const router=createBrowserRouter([
  {
    path:"/",
    element:<App />,
    children:[
      {
        path:"details",
        element:<Busdetails />
      },
      {
        path:"busDetails",
        element:<Gotdetails />
      },
      {
        path:"/bus/:id",
        element:<Properdetails />
      }

    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <RouterProvider router={router}>
    <App />
  </RouterProvider>
  </React.StrictMode>,
)

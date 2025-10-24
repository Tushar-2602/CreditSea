import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from '../Components/Layout.jsx'
import UploadXml from '../Components/UploadPage.jsx'
import XMLDisplay from '../Components/DisplayPage.jsx'
import { Redirect } from '../Components/Redirect.jsx'
const router =createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<UploadXml/>}/>
      <Route path='getData' element={<XMLDisplay/>}/>
      <Route path='*' element={<Redirect/>}/>
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)

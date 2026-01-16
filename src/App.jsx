import { Suspense, useState } from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import './App.css'
import Applayout from './Applayout';
import Error from './component/Error';

import { loader } from './services/api';
import SkeletonLoader from './component/SkeletonLoader';
import TablePage from './pages/TablePage';

const App=()=>{
  
   const router=createBrowserRouter([
    {
      path:"/",
      element:<Applayout/>,
      
      
      
    
      children:[
        {
          path:"/",
          element:<TablePage/>,
          // will use defer and suspense with loader to render initial loading
          loader:loader,
          errorElement:<Error/>
          
    
         
          
        }
      ]
      
     
      
    }
   ])
  return(
    <>
    <RouterProvider router={router} />
    </>

  )
}

export default App

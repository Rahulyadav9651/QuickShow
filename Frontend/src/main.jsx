import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { ClerkProvider } from '@clerk/react'

const PUBLIC= import.meta.env.VITE_CLERK_KEY

if(!PUBLIC){
  throw new Error('Missing Publishable key')
}

createRoot(document.getElementById('root')).render(

<ClerkProvider publishableKey={PUBLIC}>

  <BrowserRouter >
   <App />
  </BrowserRouter>

</ClerkProvider>




   
 
)

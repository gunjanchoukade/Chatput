import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import SocketContext from './context/socketContext'
import StoreContext from './context/StoreContext'


createRoot(document.getElementById('root')).render(
  <>
    <StoreContext>
      <SocketContext>
        <App />
        <Toaster closeButton></Toaster>
      </SocketContext>
    </StoreContext>
    
  </>,
)

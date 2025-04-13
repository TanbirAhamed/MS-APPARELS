import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Roots from './Components/Roots/Roots'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Roots />
  </StrictMode>,
)

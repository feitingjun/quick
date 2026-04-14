import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RouterProvider from 'virtual:file-router'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider history='hash' />
  </StrictMode>
)

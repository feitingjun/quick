import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from '@quick/ui'
import RouterProvider from 'virtual:file-router'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <RouterProvider history='hash' />
    </ConfigProvider>
  </StrictMode>
)

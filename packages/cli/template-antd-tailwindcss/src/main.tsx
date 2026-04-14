import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCn from 'antd/locale/zh_CN'
import { StyleProvider } from '@ant-design/cssinjs'
import RouterProvider from 'virtual:file-router'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleProvider layer>
      <ConfigProvider locale={zhCn}>
        <RouterProvider history='hash' />
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>
)

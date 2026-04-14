import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCn from 'antd/locale/zh_CN'
import { StyleProvider } from '@ant-design/cssinjs'
import { ScopeProvider, KeepAlive } from '@quick/keep-alive'
import RouterProvider from 'virtual:file-router'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleProvider layer>
      <ConfigProvider locale={zhCn}>
        <ScopeProvider>
          <RouterProvider
            history='hash'
            wrappers={[
              ({ children, pathname, isLayout }) => {
                if (isLayout) return children
                return <KeepAlive name={pathname}>{children}</KeepAlive>
              }
            ]}
          />
        </ScopeProvider>
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>
)

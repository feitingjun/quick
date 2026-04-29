import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from '@quick/ui'
import RouterProvider from 'virtual:file-router'
import request from '@/request'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      layer
      httpRequest={request}
      page={{
        transformResponse: d => {
          return {
            dataSource: d?.data?.records ?? [],
            total: d?.data?.total ?? 0,
            pageSize: d?.data?.pageSize ?? 10,
            page: d?.data?.page ?? 10
          }
        },
        requestMethod: 'post',
        transformRequest: ({ page, pageSize, ...params }) => {
          return {
            page,
            pageSize,
            params
          }
        },
        sticky: true
      }}
    >
      <RouterProvider history='hash' />
    </ConfigProvider>
  </StrictMode>
)

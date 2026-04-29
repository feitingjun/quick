import { useMemo } from 'react'
import {
  ConfigProvider as AntdConfigProvider,
  App as AntdApp,
  type ThemeConfig,
  type GetProps,
  type ConfigProviderProps as AntdConfigProviderProps
} from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
// vite8兼容，需要从antd/es导入
import zhCN from 'antd/es/locale/zh_CN'
import { defaultTheme } from '@/theme'
import type { Dicts } from '@/dicts'
import { merge } from '@/utils'
import { useRegisterStatic } from '@/components/static-function'
import type { PageProps, TransformResult } from '@/components/page/types'
import { ConfigContext, type HttpRequest, type PageComponentConfig } from './context'
import 'dayjs/locale/zh-cn'

type Locale = GetProps<AntdConfigProviderProps>['locale']

export interface ConfigProviderProps {
  /**antd 主题Token配置 */
  token?: ThemeConfig['token']
  /**数据字典 */
  dicts?: Dicts
  children?: React.ReactNode
  /**antd 样式启用 layer*/
  layer?: boolean
  /**antd 国际化配置 */
  locale?: Locale
  /**带远程数据获取功能的组件所使用的请求方法实例 */
  httpRequest?: HttpRequest
  /**page组件相关设置 */
  page?: PageComponentConfig
}

/**注册全局静态方法 */
export function Register({ children }: { children: React.ReactNode }) {
  useRegisterStatic()
  return children
}

export function ConfigProvider({
  token = {},
  dicts = {},
  children,
  layer,
  locale = zhCN,
  httpRequest,
  page: {
    sticky,
    transformResponse,
    transformRequest,
    sortFieldName = 'sort',
    orderFieldName = 'order',
    requestMethod = 'get'
  } = {}
}: ConfigProviderProps) {
  const mergedToken = useMemo(() => merge(defaultTheme, token), [token])
  return (
    <StyleProvider layer={layer}>
      <AntdConfigProvider theme={{ token: mergedToken }} locale={locale}>
        <ConfigContext.Provider
          value={{
            dicts,
            httpRequest,
            page: {
              sticky,
              requestMethod,
              sortFieldName,
              orderFieldName,
              transformResponse,
              transformRequest
            }
          }}
        >
          <AntdApp>
            <Register>{children}</Register>
          </AntdApp>
        </ConfigContext.Provider>
      </AntdConfigProvider>
    </StyleProvider>
  )
}

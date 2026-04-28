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
import { ConfigContext, type HttpRequest } from './context'
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
  /**Page 组件统一转换数据格式（Select 组件远程获取的数据格式不具有普遍性，不做统一处理）*/
  transformResponse?: (response: any) => TransformResult
  /**Page 组件统一转换请求数据格式 */
  transformRequest?: (params: Record<string, any>, method: PageProps['method']) => Record<string, any>
  /**Page组件默认请求方法 */
  requestMethod?: PageProps['method']
  /**排序sort字段重命名 */
  sortFieldName?: string
  /**排序order字段重命名 */
  orderFieldName?: string
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
  transformResponse,
  transformRequest,
  sortFieldName = 'sort',
  orderFieldName = 'order',
  requestMethod = 'get'
}: ConfigProviderProps) {
  const mergedToken = useMemo(() => merge(defaultTheme, token), [token])
  return (
    <StyleProvider layer={layer}>
      <AntdConfigProvider theme={{ token: mergedToken }} locale={locale}>
        <ConfigContext.Provider
          value={{
            dicts,
            httpRequest,
            transformResponse,
            transformRequest,
            requestMethod,
            sortFieldName,
            orderFieldName
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

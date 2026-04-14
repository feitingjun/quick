import { useMemo } from 'react'
import { ConfigProvider as AntdConfigProvider, type ThemeConfig, App as AntdApp } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import zhCN from 'antd/locale/zh_CN'
import { defaultTheme } from '@/theme'
import type { Dicts } from '@/dicts'
import { merge } from '@/utils'
import { useRegisterMessage } from '@/components/message'
import { ConfigContext } from './context'
import 'dayjs/locale/zh-cn'

export interface ConfigProviderProps {
  theme?: ThemeConfig['token']
  dicts?: Dicts
  children?: React.ReactNode
}

/**注册全局静态方法 */
export function Register({ children }: { children: React.ReactNode }) {
  useRegisterMessage()
  return children
}

export function ConfigProvider({ theme = {}, dicts = {}, children }: ConfigProviderProps) {
  const mergedToken = useMemo(() => merge(defaultTheme, theme), [theme])
  return (
    <StyleProvider layer>
      <AntdConfigProvider theme={{ token: mergedToken }} locale={zhCN}>
        <ConfigContext.Provider value={{ dicts }}>
          <AntdApp>
            <Register>{children}</Register>
          </AntdApp>
        </ConfigContext.Provider>
      </AntdConfigProvider>
    </StyleProvider>
  )
}

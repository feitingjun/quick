import { useMemo } from 'react'
import { ThemeProvider } from '@quick/cssinjs'
import { ConfigProvider as AntdConfigProvider, type ThemeConfig, App as AntdApp } from 'antd'
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'
import zhCN from 'antd/locale/zh_CN'
import { type Theme, defaultTheme } from '@/theme'
import { type Dicts } from '@/dicts'
import { merge } from '@/utils'
import { useRegisterMessage } from '@/components/message'
import { ConfigContext } from './context'
import 'dayjs/locale/zh-cn'

export interface ConfigProviderProps {
  theme?: Theme
  dicts?: Dicts
  children?: React.ReactNode
}

const useToken = (theme: Theme) => {
  return useMemo(
    () =>
      ({
        colorPrimary: theme?.colors?.primary,
        colorError: theme?.colors?.error,
        colorInfo: theme?.colors?.info,
        colorLink: theme?.colors?.link,
        colorSuccess: theme?.colors?.success,
        colorWarning: theme?.colors?.warning,
        colorTextBase: theme?.colors?.text,
        colorText: theme?.colors?.text,
        colorTextSecondary: theme?.colors?.secondary,
        colorBorder: theme?.colors?.border,
        colorBgBase: theme?.colors?.bg,
        colorBgLayout: theme?.colors?.bgLayout,
        fontSize: theme?.fontSizes?.body,
        fontSizeSM: theme?.fontSizes?.caption,
        fontSizeLG: theme?.fontSizes?.subtitle,
        fontSizeXL: theme?.fontSizes?.heading,
        borderRadius: theme?.radii?.sm,
        borderRadiusXS: theme?.radii?.xs,
        borderRadiusSM: theme?.radii?.sm,
        borderRadiusLG: theme?.radii?.md,
        controlHeight: theme?.sizes?.controlHeight,
        controlHeightLG: theme?.sizes?.controlHeightLg,
        controlHeightSM: theme?.sizes?.controlHeightSm,
        controlHeightXS: theme?.sizes?.controlHeightXs
      } as ThemeConfig['token']),
    [theme]
  )
}

/**注册全局静态方法 */
export function Register({ children }: { children: React.ReactNode }) {
  useRegisterMessage()
  return children
}

export function ConfigProvider({ theme = {}, dicts = {}, children }: ConfigProviderProps) {
  const margedtheme = useMemo(() => merge(defaultTheme, theme), [theme])
  const token = useToken(margedtheme)
  return (
    <ThemeProvider theme={margedtheme}>
      <StyleProvider layer>
        <AntdConfigProvider theme={{ token }} locale={zhCN}>
          <ConfigContext.Provider value={{ dicts }}>
            <AntdApp>
              <Register>{children}</Register>
            </AntdApp>
          </ConfigContext.Provider>
        </AntdConfigProvider>
      </StyleProvider>
    </ThemeProvider>
  )
}

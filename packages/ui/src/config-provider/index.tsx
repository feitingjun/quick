import { useMemo } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import { ThemeProvider, merge } from '@quick/cssinjs'
import { ConfigProvider as AntdConfigProvider, ThemeConfig } from 'antd'
import { Theme, defaultTheme } from '@/theme'
import { Dicts } from '@/dicts'
import { ConfigContext } from './context'

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

export function ConfigProvider({ theme = {}, dicts = {}, children }: ConfigProviderProps) {
  const margedtheme = useMemo(() => merge(defaultTheme, theme), [theme])
  const token = useToken(margedtheme)
  return (
    <ThemeProvider theme={margedtheme}>
      <StyleProvider layer>
        <AntdConfigProvider theme={{ token }}>
          <ConfigContext.Provider value={{ dicts }}>{children}</ConfigContext.Provider>
        </AntdConfigProvider>
      </StyleProvider>
    </ThemeProvider>
  )
}

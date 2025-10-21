import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider as AntdConfigProvider } from 'antd'
import { ThemeProvider, ThemeDefine, defineTheme } from '@quick/cssinjs'

export type Theme = {
  /**颜色配置 */
  colors?: {
    /**主题颜色 */
    primary?: string
    /**成功颜色 */
    success?: string
    /**警告颜色 */
    warning?: string
    /**错误颜色 */
    error?: string
    /**信息颜色 */
    info?: string
    /**link颜色 */
    link?: string
    /**主文本颜色 */
    text?: string
    /**次文本颜色 */
    secondary?: string
  }
  /**基础间距(margin，padding，gap相关属性值为number类型时，会转换为 n * space) */
  space?: number
  fontSizes?: {
    /**小文字 */
    caption?: number
    /**正文 */
    body?: number
    /**标题 */
    title?: number
    /**小标题 */
    subtitle?: number
    /**大标题 */
    heading?: number
    /**超大标题 */
    display?: number
  }
}

export { defineTheme }

export type ConfigProviderProps = {
  theme?: ThemeDefine
  children?: React.ReactNode
}

export default function ConfigProvider({ theme, children }: ConfigProviderProps) {
  return (
    <ThemeProvider theme={theme ?? {}}>
      <StyleProvider layer>
        <AntdConfigProvider theme={{}}>{children}</AntdConfigProvider>
      </StyleProvider>
    </ThemeProvider>
  )
}

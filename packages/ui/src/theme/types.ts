import type { SxProps } from '@quick/cssinjs'
import type { DeepRequired } from '@/utils'

export interface Theme {
  /**颜色配置 */
  colors?: {
    /**基础组件背景 */
    bg?: string
    /**layout背景,浅灰 */
    bgLayout?: string
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
    /**边框颜色 */
    border?: string
    /**次级边框颜色 */
    borderSecondary?: string
    /**禁用文字颜色 */
    disabled?: string
  }
  /**媒体查询配置 */
  breakpoints?: {
    /**默认480px */
    sm?: string
    /**默认768px */
    md?: string
    /**默认1024px */
    lg?: string
    /**默认1280px */
    xl?: string
    /**默认1440px */
    '2xl'?: string
  }
  /**基础间距，默认4px
   ** margin，padding，gap相关属性值为number类型时，会转换为 n * space
   **/
  space?: number
  sizes?: {
    /**基础控件高度 */
    controlHeight?: number
    /**较高组件高度 */
    controlHeightLg?: number
    /**较小组件高度 */
    controlHeightSm?: number
    /**更小的组件高度 */
    controlHeightXs?: number
  }
  fontSizes?: {
    /**小文字，默认12px */
    caption?: number
    /**正文，默认14px */
    body?: number
    /**小标题，默认16px */
    subtitle?: number
    /**标题，默认18px */
    title?: number
    /**大标题，默认20px */
    heading?: number
    /**超大字体，默认24px */
    display?: number
  }
  /**字重 */
  fontWeights?: {
    /**默认400 */
    body?: number
    /**默认700 */
    bold?: number
  }
  /**行高 */
  lineHeights?: {
    /**默认1.5 */
    body?: number
    /**默认1.125 */
    heading?: number
  }
  /**边框 */
  borders?: {
    none?: 'none'
    /**默认边框，默认1px */
    normal?: string
    /**宽边框，默认2px */
    thick?: string
    /**虚线边框 */
    dotted?: string
    /**宽虚线边框，默认2px */
    thickDotted?: string
  }
  /**圆角 */
  radii?: {
    none?: number
    /**默认2px */
    xs?: number
    /**默认4px */
    sm?: number
    /**默认6px */
    md?: number
  }
  /**阴影 */
  shadows?: {
    none?: 'none'
    /**默认阴影 */
    box?: string
    /**二级阴影 */
    secondary?: string
    /**三级阴影 */
    tertiary?: string
  }
  /**z-index */
  zIndices?: {
    hide?: number
    base?: number
    docked?: number
    dropdown?: number
    sticky?: number
    banner?: number
    overlay?: number
    modal?: number
    popover?: number
    tooltip?: number
    toast?: number
    max?: number
  }
  presets?: {
    [key: string]: SxProps
  }
}

type UITheme = DeepRequired<Omit<Theme, 'presets'>>

declare module '@quick/cssinjs' {
  interface Theme extends UITheme {}
}

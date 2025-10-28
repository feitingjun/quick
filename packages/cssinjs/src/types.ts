import * as CSS from 'csstype'
// 原始styled-system定义的类型仅包含通过主题定义的部分，在./styled-system/define.ts中加上了原生css的属性定义
import type {
  Theme,
  ColorProps,
  SpaceProps,
  LayoutProps,
  FlexboxProps,
  BorderProps,
  PositionProps,
  ShadowProps,
  TypographyProps,
  BackgroundProps,
  GridProps,
  OpacityProps,
  AnimationProps
} from './styled-system/define'
import { NativeCSS } from './styled-system/native-css'
import type { CustomPseudos } from './custom-pseudos'

export type ValueOf<T> = T[keyof T]

/**css属性 */
export type CSSProperties<T extends Theme = Theme> = ColorProps<T> &
  SpaceProps<T> &
  LayoutProps<T> &
  FlexboxProps<T> &
  BorderProps<T> &
  PositionProps<T> &
  ShadowProps<T> &
  TypographyProps<T> &
  BackgroundProps<T> &
  GridProps<T> &
  OpacityProps<T> &
  AnimationProps

/**css变量 */
export type CSSVars<T extends Theme = Theme> = {
  [key: `--${string}`]: ValueOf<CSSProperties<T>>
}

/**css原生伪类 */
export type SystemPseudoStyles<T extends Theme = Theme> = {
  // ✅ 已知伪类有完整提示
  [K in CSS.Pseudos]?: CSSProperties<T> &
    CSSVars<T> & {
      content: `"${string}"`
    }
} & {
  // ✅ 同时支持自定义复合选择器，如 "span:hover"
  [K in `${string}${CSS.Pseudos}`]?: CSSProperties<T> &
    CSSVars<T> & {
      content: `"${string}"`
    }
}

/**自定义伪类 */
export type CustomPseudoStyles<T extends Theme = Theme> = {
  [K in CustomPseudos]?: CSSProperties<T> &
    CSSVars<T> & {
      content: `"${string}"`
    }
}

/**其他属性 */
export type CSSOthersStyles<T extends Theme = Theme> = {
  [propertiesName: string]: SxProps<T> | string | number | null
}

/**基础样式 */
export interface BaseStyles<T extends Theme = Theme>
  extends CSSProperties,
    CSSVars,
    SystemPseudoStyles<T>,
    CustomPseudoStyles<T> {}

/**排除自定义样式的原生css属性 */
export interface NativeStyles<T extends Theme = Theme>
  extends Omit<NativeCSS, keyof BaseStyles<T>> {}

/**组件props支持的样式属性 */
export type ComponentCssStyles<T extends Theme = Theme> = CSSProperties<T> & CustomPseudoStyles<T>

/**组件sx和styled接受的样式属性 */
export type SxProps<T extends Theme = Theme> =
  | (NativeStyles<T> & BaseStyles<T>)
  | CSSOthersStyles<T>

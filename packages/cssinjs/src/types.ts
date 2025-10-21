import * as CSS from 'csstype'
// 原始styled-system定义的类型仅包含通过主题定义的部分，在./styled-system/define.ts中加上了原生css的属性定义
import {
  type Theme,
  type ThemeDefine,
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
  OpacityProps
} from './styled-system/define'
import { CustomPseudos } from './custom-pseudos'

export const defineTheme = <T extends ThemeDefine>(theme: T) => theme

export type ValueOf<T> = T[keyof T]

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
  OpacityProps<T>

export type CSSVars<T extends Theme = Theme> = {
  [key: `--${string}`]: ValueOf<CSSProperties<T>>
}

type KnownPseudos = CSS.Pseudos | CustomPseudos

export type CSSPseudos<T extends Theme = Theme> = {
  // ✅ 已知伪类有完整提示
  [K in KnownPseudos]?: CSSProperties<T> &
    CSSVars<T> & {
      content: `"${string}"`
    }
} & {
  // ✅ 同时支持自定义复合选择器，如 "span:hover"
  [K: `${string}${KnownPseudos}`]: CSSProperties<T> &
    CSSVars<T> & {
      content: `"${string}"`
    }
}

export type CSSOthersObject<T extends Theme = Theme> = {
  [propertiesName: string]: SxProps<T> | string | number | null
}

export type SxProps<T extends Theme = Theme> =
  | Partial<CSSProperties<T> & CSSVars<T> & CSSPseudos<T>>
  | CSSOthersObject<T>

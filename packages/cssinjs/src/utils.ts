import { get } from 'styled-system'
import type { SxProps } from './types'
import type { Theme, ThemeDefine } from './styled-system/define'
import styleFn, { cssPropNames } from './styled-system/style-fn'
import { isCustomPseudo, customPseudos } from './custom-pseudos'

// 主题变量缓存
const themeVarsCache = new WeakMap<object, Map<string, any>>()

/**判断是否为styled-system属性 */
export function isSystemProp(prop: string) {
  return cssPropNames.has(prop)
}

/**判断是否为可接受的css属性 */
export function isCssProp(prop: string) {
  return isSystemProp(prop) || isCustomPseudo(prop)
}

/**将大括号包裹的css属性值(如{bg: '{colors.primary}'})转换为主题变量 */
export function getThemeValue(value: any, theme: Theme): any {
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, getThemeValue(v, theme)]))
  }
  if (typeof value !== 'string' || !/\{([\s\S]*)\}/.test(value)) {
    return value
  }
  if (!themeVarsCache.has(theme)) {
    themeVarsCache.set(theme, new Map())
  }
  const cache = themeVarsCache.get(theme)!
  if (cache.has(value)) {
    return cache.get(value)
  } else {
    const cssValue = value.replace(/\{([\s\S]*)\}/, (source, str) => get(theme, str) ?? source)
    cache.set(value, cssValue)
    return cssValue
  }
}

/**将styled-system对象处理为css样式对象 */
export function transform(sx: SxProps, theme: Theme) {
  const sysStyles: Record<string, any> = {}
  const otherStyles: Record<string, any> = {}
  const mediaQueries: Record<string, any> = {}
  Object.entries(sx).forEach(([k, v]) => {
    if (isCustomPseudo(k)) {
      k = customPseudos[k]
    }
    // 处理styled-system属性
    if (isSystemProp(k)) {
      sysStyles[k] = getThemeValue(v, theme)
      return
    }
    // 处理css变量的媒体查询
    if (k.startsWith('--') && !!v && typeof v === 'object') {
      Object.entries(v).forEach(([k2, v2]) => {
        const media = transformMediaQueries(k2, theme)
        if (!media) return
        if (!mediaQueries[media]) {
          mediaQueries[media] = {}
        }
        mediaQueries[media][k] = getThemeValue(v2, theme)
      })
      return
    }
    otherStyles[k] =
      !!v && typeof v === 'object' ? transform(v as SxProps, theme) : getThemeValue(v, theme)
    return
  })
  const styles = Object.fromEntries(
    Object.entries(styleFn({ theme, ...sysStyles })).map(([k, v]) => [k, getThemeValue(v, theme)])
  )
  return merge(otherStyles, mediaQueries, styles)
}

/**转换媒体查询 */
export function transformMediaQueries(
  breakpoint: string,
  theme: {
    breakpoints?: string[] | { [size: string]: string }
  }
) {
  const breakpoints = theme.breakpoints ?? []
  const size = get(breakpoints, breakpoint)
  if (size) return `@media screen and (min-width: ${size})`
}

/**合并对象 */
export function merge<T extends object[]>(...objects: T): T[number] {
  const result: any = {}
  for (const obj of objects) {
    if (!obj || typeof obj !== 'object') continue

    for (const key in obj) {
      const value = (obj as any)[key]

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (!result[key]) result[key] = {}
        result[key] = merge(result[key], value)
      } else {
        result[key] = value
      }
    }
  }

  return result
}

export const defineTheme = <T extends ThemeDefine>(theme: T) => theme

/**合并多个classname */
export function cx(...classNames: string[]) {
  return classNames.filter(c => !!c).join(' ')
}

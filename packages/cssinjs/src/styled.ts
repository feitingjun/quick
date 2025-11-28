import mStyled from '@emotion/styled'
import isPropValid from '@emotion/is-prop-valid'
import type { Theme } from './styled-system/define'
import type { SxProps, ComponentCssStyles } from './types'
import { transform, merge, isCssProp } from './utils'

/**变体(variants)定义 */
export type VariantsProps = {
  [key: string]: {
    [key: string]: SxProps
  }
}

/**styled函数的第二个参数返回类型 */
export type StyledProps<T extends VariantsProps = VariantsProps> = {
  base?: SxProps
  variants?: T
  defaultVariants?: {
    [K in keyof T]?: keyof T[K]
  }
}

/**样式函数参数类型，支持对象或函数形式 */
export type RecipeProps<
  C extends keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<any>,
  T extends VariantsProps = VariantsProps
> =
  | StyledProps<T>
  | ((
      props: {
        theme?: Theme
      } & React.ComponentProps<C>
    ) => StyledProps<T>)

// 预设样式类型
type PresetProp<T extends { presets?: Record<string, any> } = { presets?: any }> =
  T['presets'] extends Record<string, any> ? { preset?: keyof T['presets'] } : {}

/**合并原始 props 和 SxProps */
export type StyledComponentProps<P, V extends VariantsProps = {}> = Omit<
  P,
  keyof ComponentCssStyles
> &
  ComponentCssStyles & {
    [K in keyof V]?: keyof V[K] extends 'true' ? boolean : keyof V[K]
  } & PresetProp<Theme>
//
export type StyledComponent<P, V extends VariantsProps = {}> = React.FC<StyledComponentProps<P, V>>

// type ForbidSystemProps<T extends React.ComponentType<any>> = Extract<
//   keyof React.ComponentProps<T>,
//   keyof SxProps
// > extends never
//   ? T
//   : {
//       error: `❌ styled() 不允许组件包含系统样式属性 ${Extract<
//         keyof React.ComponentProps<T>,
//         keyof SxProps
//       >}，这些属性会被 styled() 过滤，请移除`
//     }

/**使用styled创建的组件，样式相关prop将会被过滤，不会传递给children*/
export function styled<C extends React.JSXElementConstructor<any>, V extends VariantsProps = {}>(
  component: C,
  recipes?: RecipeProps<C, V>
): StyledComponent<React.ComponentProps<C>, V>

// 重载2：支持原生 HTML 元素
export function styled<Tag extends keyof React.JSX.IntrinsicElements, T extends VariantsProps = {}>(
  component: Tag,
  recipes?: RecipeProps<Tag, T>
): StyledComponent<React.ComponentProps<Tag>, T>

// styled 函数实现
export function styled(
  component: React.ComponentType<any> | keyof React.JSX.IntrinsicElements,
  recipes: RecipeProps<any> = {}
) {
  return mStyled(component as any, {
    shouldForwardProp: prop => {
      return !(isCssProp(prop) || (typeof component === 'string' && !isPropValid(prop)))
    }
  })(props => {
    const { theme, preset, className, ...args } = props
    let styles = typeof recipes === 'function' ? recipes({ theme, ...args }) : recipes
    const { base = {}, variants = {}, defaultVariants = {} } = styles
    // 支持的变体
    const variantsAttrs = new Set(Object.keys(variants ?? {}))
    // 分离组件的变体属性和其他样式属性
    const usedVariants: Record<string, string> = {}
    const otherStyles: Record<string, any> = {}
    Object.entries(args).forEach(([key, value]) => {
      if (variantsAttrs.has(key)) {
        usedVariants[key] = value as string
      } else if (isCssProp(key)) {
        otherStyles[key] = value
      }
    })
    // 实际应用的变体样式
    const variantStyles = Object.entries({
      ...defaultVariants,
      ...usedVariants
    }).reduce((acc, [key, value]: [string, any]) => {
      return {
        ...acc,
        ...(variants?.[key]?.[typeof value === 'boolean' ? value.toString() : value] ?? {})
      }
    }, {})

    const mergeArgs = []
    if (base) mergeArgs.push(transform(base, theme))
    if (variantStyles) mergeArgs.push(transform(variantStyles, theme))
    if (theme?.presets?.[preset]) mergeArgs.push(transform(theme.presets[preset], theme))
    if (otherStyles) mergeArgs.push(transform(otherStyles, theme))

    // 分别转换之后合并，避免 color: { sm: 'red', md: 'blue' } 等媒体查询覆盖默认 color: 'green' 的情况
    const results = merge(...mergeArgs)
    return results
  })
}

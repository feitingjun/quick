import * as ReactJSXRuntime from 'react/jsx-runtime'
import { jsx as emotionJsx, jsxs as emotionJsxs } from '@emotion/react/jsx-runtime'
import { transform } from './utils'
import type { SxProps as SxPropsObject } from './types'
import type { Theme } from './styled-system/define'

type SxProps = SxPropsObject | ((theme: Theme) => SxPropsObject)

type WithConditionalCSSProp<P> = 'className' extends keyof P
  ? string extends P['className' & keyof P]
    ? { sx?: SxProps }
    : {}
  : {}

export declare namespace JSX {
  type ElementType = React.JSX.ElementType
  interface Element extends React.JSX.Element {}
  interface ElementClass extends React.JSX.ElementClass {}
  interface ElementAttributesProperty extends React.JSX.ElementAttributesProperty {}
  interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {}
  type LibraryManagedAttributes<C, P> = P extends unknown
    ? WithConditionalCSSProp<P> & React.JSX.LibraryManagedAttributes<C, P>
    : never
  interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
  interface IntrinsicClassAttributes<T> extends React.JSX.IntrinsicClassAttributes<T> {}
  type IntrinsicElements = {
    [K in keyof React.JSX.IntrinsicElements]: React.JSX.IntrinsicElements[K] & {
      sx?: SxProps
    }
  }
}

const getCss = (sx: SxProps, theme: Theme) => {
  if (typeof sx === 'function') {
    return transform(sx(theme), theme)
  }
  return transform(sx, theme)
}

export const jsx: typeof ReactJSXRuntime.jsx = (type, props, key) => {
  const { sx, ...args } = props as { sx?: SxProps }
  if (sx) {
    return emotionJsx(type, { ...args, css: (theme: Theme) => getCss(sx, theme) }, key)
  }
  return emotionJsx(type, props, key)
}

export const jsxs: typeof ReactJSXRuntime.jsxs = (type, props, key) => {
  const { sx, ...args } = props as { sx?: SxProps }
  if (sx) {
    return emotionJsxs(type, { ...args, css: (theme: Theme) => getCss(sx, theme) }, key)
  }
  return emotionJsxs(type, props, key)
}

export const Fragment = ReactJSXRuntime.Fragment

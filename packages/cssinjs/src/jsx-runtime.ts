import * as ReactJSXRuntime from 'react/jsx-runtime'
import { jsx as emotionJsx, jsxs as emotionJsxs } from '@emotion/react/jsx-runtime'
import { type SxProps, type Theme, useTheme } from '@mui/system'

type WithConditionalCSSProp<P> = 'className' extends keyof P
  ? string extends P['className' & keyof P]
    ? string extends P['sx' & keyof P]
      ? {}
      : { sx?: SxProps<Theme> }
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
      sx?: SxProps<Theme>
    }
  }
}

export const jsx: typeof ReactJSXRuntime.jsx = (type, props, key) => {
  const { sx, ...args } = props as { sx?: SxProps<Theme> }
  const theme = useTheme()
  if (sx) {
    return emotionJsx(type, { ...args, css: theme.unstable_sx(sx) }, key)
  }
  return emotionJsx(type, props, key)
}

export const jsxs: typeof ReactJSXRuntime.jsxs = (type, props, key) => {
  const { sx, ...args } = props as { sx?: SxProps }
  const theme = useTheme()
  if (sx) {
    return emotionJsxs(type, { ...args, css: theme.unstable_sx(sx) }, key)
  }
  return emotionJsxs(type, props, key)
}

export const Fragment = ReactJSXRuntime.Fragment

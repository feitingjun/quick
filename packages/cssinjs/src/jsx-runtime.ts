import * as ReactJSXRuntime from 'react/jsx-runtime'
import { jsx as emotionJsx, jsx as emotionJsxs } from '@emotion/react/jsx-runtime'
import { transform } from './utils'
import { SxProps } from './types'

export declare namespace JSX {
  type IntrinsicElements = {
    [K in keyof React.JSX.IntrinsicElements]: React.JSX.IntrinsicElements[K] & {
      sx?: SxProps
    }
  }
  interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {}
}

export const jsx: typeof ReactJSXRuntime.jsx = (type, props, key) => {
  const { sx, ...args } = props as { sx?: SxProps }
  if (sx && typeof type === 'string') {
    return emotionJsx(type, { ...args, css: (theme: any) => transform(sx, theme) }, key)
  }
  return emotionJsx(type, props, key)
}

export const jsxs: typeof ReactJSXRuntime.jsxs = (type, props, key) => {
  const { sx, ...args } = props as { sx?: SxProps }
  if (sx && typeof type === 'string') {
    return emotionJsxs(type, { ...args, css: (theme: any) => transform(sx, theme) }, key)
  }
  return emotionJsxs(type, props, key)
}

export const Fragment = ReactJSXRuntime.Fragment

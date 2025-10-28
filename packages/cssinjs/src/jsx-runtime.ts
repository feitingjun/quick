import * as ReactJSXRuntime from 'react/jsx-runtime'
import { jsx as emotionJsx, jsxs as emotionJsxs } from '@emotion/react/jsx-runtime'
import { transform } from './utils'
import type { SxProps } from './types'
import type { Theme } from './styled-system/define'

type SxFn = SxProps | ((theme: Theme) => SxProps)

export declare namespace JSX {
  type ElementType = React.JSX.ElementType
  interface Element extends React.JSX.Element {}
  interface ElementClass extends React.JSX.ElementClass {}
  interface ElementAttributesProperty extends React.JSX.ElementAttributesProperty {}
  interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {}
  type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>
  interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
  interface IntrinsicClassAttributes<T> extends React.JSX.IntrinsicClassAttributes<T> {}
  type IntrinsicElements = {
    [K in keyof React.JSX.IntrinsicElements]: React.JSX.IntrinsicElements[K] & {
      sx?: SxFn
    }
  }
}

const getCss = (sx: SxFn, theme: Theme) => {
  if (typeof sx === 'function') {
    return transform(sx(theme), theme)
  }
  return transform(sx, theme)
}

export const jsx: typeof ReactJSXRuntime.jsx = (type, props, key) => {
  try {
    const { sx, ...args } = props as { sx?: SxFn }
    if (sx && typeof type === 'string') {
      return emotionJsx(type, { ...args, css: (theme: Theme) => getCss(sx, theme) }, key)
    }
    return emotionJsx(type, props, key)
  } catch (err) {
    // 🧩 重新抛出错误，让堆栈还原到调用位置
    const e = new Error((err as Error).message)
    e.name = (err as Error).name
    e.stack = (err as Error).stack
    throw e
  }
}

export const jsxs: typeof ReactJSXRuntime.jsxs = (type, props, key) => {
  try {
    const { sx, ...args } = props as { sx?: SxFn }
    if (sx && typeof type === 'string') {
      return emotionJsxs(type, { ...args, css: (theme: Theme) => getCss(sx, theme) }, key)
    }
    return emotionJsxs(type, props, key)
  } catch (err) {
    // 🧩 重新抛出错误，让堆栈还原到调用位置
    const e = new Error((err as Error).message)
    e.name = (err as Error).name
    e.stack = (err as Error).stack
    throw e
  }
}

export const Fragment = ReactJSXRuntime.Fragment

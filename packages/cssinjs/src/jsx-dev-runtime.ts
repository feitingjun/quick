import * as ReactJSXRuntimeDev from 'react/jsx-dev-runtime'
import { jsxDEV as emotionJsxDev } from '@emotion/react/jsx-dev-runtime'
import { transform } from './utils'

export const Fragment = ReactJSXRuntimeDev.Fragment

export const jsxDEV: typeof ReactJSXRuntimeDev.jsxDEV = (
  type,
  props,
  key,
  isStaticChildren,
  source,
  self
) => {
  const { sx, ...args } = props as { sx?: any }
  if (sx) {
    return emotionJsxDev(
      type,
      { ...args, css: (theme: any) => transform(typeof sx === 'function' ? sx(theme) : sx, theme) },
      key,
      isStaticChildren,
      source,
      self
    )
  }
  return emotionJsxDev(type, props, key, isStaticChildren, source, self)
}

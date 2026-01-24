import * as ReactJSXRuntimeDev from 'react/jsx-dev-runtime'
import { jsxDEV as emotionJsxDev } from '@emotion/react/jsx-dev-runtime'
import { useTheme } from '@mui/system'

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
  const theme = useTheme()
  if (sx) {
    return emotionJsxDev(
      type,
      {
        ...args,
        css: theme.unstable_sx(sx)
      },
      key,
      isStaticChildren,
      source,
      self
    )
  }
  return emotionJsxDev(type, props, key, isStaticChildren, source, self)
}

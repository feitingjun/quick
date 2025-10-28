import { __unsafe_useEmotionCache, useTheme, css } from '@emotion/react'
import { transform } from './utils'
import type { SxProps } from './types'

/**传入sx，将处理后的样式插入样式表并返回对应的 className */
export const useClassName = (sx: SxProps) => {
  const theme = useTheme()
  const serialized = css(transform(sx, theme))
  const cache = __unsafe_useEmotionCache()
  const cls = `${cache?.key}-${serialized.name}`
  cache?.insert(`.${cls}`, serialized, cache.sheet, true)
  return cls
}

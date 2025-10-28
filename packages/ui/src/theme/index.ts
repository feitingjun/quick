import type { Theme } from './types'
import { defaultTheme } from './default'
export { useTheme } from '@quick/cssinjs'

export { type Theme, defaultTheme }

export const defineTheme = <T extends Theme>(theme: T) => theme

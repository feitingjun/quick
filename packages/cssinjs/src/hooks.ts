import {
  type PropsOf,
  type DistributiveOmit,
  type Keyframes,
  ThemeProvider as ThemeProvider2,
  ThemeContext as ThemeContext2,
  useTheme as useTheme2,
  withTheme as withTheme2,
  keyframes
} from '@emotion/react'
import type { Theme } from './styled-system/define'

export function useTheme(): Theme {
  return useTheme2()
}

export function withTheme<C extends React.ComponentType<React.ComponentProps<C>>>(
  Component: C
): React.ForwardRefExoticComponent<
  DistributiveOmit<PropsOf<C>, 'theme'> & {
    theme?: Theme
  }
> {
  return withTheme2(Component)
}

export { keyframes, type Keyframes }

export const ThemeContext = ThemeContext2 as React.Context<Theme>

export interface ThemeProviderProps {
  theme: Partial<Theme> | ((outerTheme: Theme) => Theme)
  children: React.ReactNode
}
export const ThemeProvider = ThemeProvider2 as React.FC<ThemeProviderProps>

export type WithTheme<P, T> = P extends {
  theme: infer Theme
}
  ? P & {
      theme: Exclude<Theme, undefined>
    }
  : P & {
      theme: T
    }

import {
  styled as muiStyled
  // compose,
  // spacing,
  // palette,
  // borders,
  // display,
  // flexbox,
  // grid,
  // positions,
  // shadows,
  // sizing,
  // typography
} from '@mui/system'
export {
  css,
  keyframes,
  StyledEngineProvider,
  GlobalStyles,
  createBox,
  createTheme,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  type Theme,
  type DefaultTheme
} from '@mui/system'
import { type StyledOptions } from '@emotion/styled'
import type { CreateMUIStyled } from './type'

// const systemStyles = compose(
//   spacing,
//   palette,
//   borders,
//   display,
//   flexbox,
//   grid,
//   positions,
//   shadows,
//   sizing,
//   typography
// )

const styled: CreateMUIStyled = (component: any, options: StyledOptions = {}) => {
  return (...styles: Array<any>) => {
    return muiStyled(component, {
      ...options,
      skipSx: true,
      skipVariantsResolver: true,
      shouldForwardProp: prop => !options?.shouldForwardProp?.(prop as string) && prop !== 'sx'
    })(
      ({ theme, ...args }) => {
        return styles.map(style => {
          style = typeof style === 'function' ? style({ theme, ...args }) : style
          return theme.unstable_sx(style)
        })
      }
      // ...styles.map(style => {
      //   return ({ theme, ...args }: any) => {
      //     style = typeof style === 'function' ? style({ theme, ...args }) : style
      //     return theme.unstable_sx(style)
      //   }
      // })
      // systemStyles
    )
  }
}

export { styled }

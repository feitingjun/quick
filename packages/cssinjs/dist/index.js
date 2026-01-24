// src/index.ts
import {
  styled as muiStyled
} from "@mui/system";
import {
  css,
  keyframes,
  StyledEngineProvider,
  GlobalStyles,
  createBox,
  createTheme,
  useTheme,
  useMediaQuery,
  ThemeProvider
} from "@mui/system";
import "@emotion/styled";
var styled = (component, options = {}) => {
  return (...styles) => {
    return muiStyled(component, {
      ...options,
      skipSx: true,
      skipVariantsResolver: true,
      shouldForwardProp: (prop) => !options?.shouldForwardProp?.(prop) && prop !== "sx"
    })(
      ({ theme, ...args }) => {
        return styles.map((style) => {
          style = typeof style === "function" ? style({ theme, ...args }) : style;
          return theme.unstable_sx(style);
        });
      }
      // ...styles.map(style => {
      //   return ({ theme, ...args }: any) => {
      //     style = typeof style === 'function' ? style({ theme, ...args }) : style
      //     return theme.unstable_sx(style)
      //   }
      // })
      // systemStyles
    );
  };
};
export {
  GlobalStyles,
  StyledEngineProvider,
  ThemeProvider,
  createBox,
  createTheme,
  css,
  keyframes,
  styled,
  useMediaQuery,
  useTheme
};

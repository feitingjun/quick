// src/hooks.ts
import {
  ThemeProvider as ThemeProvider2,
  ThemeContext as ThemeContext2,
  useTheme as useTheme2,
  withTheme as withTheme2,
  keyframes
} from "@emotion/react";
function useTheme() {
  return useTheme2();
}
function withTheme(Component) {
  return withTheme2(Component);
}
var ThemeContext = ThemeContext2;
var ThemeProvider = ThemeProvider2;
export {
  ThemeContext,
  ThemeProvider,
  keyframes,
  useTheme,
  withTheme
};

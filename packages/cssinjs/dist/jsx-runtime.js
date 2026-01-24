// src/jsx-runtime.ts
import * as ReactJSXRuntime from "react/jsx-runtime";
import { jsx as emotionJsx, jsxs as emotionJsxs } from "@emotion/react/jsx-runtime";
import { useTheme } from "@mui/system";
var jsx = (type, props, key) => {
  const { sx, ...args } = props;
  const theme = useTheme();
  if (sx) {
    return emotionJsx(type, { ...args, css: theme.unstable_sx(sx) }, key);
  }
  return emotionJsx(type, props, key);
};
var jsxs = (type, props, key) => {
  const { sx, ...args } = props;
  const theme = useTheme();
  if (sx) {
    return emotionJsxs(type, { ...args, css: theme.unstable_sx(sx) }, key);
  }
  return emotionJsxs(type, props, key);
};
var Fragment2 = ReactJSXRuntime.Fragment;
export {
  Fragment2 as Fragment,
  jsx,
  jsxs
};

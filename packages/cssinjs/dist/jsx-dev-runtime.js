// src/jsx-dev-runtime.ts
import * as ReactJSXRuntimeDev from "react/jsx-dev-runtime";
import { jsxDEV as emotionJsxDev } from "@emotion/react/jsx-dev-runtime";
import { useTheme } from "@mui/system";
var Fragment2 = ReactJSXRuntimeDev.Fragment;
var jsxDEV = (type, props, key, isStaticChildren, source, self) => {
  const { sx, ...args } = props;
  const theme = useTheme();
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
    );
  }
  return emotionJsxDev(type, props, key, isStaticChildren, source, self);
};
export {
  Fragment2 as Fragment,
  jsxDEV
};

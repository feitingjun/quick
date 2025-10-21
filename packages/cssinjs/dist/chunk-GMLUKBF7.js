import {
  transform
} from "./chunk-O3UFKRAJ.js";

// src/jsx-runtime.ts
import * as ReactJSXRuntime from "react/jsx-runtime";
import { jsx as emotionJsx, jsx as emotionJsxs } from "@emotion/react/jsx-runtime";
var jsx = (type, props, key) => {
  const { sx, ...args } = props;
  if (sx && typeof type === "string") {
    return emotionJsx(type, { ...args, css: (theme) => transform(sx, theme) }, key);
  }
  return emotionJsx(type, props, key);
};
var jsxs = (type, props, key) => {
  const { sx, ...args } = props;
  if (sx && typeof type === "string") {
    return emotionJsxs(type, { ...args, css: (theme) => transform(sx, theme) }, key);
  }
  return emotionJsxs(type, props, key);
};
var Fragment2 = ReactJSXRuntime.Fragment;

export {
  jsx,
  jsxs,
  Fragment2 as Fragment
};
//# sourceMappingURL=chunk-GMLUKBF7.js.map
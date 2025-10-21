import {
  transform
} from "./chunk-O3UFKRAJ.js";
import "./chunk-6HG7OCEA.js";
import "./chunk-VLAVRT4J.js";
import "./chunk-MPM2RKR7.js";

// src/jsx-dev-runtime.ts
import * as ReactJSXRuntimeDev from "react/jsx-dev-runtime";
import { jsxDEV as emotionJsxDev } from "@emotion/react/jsx-dev-runtime";
var Fragment2 = ReactJSXRuntimeDev.Fragment;
var jsxDEV = (type, props, key, isStaticChildren, source, self) => {
  const { sx, ...args } = props;
  if (sx && typeof type === "string") {
    return emotionJsxDev(
      type,
      { ...args, css: (theme) => transform(sx, theme) },
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
//# sourceMappingURL=jsx-dev-runtime.js.map
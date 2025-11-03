// src/reactActivation/fixContext.ts
import jsxRuntime from "react/jsx-runtime";
import jsxDevRuntime from "react/jsx-dev-runtime";
import { autoFixContext } from "react-activation";
autoFixContext(
  [jsxRuntime, "jsx", "jsxs", "jsxDEV"],
  [jsxDevRuntime, "jsx", "jsxs", "jsxDEV"]
);

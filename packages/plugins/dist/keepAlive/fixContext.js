import {
  KeepAliveContext,
  ScopeContext
} from "../chunk-BZBKARWE.js";

// src/keepAlive/fixContext.ts
import React from "react";
import jsxRuntime from "react/jsx-runtime";
import jsxDevRuntime from "react/jsx-dev-runtime";
var fixedContext = [];
var contextCaches = /* @__PURE__ */ new Map();
function getFixedContext(name) {
  if (!contextCaches.has(name)) {
    contextCaches.set(name, [...fixedContext]);
  }
  return contextCaches.get(name);
}
function repair(mods, names) {
  names.forEach((name) => {
    const oldFn = mods[name];
    if (typeof oldFn !== "function") return;
    mods[name] = function(type, ...args) {
      if (typeof type === "object" && type["$$typeof"] === Symbol.for("react.context")) {
        if (![ScopeContext, KeepAliveContext].includes(type) && !fixedContext.includes(type)) {
          fixedContext.push(type);
        }
      }
      return oldFn(type, ...args);
    };
  });
}
repair(React, ["createElement"]);
repair(jsxRuntime, ["jsx", "jsxs"]);
repair(jsxDevRuntime, ["jsxDEV"]);
export {
  getFixedContext
};
//# sourceMappingURL=fixContext.js.map
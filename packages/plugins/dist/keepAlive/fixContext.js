// src/keepAlive/fixContext.ts
import React from "react";
import jsxRuntime from "react/jsx-runtime";
import jsxDevRuntime from "react/jsx-dev-runtime";

// src/keepAlive/context.ts
import { createContext } from "react";
var BridgeContext = createContext([]);
var ScopeContext = createContext(null);
var KeepAliveContext = createContext(null);

// src/keepAlive/fixContext.ts
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

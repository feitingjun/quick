// src/keepAlive/context.ts
import { createContext } from "react";
var BridgeContext = createContext([]);
var ScopeContext = createContext(null);
var KeepAliveContext = createContext(null);
export {
  BridgeContext,
  KeepAliveContext,
  ScopeContext
};

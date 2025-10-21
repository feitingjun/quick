import {
  KeepAliveContext,
  ScopeContext
} from "../chunk-BZBKARWE.js";

// src/keepAlive/hooks.ts
import { useLayoutEffect, useState, useContext, useRef, useEffect } from "react";
function useGetActivation(name) {
  const [_, setCount] = useState(0);
  const { getActivation } = useContext(ScopeContext);
  useLayoutEffect(() => {
    const unsubscribe = getActivation(name).subscribe(() => {
      setCount((c) => c + 1);
    });
    return () => {
      unsubscribe();
    };
  }, [name]);
  return getActivation(name);
}
function useAliveController() {
  const ctx = useContext(ScopeContext);
  if (!ctx) return {
    destroy: () => {
    },
    destroyAll: () => {
    },
    cachingNodes: []
  };
  const { destroy, destroyAll, getCachingNodes } = ctx;
  return { destroy, destroyAll, getCachingNodes };
}
function useActivate(fn) {
  const at = useContext(KeepAliveContext);
  if (!at) return;
  useLayoutEffect(() => {
    const removeListener = at.addActivateHooks(fn);
    return () => removeListener();
  }, [fn]);
}
function useUnactivate(fn) {
  const at = useContext(KeepAliveContext);
  if (!at) return;
  useLayoutEffect(() => {
    const removeListener = at.addUnactivateHooks(fn);
    return () => removeListener();
  }, [fn]);
}
function useLoadedEffect(fn, deps) {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) {
      return fn();
    } else {
      loaded.current = true;
    }
  }, deps);
}
function useLoadedLayoutEffect(fn, deps) {
  const loaded = useRef(false);
  useLayoutEffect(() => {
    if (loaded.current) {
      return fn();
    } else {
      loaded.current = true;
    }
  }, deps);
}
export {
  useActivate,
  useAliveController,
  useGetActivation,
  useLoadedEffect,
  useLoadedLayoutEffect,
  useUnactivate
};
//# sourceMappingURL=hooks.js.map
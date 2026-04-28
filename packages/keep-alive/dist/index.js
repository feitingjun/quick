// src/scope-provider.tsx
import { useRef } from "react";

// src/context.ts
import { createContext } from "react";

// src/cacheStore.ts
var CacheNode = class {
  cacheId;
  outlet = null;
  cacheProps = void 0;
  active;
  /** 状态变更监听器 */
  listeners = /* @__PURE__ */ new Set();
  /**销毁监听器 */
  destroyListeners = /* @__PURE__ */ new Set();
  constructor(cacheId) {
    this.cacheId = cacheId;
    this.active = false;
  }
  // 添加监听器
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  // 添加销毁监听器
  subscribeDestroy(listener) {
    this.destroyListeners.add(listener);
    return () => {
      this.destroyListeners.delete(listener);
    };
  }
  // 触发销毁监听器
  emitDestroy() {
    this.destroyListeners.forEach((listener) => listener());
  }
  // 设置激活状态
  setActive(active) {
    if (active === this.active) return;
    this.active = active;
    this.emit();
  }
  // 获取激活状态
  getActive() {
    return this.active;
  }
  // 设置缓存节点
  setOutlet(outlet) {
    this.outlet = outlet;
  }
  // 获取outlet
  getOutlet() {
    return this.outlet;
  }
  // 设置cacheProps
  setCacheProps(cacheProps) {
    this.cacheProps = cacheProps;
  }
  // 获取cacheProps
  getCacheProps() {
    return this.cacheProps;
  }
  // 触发更新，通知所有监听器缓存节点发生了变化。
  emit() {
    this.listeners.forEach((listener) => listener());
  }
};
var CacheStore = class {
  entries = /* @__PURE__ */ new Map();
  /**列表变更监听器 */
  listeners = /* @__PURE__ */ new Set();
  entriesSnapshot = [];
  // 添加监听器，当缓存节点发生变化时调用。
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  // 获取缓存节点
  getCacheNodes() {
    return this.entriesSnapshot;
  }
  // 创建一个新的缓存节点，返回该节点的引用。
  getOrCreate(cacheId, outlet, cacheProps) {
    let cacheNode = this.entries.get(cacheId);
    let changed = false;
    if (!cacheNode) {
      cacheNode = new CacheNode(cacheId);
      this.entries.set(cacheId, cacheNode);
      changed = true;
    }
    if (!Object.is(outlet, cacheNode.getOutlet())) {
      cacheNode.setOutlet(outlet);
    }
    if (!Object.is(cacheProps, cacheNode.getCacheProps())) {
      cacheNode.setCacheProps(cacheProps);
    }
    if (changed) this.emit();
    return cacheNode;
  }
  // 激活缓存节点，将其他设置为未激活状态
  activate(cacheId) {
    const cacheNode = this.entries.get(cacheId);
    if (cacheNode) {
      cacheNode.setActive(true);
      this.entries.forEach((node) => {
        if (node !== cacheNode) {
          node.setActive(false);
        }
      });
      this.emit();
    }
  }
  // 销毁缓存节点
  destroy(cacheId) {
    const cacheNode = this.entries.get(cacheId);
    if (cacheNode && !cacheNode.getActive()) {
      this.entries.delete(cacheId);
      this.emit();
    }
  }
  // 销毁所有节点
  destroyAll() {
    const unActiveCacheIds = [];
    this.entries.forEach((node) => {
      if (!node.getActive()) {
        unActiveCacheIds.push(node.cacheId);
      }
    });
    unActiveCacheIds.forEach((cacheId) => this.entries.delete(cacheId));
    this.emit();
  }
  // 触发更新，通知所有监听器缓存节点发生了变化。
  emit() {
    this.entriesSnapshot = Array.from(this.entries.values());
    this.listeners.forEach((listener) => listener());
  }
};

// src/context.ts
var ScopeContext = createContext(null);
var CacheNodeContext = createContext(null);

// src/scope-provider.tsx
import { jsx } from "react/jsx-runtime";
function ScopeProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = new CacheStore();
  }
  return /* @__PURE__ */ jsx(ScopeContext.Provider, { value: storeRef.current, children });
}

// src/keep-alive-outlet.tsx
import { useContext, useLayoutEffect, useEffect, useSyncExternalStore, Activity } from "react";
import { useLocation, useOutlet } from "react-router";
import { jsx as jsx2 } from "react/jsx-runtime";
var CacheItem = ({ cacheNode }) => {
  const active = useSyncExternalStore(
    (listener) => cacheNode.subscribe(listener),
    () => cacheNode.getActive(),
    () => cacheNode.getActive()
  );
  useEffect(() => {
    return () => {
      cacheNode.emitDestroy();
    };
  }, []);
  return /* @__PURE__ */ jsx2(Activity, { mode: active ? "visible" : "hidden", name: cacheNode.cacheId, children: /* @__PURE__ */ jsx2(CacheNodeContext.Provider, { value: cacheNode, children: cacheNode.getOutlet() }) });
};
function KeepAliveOutlet({ cacheId, cacheProps }) {
  const store = useContext(ScopeContext);
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const currentId = cacheId ?? pathname;
  const cacheNodes = useSyncExternalStore(
    (listener) => store?.subscribe(listener) ?? (() => {
    }),
    () => store?.getCacheNodes() ?? [],
    () => store?.getCacheNodes() ?? []
  );
  useLayoutEffect(() => {
    if (!store || !outlet) {
      return;
    }
    const cacheNode = store.getOrCreate(currentId, outlet, cacheProps);
    if (!cacheNode.getActive()) {
      store.activate(currentId);
    }
  }, [currentId, store, outlet, cacheProps]);
  if (!store) {
    return outlet;
  }
  return cacheNodes.map((cacheNode) => /* @__PURE__ */ jsx2(CacheItem, { cacheNode, store }, cacheNode.cacheId));
}

// src/hooks.ts
import {
  useContext as useContext2,
  useEffect as useEffect2,
  useLayoutEffect as useLayoutEffect2,
  useRef as useRef2,
  useSyncExternalStore as useSyncExternalStore2
} from "react";
var useAliveController = () => {
  const store = useContext2(ScopeContext);
  const cachingNodes = useSyncExternalStore2(
    (listener) => store?.subscribe(listener) ?? (() => {
    }),
    () => store?.getCacheNodes() ?? [],
    () => store?.getCacheNodes() ?? []
  );
  const destroy = (cacheId) => {
    store?.destroy(cacheId);
  };
  const destroyAll = () => {
    store?.destroyAll();
  };
  return {
    cachingNodes: cachingNodes.map((node) => ({
      cacheId: node.cacheId,
      active: node.getActive(),
      cacheProps: node.getCacheProps()
    })),
    destroy,
    destroyAll
  };
};
var useMountEffect = (callback) => {
  const isMomunt = useRef2(false);
  const cacheNode = useContext2(CacheNodeContext);
  useEffect2(() => {
    if (!isMomunt.current) {
      isMomunt.current = true;
      const result = callback();
      if (result) cacheNode?.subscribeDestroy(result);
    }
  }, []);
};
var useDepsEffect = (callback, deps) => {
  const isMomunt = useRef2(false);
  const isActive = useRef2(false);
  const isDeactive = useRef2(false);
  const resultRef = useRef2(null);
  const cacheNode = useContext2(CacheNodeContext);
  useLayoutEffect2(() => {
    isActive.current = true;
    isDeactive.current = false;
    return () => {
      isDeactive.current = true;
    };
  }, []);
  useEffect2(() => {
    if (!isMomunt.current) {
      cacheNode?.subscribeDestroy(() => {
        resultRef.current?.();
      });
    }
    if (!isMomunt.current || !isActive.current) {
      isMomunt.current = true;
      resultRef.current = callback();
    }
    if (isActive.current) isActive.current = false;
    return () => {
      if (!isDeactive.current) {
        resultRef.current?.();
        resultRef.current = null;
      }
    };
  }, deps);
};
export {
  KeepAliveOutlet,
  ScopeProvider,
  useAliveController,
  useDepsEffect,
  useMountEffect
};

// src/ScopeProvider.tsx
import { useRef as useRef2, useCallback } from "react";

// src/context.ts
import { createContext } from "react";
var ScopeContext = createContext(null);
var KeepAliveContext = createContext(null);

// src/cacheStore.ts
function shallowEqualRecord(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  return leftKeys.every((key) => Object.is(left[key], right[key]));
}
function equalBridges(left, right) {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((bridge, index) => {
    const next = right[index];
    return bridge.context === next.context && Object.is(bridge.value, next.value);
  });
}
function isScrollableElement(node) {
  const style = window.getComputedStyle(node);
  const canScrollY = /(auto|scroll|overlay)/.test(style.overflowY) && node.scrollHeight > node.clientHeight;
  const canScrollX = /(auto|scroll|overlay)/.test(style.overflowX) && node.scrollWidth > node.clientWidth;
  return canScrollY || canScrollX;
}
function collectAncestorScrollTargets(target) {
  const targets = [];
  let current = target.parentElement;
  while (current) {
    if (isScrollableElement(current)) {
      targets.push(current);
    }
    current = current.parentElement;
  }
  if (document.scrollingElement && !targets.includes(window)) {
    targets.push(window);
  }
  return targets;
}
function collectDescendantScrollTargets(root) {
  const targets = [];
  if (isScrollableElement(root)) {
    targets.push(root);
  }
  root.querySelectorAll("*").forEach((node) => {
    if (isScrollableElement(node)) {
      targets.push(node);
    }
  });
  return targets;
}
function collectScrollTargets(target, portalContainer) {
  const targets = [...collectAncestorScrollTargets(target)];
  if (portalContainer) {
    for (const node of collectDescendantScrollTargets(portalContainer)) {
      if (!targets.includes(node)) {
        targets.push(node);
      }
    }
  }
  return targets;
}
function readScrollPosition(target) {
  if (target instanceof Window) {
    return {
      target,
      top: window.scrollY,
      left: window.scrollX
    };
  }
  return {
    target,
    top: target.scrollTop,
    left: target.scrollLeft
  };
}
function writeScrollPosition({ target, top, left }) {
  if (target instanceof Window) {
    window.scrollTo(left, top);
    return;
  }
  if (!target.isConnected) {
    return;
  }
  target.scrollTop = top;
  target.scrollLeft = left;
}
var CacheEntry = class {
  name;
  portalContainer = null;
  parkingRoot = null;
  target = null;
  parentActive = true;
  active = false;
  children = null;
  props = {};
  bridge = [];
  scrollPositions = [];
  snapshot;
  listeners = /* @__PURE__ */ new Set();
  activeListeners = /* @__PURE__ */ new Set();
  activateHooks = /* @__PURE__ */ new Set();
  unactivateHooks = /* @__PURE__ */ new Set();
  lifecycleContextValue;
  /**初始化单个缓存实体的内部状态与对外生命周期接口。 */
  constructor(name) {
    this.name = name;
    this.snapshot = {
      name,
      active: false,
      children: null,
      props: {},
      bridge: []
    };
    this.lifecycleContextValue = {
      getActive: () => this.active,
      addActiveListener: (listener) => this.addActiveListener(listener),
      addActivateHook: (listener) => this.addActivateHook(listener),
      addUnactivateHook: (listener) => this.addUnactivateHook(listener)
    };
  }
  /**订阅当前缓存实体的快照变化，供 renderer 使用。 */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  /**返回供 useSyncExternalStore 使用的不可变快照。 */
  getSnapshot() {
    return this.snapshot;
  }
  /**暴露给缓存树内部的生命周期上下文对象。 */
  getLifecycleContextValue() {
    return this.lifecycleContextValue;
  }
  /**将内部状态转换成公开的缓存列表项。 */
  getCacheNode() {
    return {
      name: this.name,
      active: this.active,
      props: { ...this.props }
    };
  }
  /**更新停车场根节点，失活时会把 portal 容器移动到这里。 */
  setParkingRoot(node) {
    this.parkingRoot = node;
    this.syncHost();
  }
  /**绑定或替换稳定的 portal 容器，并立即同步到正确宿主节点。 */
  setPortalContainer(node) {
    if (this.portalContainer === node) {
      return;
    }
    if (this.portalContainer?.parentNode) {
      this.portalContainer.parentNode.removeChild(this.portalContainer);
    }
    this.portalContainer = node;
    if (node) {
      node.dataset.keepAlivePortal = this.name;
      this.syncHost();
    }
  }
  /**合并来自 KeepAlive 的最新输入，并在必要时派发生命周期与快照更新。 */
  reconcile(update) {
    const previousTarget = this.getUsableTarget();
    const wasActive = this.active;
    let changed = false;
    if ("target" in update) {
      const nextTarget = update.target ?? null;
      if (this.target && nextTarget && this.target !== nextTarget) {
        console.warn(
          `[KeepAlive] duplicated active name "${this.name}" detected. Reusing the latest mounted instance.`
        );
      }
      if (this.target !== nextTarget) {
        this.target = nextTarget;
        changed = true;
      }
    }
    if ("parentActive" in update) {
      const nextParentActive = update.parentActive ?? true;
      if (this.parentActive !== nextParentActive) {
        this.parentActive = nextParentActive;
        changed = true;
      }
    }
    if ("children" in update && !Object.is(this.children, update.children)) {
      this.children = update.children ?? null;
      changed = true;
    }
    if ("props" in update) {
      const nextProps = { ...update.props ?? {} };
      if (!shallowEqualRecord(this.props, nextProps)) {
        this.props = nextProps;
        changed = true;
      }
    }
    if ("bridge" in update) {
      const nextBridge = [...update.bridge ?? []];
      if (!equalBridges(this.bridge, nextBridge)) {
        this.bridge = nextBridge;
        changed = true;
      }
    }
    const activeChanged = this.syncActive();
    if (wasActive && !this.active) {
      this.captureScrollPositions(previousTarget);
    }
    this.syncHost();
    if (!wasActive && this.active) {
      this.restoreScrollPositions();
    }
    if (changed || activeChanged) {
      this.emit();
    }
  }
  /**销毁缓存实体，清空监听器并把容器从 DOM 中摘除。 */
  destroy() {
    const wasActive = this.active;
    this.target = null;
    this.parentActive = false;
    this.active = false;
    if (wasActive) {
      this.activeListeners.forEach((listener) => listener(false));
      this.fireUnactivate();
    }
    if (this.portalContainer?.parentNode) {
      this.portalContainer.parentNode.removeChild(this.portalContainer);
    }
    this.listeners.clear();
    this.activeListeners.clear();
    this.activateHooks.clear();
    this.unactivateHooks.clear();
  }
  /**触发当前缓存实体内注册的激活回调。 */
  fireActivate() {
    this.activateHooks.forEach((listener) => listener());
  }
  /**触发当前缓存实体内注册的失活回调。 */
  fireUnactivate() {
    this.unactivateHooks.forEach((listener) => listener());
  }
  /**注册 active 变化监听，主要给嵌套 KeepAlive 透传父级状态。 */
  addActiveListener(listener) {
    this.activeListeners.add(listener);
    return () => {
      this.activeListeners.delete(listener);
    };
  }
  /**注册 useActivate 对应的生命周期回调。 */
  addActivateHook(listener) {
    this.activateHooks.add(listener);
    return () => {
      this.activateHooks.delete(listener);
    };
  }
  /**注册 useUnactivate 对应的生命周期回调。 */
  addUnactivateHook(listener) {
    this.unactivateHooks.add(listener);
    return () => {
      this.unactivateHooks.delete(listener);
    };
  }
  /**获取当前实体的active状态 */
  getActive() {
    return this.active;
  }
  /**根据目标占位点和父级状态推导当前active是否变更 */
  syncActive() {
    const nextActive = Boolean(this.getUsableTarget()) && this.parentActive;
    if (nextActive === this.active) {
      return false;
    }
    this.active = nextActive;
    this.activeListeners.forEach((listener) => listener(nextActive));
    return true;
  }
  /**返回当前仍可安全挂载的占位点，过滤掉已脱离文档或形成环引用的 target。 */
  getUsableTarget() {
    if (!this.target || !this.target.isConnected) {
      return null;
    }
    if (this.portalContainer && this.portalContainer.contains(this.target)) {
      return null;
    }
    return this.target;
  }
  /**记录当前占位点外层滚动容器的位置，供下次激活时恢复。 */
  captureScrollPositions(target) {
    if (!target || typeof window === "undefined" || typeof document === "undefined") {
      this.scrollPositions = [];
      return;
    }
    this.scrollPositions = collectScrollTargets(target, this.portalContainer).map(
      readScrollPosition
    );
  }
  /**恢复上次失活时记录的外层滚动容器位置。 */
  restoreScrollPositions() {
    for (let index = this.scrollPositions.length - 1; index >= 0; index -= 1) {
      writeScrollPosition(this.scrollPositions[index]);
    }
  }
  /**把稳定的 portal 容器挂到当前应该显示的位置，或挂回停车场。 */
  syncHost() {
    const host = this.getUsableTarget() ?? this.parkingRoot;
    if (!host || !this.portalContainer || this.portalContainer.parentNode === host) {
      return;
    }
    host.appendChild(this.portalContainer);
  }
  /**生成新快照并广播给订阅方，驱动底层 renderer 更新。 */
  emit() {
    this.snapshot = {
      name: this.name,
      active: this.active,
      children: this.children,
      props: { ...this.props },
      bridge: [...this.bridge]
    };
    this.listeners.forEach((listener) => listener());
  }
};
var CacheStore = class {
  parkingRoot = null;
  entries = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  entriesSnapshot = [];
  /**订阅整个缓存集合的增删变化。 */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  /**返回当前缓存实体列表快照，供 CacheRenderer 渲染所有缓存。 */
  getEntriesSnapshot = () => {
    return this.entriesSnapshot;
  };
  /**按 name 查询单个缓存实体。 */
  get(name) {
    return this.entries.get(name);
  }
  /**按需创建缓存实体，并让新实体继承当前停车场节点。 */
  getOrCreate(name) {
    const existing = this.entries.get(name);
    if (existing) {
      return existing;
    }
    const entry = new CacheEntry(name);
    entry.setParkingRoot(this.parkingRoot);
    this.entries.set(name, entry);
    this.emit();
    return entry;
  }
  /**更新全局停车场根节点，并同步给所有已存在的缓存实体。 */
  setParkingRoot(node) {
    this.parkingRoot = node;
    this.entries.forEach((entry) => entry.setParkingRoot(node));
  }
  /**销毁指定 name 的缓存，可批量传入多个 name。 */
  destroy(name) {
    const names = typeof name === "string" ? [name] : name;
    let changed = false;
    names.forEach((cacheName) => {
      const entry = this.entries.get(cacheName);
      if (!entry || entry?.getActive()) {
        return;
      }
      entry.destroy();
      this.entries.delete(cacheName);
      changed = true;
    });
    if (changed) {
      this.emit();
    }
  }
  /**销毁当前 store 中的全部非活跃缓存实体。 */
  destroyAll() {
    if (this.entries.size === 0) {
      return;
    }
    const names = [];
    this.entries.forEach((entry) => {
      if (!entry.getActive()) {
        names.push(entry.name);
      }
    });
    names.forEach((name) => {
      this.entries.delete(name);
      this.entries.get(name)?.destroy();
    });
    this.emit();
  }
  /**刷新缓存集合快照，并通知依赖整个 store 的订阅方。 */
  emit() {
    this.entriesSnapshot = Array.from(this.entries.values());
    this.listeners.forEach((listener) => listener());
  }
};

// src/CacheRenderer.tsx
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore
} from "react";
import { createPortal } from "react-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var useSafeLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
function BridgeProviders({
  bridges,
  children
}) {
  return bridges.reduceRight((accumulator, bridge) => {
    const Provider = bridge.context;
    return /* @__PURE__ */ jsx(Provider, { value: bridge.value, children: accumulator });
  }, children);
}
function CacheItem({ entry }) {
  const snapshot = useSyncExternalStore(
    (listener) => entry.subscribe(listener),
    () => entry.getSnapshot(),
    () => entry.getSnapshot()
  );
  const portalContainerRef = useRef(null);
  const lastActiveRef = useRef(null);
  if (portalContainerRef.current === null && typeof document !== "undefined") {
    portalContainerRef.current = document.createElement("div");
  }
  useSafeLayoutEffect(() => {
    entry.setPortalContainer(portalContainerRef.current);
    return () => {
      entry.setPortalContainer(null);
    };
  }, [entry]);
  useSafeLayoutEffect(() => {
    const previous = lastActiveRef.current;
    if (previous === null) {
      if (snapshot.active) {
        entry.fireActivate();
      }
    } else if (previous !== snapshot.active) {
      if (snapshot.active) {
        entry.fireActivate();
      } else {
        entry.fireUnactivate();
      }
    }
    lastActiveRef.current = snapshot.active;
  }, [entry, snapshot.active]);
  if (!portalContainerRef.current) {
    return null;
  }
  return createPortal(
    /* @__PURE__ */ jsx(BridgeProviders, { bridges: snapshot.bridge, children: /* @__PURE__ */ jsx(KeepAliveContext.Provider, { value: entry.getLifecycleContextValue(), children: snapshot.children }) }),
    portalContainerRef.current
  );
}
function CacheRenderer({
  store,
  parkingRootRef
}) {
  const entries = useSyncExternalStore(
    (listener) => store.subscribe(listener),
    store.getEntriesSnapshot,
    store.getEntriesSnapshot
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: parkingRootRef,
        hidden: true,
        style: { display: "none" },
        "data-keep-alive-root": "parking"
      }
    ),
    entries.map((entry) => /* @__PURE__ */ jsx(CacheItem, { entry }, entry.name))
  ] });
}

// src/ScopeProvider.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function ScopeProvider({ children }) {
  const storeRef = useRef2(null);
  if (storeRef.current === null) {
    storeRef.current = new CacheStore();
  }
  const store = storeRef.current;
  const setParkingRoot = useCallback(
    (node) => {
      store.setParkingRoot(node);
    },
    [store]
  );
  return /* @__PURE__ */ jsxs2(ScopeContext.Provider, { value: store, children: [
    children,
    /* @__PURE__ */ jsx2(CacheRenderer, { store, parkingRootRef: setParkingRoot })
  ] });
}

// src/KeepAlive.tsx
import { useContext, useEffect as useEffect2, useLayoutEffect as useLayoutEffect2, useRef as useRef3 } from "react";

// src/fiberBridge.ts
var CONTEXT_PROVIDER_TAG = 10;
var REACT_FIBER_PREFIX = "__reactFiber$";
var REACT_CONTAINER_PREFIX = "__reactContainer$";
function isContext(value) {
  return typeof value === "object" && value !== null && "$$typeof" in value && value.$$typeof === /* @__PURE__ */ Symbol.for("react.context");
}
function isFiberNode(value) {
  return typeof value === "object" && value !== null && "tag" in value && "type" in value && "return" in value;
}
function readFiber(node) {
  const reactInternals = node;
  for (const key of Object.getOwnPropertyNames(node)) {
    if (key.startsWith(REACT_FIBER_PREFIX) || key.startsWith(REACT_CONTAINER_PREFIX)) {
      const fiber = reactInternals[key];
      return isFiberNode(fiber) ? fiber : null;
    }
  }
  return null;
}
function getClosestFiber(node) {
  let current = node;
  while (current) {
    const fiber = readFiber(current);
    if (fiber) {
      return fiber;
    }
    current = current.parentNode;
  }
  return null;
}
function collectBridgeProviders(anchor) {
  const providers = [];
  let current = getClosestFiber(anchor);
  while (current) {
    if (current.tag === CONTEXT_PROVIDER_TAG && isContext(current.type)) {
      providers.push({
        context: current.type,
        value: current.memoizedProps?.value
      });
    }
    current = current.return;
  }
  providers.reverse();
  return providers;
}

// src/KeepAlive.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var useSafeLayoutEffect2 = typeof window === "undefined" ? useEffect2 : useLayoutEffect2;
function KeepAlive({ name, children, ...restProps }) {
  const anchorRef = useRef3(null);
  const store = useContext(ScopeContext);
  const parentKeepAlive = useContext(KeepAliveContext);
  useSafeLayoutEffect2(() => {
    if (!store) {
      return;
    }
    const anchor = anchorRef.current;
    if (!anchor) {
      return;
    }
    const entry = store.getOrCreate(name);
    entry.reconcile({
      target: anchor,
      parentActive: parentKeepAlive?.getActive() ?? true,
      children,
      props: restProps,
      bridge: collectBridgeProviders(anchor)
    });
    return () => {
      entry.reconcile({ target: null });
    };
  }, [store, name]);
  useSafeLayoutEffect2(() => {
    if (!store) {
      return;
    }
    const anchor = anchorRef.current;
    const entry = store.get(name);
    if (!anchor || !entry) {
      return;
    }
    entry.reconcile({
      children,
      props: restProps,
      bridge: collectBridgeProviders(anchor)
    });
  }, [store, name, children, restProps]);
  useSafeLayoutEffect2(() => {
    if (!store) {
      return;
    }
    const entry = store.get(name);
    if (!entry) {
      return;
    }
    entry.reconcile({
      parentActive: parentKeepAlive?.getActive() ?? true
    });
    if (!parentKeepAlive) {
      return;
    }
    return parentKeepAlive.addActiveListener((active) => {
      entry.reconcile({ parentActive: active });
    });
  }, [store, name, parentKeepAlive]);
  if (!store) {
    return children;
  }
  return /* @__PURE__ */ jsx3("div", { ref: anchorRef, "data-keep-alive-anchor": name });
}

// src/hooks.ts
import { useEffect as useEffect3, useLayoutEffect as useLayoutEffect3, useContext as useContext2, useRef as useRef4, useSyncExternalStore as useSyncExternalStore2 } from "react";
var useSafeLayoutEffect3 = typeof window === "undefined" ? useEffect3 : useLayoutEffect3;
function useAliveController() {
  const store = useContext2(ScopeContext);
  const snapshots = useSyncExternalStore2(
    (listener) => store?.subscribe(listener) ?? (() => {
    }),
    () => store?.getEntriesSnapshot() ?? [],
    () => store?.getEntriesSnapshot() ?? []
  );
  const destroy = (name) => store?.destroy(name);
  const destroyAll = () => store?.destroyAll();
  return {
    destroy,
    destroyAll,
    cachingNodes: snapshots.map((entry) => entry.getCacheNode())
  };
}
function useActivate(fn) {
  const ctx = useContext2(KeepAliveContext);
  useSafeLayoutEffect3(() => {
    if (!ctx) {
      return;
    }
    return ctx.addActivateHook(fn);
  }, [ctx, fn]);
}
function useUnactivate(fn) {
  const ctx = useContext2(KeepAliveContext);
  useSafeLayoutEffect3(() => {
    if (!ctx) {
      return;
    }
    return ctx.addUnactivateHook(fn);
  }, [ctx, fn]);
}
export {
  KeepAlive,
  ScopeProvider,
  useActivate,
  useAliveController,
  useUnactivate
};

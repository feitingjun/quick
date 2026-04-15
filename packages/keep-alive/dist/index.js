// src/KeepAliveOutlet.tsx
import {
  Activity,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useSyncExternalStore
} from "react";
import { useLocation, useOutlet } from "react-router";

// src/cacheStore.ts
function shallowEqualRecord(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  return leftKeys.every((key) => Object.is(left[key], right[key]));
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
function collectScrollTargets(root) {
  const targets = [...collectAncestorScrollTargets(root)];
  for (const node of collectDescendantScrollTargets(root)) {
    if (!targets.includes(node)) {
      targets.push(node);
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
function createEntryId(scopeId, name) {
  return `${scopeId}:${name}`;
}
var CacheStore = class {
  entries = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  scrollPositions = /* @__PURE__ */ new Map();
  entriesSnapshot = [];
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  getEntriesSnapshot = () => {
    return this.entriesSnapshot;
  };
  syncScope({ scopeId, name, element, props }) {
    const activeId = createEntryId(scopeId, name);
    const nextProps = { ...props ?? {} };
    let changed = false;
    const current = this.entries.get(activeId);
    if (!current) {
      this.entries.set(activeId, {
        id: activeId,
        scopeId,
        name,
        active: true,
        element,
        props: nextProps
      });
      changed = true;
    } else if (!current.active || !shallowEqualRecord(current.props, nextProps)) {
      this.entries.set(activeId, {
        ...current,
        active: true,
        props: nextProps
      });
      changed = true;
    }
    this.entries.forEach((entry, id) => {
      if (id === activeId || entry.scopeId !== scopeId || !entry.active) {
        return;
      }
      this.entries.set(id, {
        ...entry,
        active: false
      });
      changed = true;
    });
    if (changed) {
      this.emit();
    }
  }
  deactivateScope(scopeId) {
    let changed = false;
    this.entries.forEach((entry, id) => {
      if (entry.scopeId !== scopeId || !entry.active) {
        return;
      }
      this.entries.set(id, {
        ...entry,
        active: false
      });
      changed = true;
    });
    if (changed) {
      this.emit();
    }
  }
  destroy(name) {
    const names = typeof name === "string" ? [name] : name;
    let changed = false;
    this.entries.forEach((entry, id) => {
      if (entry.active || !names.includes(entry.name)) {
        return;
      }
      this.entries.delete(id);
      this.scrollPositions.delete(id);
      changed = true;
    });
    if (changed) {
      this.emit();
    }
  }
  destroyAll() {
    let changed = false;
    this.entries.forEach((entry, id) => {
      if (entry.active) {
        return;
      }
      this.entries.delete(id);
      this.scrollPositions.delete(id);
      changed = true;
    });
    if (changed) {
      this.emit();
    }
  }
  clearScope(scopeId) {
    let changed = false;
    this.entries.forEach((entry, id) => {
      if (entry.scopeId !== scopeId) {
        return;
      }
      this.entries.delete(id);
      this.scrollPositions.delete(id);
      changed = true;
    });
    if (changed) {
      this.emit();
    }
  }
  captureScrollPositions(id, root) {
    if (!root) {
      this.scrollPositions.delete(id);
      return;
    }
    this.scrollPositions.set(id, collectScrollTargets(root).map(readScrollPosition));
  }
  restoreScrollPositions(id) {
    const positions = this.scrollPositions.get(id);
    if (!positions?.length) {
      return;
    }
    for (let index = positions.length - 1; index >= 0; index -= 1) {
      writeScrollPosition(positions[index]);
    }
  }
  getCacheNodes() {
    return this.entriesSnapshot.map((entry) => ({
      name: entry.name,
      active: entry.active,
      props: { ...entry.props }
    }));
  }
  emit() {
    this.entriesSnapshot = Array.from(this.entries.values()).map((entry) => ({
      ...entry,
      props: { ...entry.props }
    }));
    this.listeners.forEach((listener) => listener());
  }
};

// src/context.ts
import { createContext } from "react";
var ScopeContext = createContext(null);
var KeepAliveContext = createContext(null);

// src/KeepAliveOutlet.tsx
import { jsx } from "react/jsx-runtime";
var EMPTY_ENTRIES = [];
var EMPTY_PROPS = {};
function CacheItem({ entry, store }) {
  const rootRef = useRef(null);
  const lastActiveRef = useRef(entry.active);
  useLayoutEffect(() => {
    const wasActive = lastActiveRef.current;
    if (wasActive && !entry.active) {
      store.captureScrollPositions(entry.id, rootRef.current);
    }
    if (!wasActive && entry.active) {
      store.restoreScrollPositions(entry.id);
    }
    lastActiveRef.current = entry.active;
  }, [entry.active, entry.id, store]);
  return /* @__PURE__ */ jsx(Activity, { mode: entry.active ? "visible" : "hidden", name: entry.name, children: /* @__PURE__ */ jsx("div", { ref: rootRef, "data-keep-alive-root": entry.name, style: { display: "contents" }, children: /* @__PURE__ */ jsx(KeepAliveContext.Provider, { value: { active: entry.active, name: entry.name }, children: entry.element }) }) });
}
function buildRenderedEntries(entries, scopeId, currentName, currentProps, outlet) {
  const nextEntries = entries.map((entry) => ({
    ...entry,
    active: outlet !== null && entry.name === currentName,
    props: entry.name === currentName ? currentProps : entry.props
  }));
  if (outlet === null || nextEntries.some((entry) => entry.name === currentName)) {
    return nextEntries;
  }
  return [
    ...nextEntries,
    {
      id: createEntryId(scopeId, currentName),
      scopeId,
      name: currentName,
      active: true,
      element: outlet,
      props: currentProps
    }
  ];
}
function KeepAliveOutlet({
  context,
  name,
  cacheProps
} = {}) {
  const store = useContext(ScopeContext);
  const scopeId = useId();
  const location = useLocation();
  const outlet = useOutlet(context);
  const currentName = name ?? location.pathname;
  const currentProps = cacheProps ?? EMPTY_PROPS;
  const entriesSnapshot = useSyncExternalStore(
    (listener) => store?.subscribe(listener) ?? (() => {
    }),
    () => store?.getEntriesSnapshot() ?? EMPTY_ENTRIES,
    () => store?.getEntriesSnapshot() ?? EMPTY_ENTRIES
  );
  const scopedEntries = entriesSnapshot.filter((entry) => entry.scopeId === scopeId);
  const renderedEntries = buildRenderedEntries(
    scopedEntries,
    scopeId,
    currentName,
    currentProps,
    outlet
  );
  useLayoutEffect(() => {
    if (!store) {
      return;
    }
    return () => {
      store.clearScope(scopeId);
    };
  }, [scopeId, store]);
  useLayoutEffect(() => {
    if (!store) {
      return;
    }
    if (outlet === null) {
      store.deactivateScope(scopeId);
      return;
    }
    store.syncScope({
      scopeId,
      name: currentName,
      element: outlet,
      props: currentProps
    });
  }, [currentName, currentProps, outlet, scopeId, store]);
  if (!store) {
    return outlet;
  }
  return renderedEntries.map((entry) => /* @__PURE__ */ jsx(CacheItem, { entry, store }, entry.id));
}

// src/ScopeProvider.tsx
import { useRef as useRef2 } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
function ScopeProvider({ children }) {
  const storeRef = useRef2(null);
  if (storeRef.current === null) {
    storeRef.current = new CacheStore();
  }
  return /* @__PURE__ */ jsx2(ScopeContext.Provider, { value: storeRef.current, children });
}

// src/hooks.ts
import {
  useContext as useContext2,
  useEffect,
  useEffectEvent,
  useLayoutEffect as useLayoutEffect2,
  useRef as useRef3,
  useSyncExternalStore as useSyncExternalStore2
} from "react";
var EMPTY_ENTRIES2 = [];
function useAliveController() {
  const store = useContext2(ScopeContext);
  const snapshots = useSyncExternalStore2(
    (listener) => store?.subscribe(listener) ?? (() => {
    }),
    () => store?.getEntriesSnapshot() ?? EMPTY_ENTRIES2,
    () => store?.getEntriesSnapshot() ?? EMPTY_ENTRIES2
  );
  return {
    destroy: (name) => store?.destroy(name),
    destroyAll: () => store?.destroyAll(),
    cachingNodes: snapshots.reduce((nodes, entry) => {
      nodes.push({
        name: entry.name,
        active: entry.active,
        props: { ...entry.props }
      });
      return nodes;
    }, [])
  };
}
function useActivate(fn) {
  const ctx = useContext2(KeepAliveContext);
  const onActivate = useEffectEvent(fn);
  useLayoutEffect2(() => {
    if (!ctx?.active) {
      return;
    }
    onActivate();
  }, [ctx?.active]);
}
function useUnactivate(fn) {
  const ctx = useContext2(KeepAliveContext);
  const onUnactivate = useEffectEvent(fn);
  useLayoutEffect2(() => {
    if (!ctx?.active) {
      return;
    }
    return () => {
      onUnactivate();
    };
  }, [ctx?.active]);
}
export {
  KeepAliveOutlet,
  ScopeProvider,
  useActivate,
  useAliveController,
  useUnactivate
};

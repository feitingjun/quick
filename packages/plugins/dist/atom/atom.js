// src/atom/atom.ts
import { useSyncExternalStore, use } from "react";
var getAtom = (atom2) => atom2.get();
var setAtom = (atom2, value) => atom2.set(value);
var BaseAtom = class {
  /** 原子的状态 */
  state;
  /** 订阅者列表 */
  listeners = /* @__PURE__ */ new Set();
  /**当前atom的自定义set函数 */
  setCombine;
  constructor(_, setCombine) {
    this.setCombine = setCombine;
  }
  get = () => {
    return this.state;
  };
  subscribe = (cb) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  };
};
var Atom = class extends BaseAtom {
  constructor(initValue, setCombine) {
    super(initValue, setCombine);
    this.state = initValue;
  }
  // 更新state值，触发setCombine
  set = (value) => {
    let newV = typeof value === "function" ? value(this.state) : value;
    if (this.setCombine) {
      newV = this.setCombine(newV, getAtom, setAtom);
    }
    this.state = newV;
    this.listeners.forEach((cb) => cb());
  };
};
var CombineAtom = class extends BaseAtom {
  /** 依赖atom列表，任意一个atom变更，都会触发getCombine方法 */
  atoms = /* @__PURE__ */ new Set();
  /**当前atom的自定义get函数，通常用来从其他一个或多个atom获取组合数据，如果存在此方法，此atom的state不能手动变更 */
  getCombine;
  /**初始异步加载数据的promise(供react的use方法使用，以此使组件在数据未加载完成时等待) */
  promise;
  constructor(initValue, setCombine) {
    super(initValue, setCombine);
    this.getCombine = initValue;
    this.promise = this.getCombineValue(true);
  }
  getCombineValue = async (first) => {
    const combines = this.getCombine((atom2) => {
      {
        this.atoms.add(atom2);
        return atom2.get();
      }
    });
    if (first) this.atoms.forEach((atom2) => atom2.subscribe(this.getCombineValue));
    const value = await combines;
    this.state = value;
    this.listeners.forEach((cb) => cb());
  };
  set = (value) => {
    const newV = typeof value === "function" ? value(this.state) : value;
    if (this.setCombine) this.setCombine(newV, getAtom, setAtom);
  };
};
function atom(initValue, setCombine) {
  if (typeof initValue === "function") {
    return new CombineAtom(initValue, setCombine);
  }
  return new Atom(initValue, setCombine);
}
function useAtom(atom2) {
  if (atom2 instanceof CombineAtom && atom2.promise) use(atom2.promise);
  const state = useSyncExternalStore(
    atom2.subscribe,
    atom2.get
  );
  return [state, atom2.set];
}
function useAtomValue(atom2) {
  if (atom2 instanceof CombineAtom && atom2.promise) use(atom2.promise);
  return useSyncExternalStore(
    atom2.subscribe,
    atom2.get
  );
}
function useSetAtom(atom2) {
  return atom2.set;
}
export {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom
};

// src/keepAlive/activation.ts
var Activation = class {
  name;
  /**组件的dom */
  dom = null;
  /**组件是否激活 */
  _active = false;
  /**组件的props */
  props = {};
  /**桥接的bridges列表 */
  bridges = [];
  /**这个组件实际的容器 */
  wrapper = null;
  /**滚动位置缓存 */
  scroll = /* @__PURE__ */ new Map();
  /**当前组件的children */
  children = null;
  /**当前组件变更监听 */
  listeners = /* @__PURE__ */ new Set();
  /**当前组件active状态变更监听 */
  activeListeners = /* @__PURE__ */ new Set();
  /**子组件内的useActivate */
  activateHooks = /* @__PURE__ */ new Set();
  /**子组件内的useUnactivate */
  unactivateHooks = /* @__PURE__ */ new Set();
  constructor(name) {
    this.name = name;
  }
  get active() {
    return this._active;
  }
  set active(active) {
    if (active === this._active) return;
    this.activeListeners.forEach((fn) => fn(active));
    this._active = active;
  }
  /**添加变更监听器 */
  subscribe = (cb) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  };
  /**触发变更 */
  update = () => {
    this.listeners.forEach((fn) => fn(this));
  };
  /**保存滚动位置 */
  saveScroll = (ele) => {
    if (!ele) return;
    this.scroll.set(ele, {
      x: ele.scrollLeft,
      y: ele.scrollTop
    });
    if (ele.childNodes.length > 0) {
      ele.childNodes.forEach((child) => {
        if (child instanceof HTMLElement && !child.classList.contains("ka-alive")) {
          this.saveScroll(child);
        }
      });
    }
  };
  /**恢复滚动位置 */
  restoreScroll = (ele) => {
    if (!ele) return;
    const scroll = this.scroll.get(ele);
    if (scroll) {
      ele.scrollTo(scroll.x, scroll.y);
    }
    if (ele.childNodes.length > 0) {
      ele.childNodes.forEach((child) => {
        if (child instanceof HTMLElement) {
          this.restoreScroll(child);
        }
      });
    }
  };
};
export {
  Activation as default
};
//# sourceMappingURL=activation.js.map
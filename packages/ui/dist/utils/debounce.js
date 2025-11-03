// src/utils/debounce.ts
var debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(void 0, args);
    }, delay);
  };
};

export { debounce };
//# sourceMappingURL=debounce.js.map
//# sourceMappingURL=debounce.js.map
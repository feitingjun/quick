import { createContext, useContext } from 'react';

// src/dicts/hooks.ts
var ConfigContext = createContext({
  dicts: {}
});

// src/dicts/hooks.ts
function useDicts() {
  const { dicts } = useContext(ConfigContext);
  return dicts;
}
function useDict(code) {
  const dicts = useDicts();
  return dicts[code];
}
function useDictItem(code, value) {
  const dict = useDict(code);
  return dict?.find((item) => item.value === value);
}
function useDictLabel(code, value) {
  const item = useDictItem(code, value);
  return item?.label;
}
function useDictStatus(code, value) {
  const item = useDictItem(code, value);
  return item?.status;
}

// src/dicts/index.ts
var defineDicts = (dicts) => dicts;

export { defineDicts, useDict, useDictItem, useDictLabel, useDictStatus, useDicts };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
import {
  cssPropNames,
  style_fn_default
} from "./chunk-6HG7OCEA.js";

// src/utils.ts
import { get } from "styled-system";

// src/custom-pseudos.ts
var customPseudos = {
  _hover: ":hover",
  _active: ":active",
  _focus: ":focus",
  _focusVisible: ":focus-visible",
  _focusWithin: ":focus-within",
  _visited: ":visited",
  _link: ":link",
  _checked: ":checked",
  _readonly: ":readonly",
  _readWrite: ":read-write",
  _disabled: ":disabled",
  _before: "::before",
  _after: "::after"
};
var isCustomPseudo = (key) => key in customPseudos;

// src/utils.ts
var themeVarsCache = /* @__PURE__ */ new WeakMap();
function isSystemProp(prop) {
  return cssPropNames.has(prop);
}
function isCssProp(prop) {
  return isSystemProp(prop) || isCustomPseudo(prop);
}
function getThemeValue(value, theme) {
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, getThemeValue(v, theme)]));
  }
  if (typeof value !== "string" || !/^\{[\s\S]*\}$/.test(value)) {
    return value;
  }
  if (!themeVarsCache.has(theme)) {
    themeVarsCache.set(theme, /* @__PURE__ */ new Map());
  }
  const cache = themeVarsCache.get(theme);
  if (cache.has(value)) {
    return cache.get(value);
  } else {
    const cssValue = get(
      theme,
      value.replace(/\{([\s\S]*)\}/, (_, str) => str)
    );
    cache.set(value, cssValue);
    return cssValue;
  }
}
function transform(sx, theme) {
  const sysStyles = {};
  const otherStyles = {};
  const mediaQueries = {};
  Object.entries(sx).forEach(([k, v]) => {
    if (isCustomPseudo(k)) {
      k = customPseudos[k];
    }
    if (isSystemProp(k)) {
      sysStyles[k] = getThemeValue(v, theme);
      return;
    }
    if (k.startsWith("--") && typeof v === "object") {
      Object.entries(v).forEach(([k2, v2]) => {
        const media = transformMediaQueries(k2, theme);
        if (!media) return;
        if (!mediaQueries[media]) {
          mediaQueries[media] = {};
        }
        mediaQueries[media][k] = getThemeValue(v2, theme);
      });
      return;
    }
    otherStyles[k] = !!v && typeof v === "object" ? transform(v, theme) : getThemeValue(v, theme);
    return;
  });
  return deepMerge(otherStyles, mediaQueries, style_fn_default({ theme, ...sysStyles }));
}
function transformMediaQueries(breakpoint, theme) {
  const breakpoints = theme.breakpoints ?? [];
  const size = get(breakpoints, breakpoint);
  if (size) return `@media screen and (min-width: ${size})`;
}
function deepMerge(...objects) {
  const result = {};
  for (const obj of objects) {
    if (!obj || typeof obj !== "object") continue;
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        if (!result[key]) result[key] = {};
        result[key] = deepMerge(result[key], value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

export {
  isSystemProp,
  isCssProp,
  getThemeValue,
  transform,
  transformMediaQueries,
  deepMerge
};
//# sourceMappingURL=chunk-O3UFKRAJ.js.map
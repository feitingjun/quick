// src/styled.ts
import mStyled from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";

// src/utils.ts
import { get as get2 } from "styled-system";

// src/styled-system/style-fn.ts
import {
  compose,
  color,
  flexbox,
  grid,
  background,
  border,
  position,
  shadow,
  typography
} from "styled-system";

// src/styled-system/space.ts
import { system } from "styled-system";
var isNumber = (n) => typeof n === "number" && !isNaN(n);
var getMargin = (n, scale) => {
  if (isNumber(n) && isNumber(scale)) {
    return n * scale;
  }
  return n;
};
var configs = {
  margin: {
    property: "margin",
    scale: "space",
    transform: getMargin
  },
  marginTop: {
    property: "marginTop",
    scale: "space",
    transform: getMargin
  },
  marginRight: {
    property: "marginRight",
    scale: "space",
    transform: getMargin
  },
  marginBottom: {
    property: "marginBottom",
    scale: "space",
    transform: getMargin
  },
  marginLeft: {
    property: "marginLeft",
    scale: "space",
    transform: getMargin
  },
  marginX: {
    properties: ["marginLeft", "marginRight"],
    scale: "space",
    transform: getMargin
  },
  marginY: {
    properties: ["marginTop", "marginBottom"],
    scale: "space",
    transform: getMargin
  },
  padding: {
    property: "padding",
    scale: "space",
    transform: getMargin
  },
  paddingTop: {
    property: "paddingTop",
    scale: "space",
    transform: getMargin
  },
  paddingRight: {
    property: "paddingRight",
    scale: "space",
    transform: getMargin
  },
  paddingBottom: {
    property: "paddingBottom",
    scale: "space",
    transform: getMargin
  },
  paddingLeft: {
    property: "paddingLeft",
    scale: "space",
    transform: getMargin
  },
  paddingX: {
    properties: ["paddingLeft", "paddingRight"],
    scale: "space",
    transform: getMargin
  },
  paddingY: {
    properties: ["paddingTop", "paddingBottom"],
    scale: "space",
    transform: getMargin
  },
  gap: {
    property: "gap",
    scale: "space",
    transform: getMargin
  },
  rowGap: {
    property: "rowGap",
    scale: "space",
    transform: getMargin
  },
  columnGap: {
    property: "columnGap",
    scale: "space",
    transform: getMargin
  }
};
configs.m = configs.margin;
configs.mt = configs.marginTop;
configs.mr = configs.marginRight;
configs.mb = configs.marginBottom;
configs.ml = configs.marginLeft;
configs.mx = configs.marginX;
configs.my = configs.marginY;
configs.p = configs.padding;
configs.pt = configs.paddingTop;
configs.pr = configs.paddingRight;
configs.pb = configs.paddingBottom;
configs.pl = configs.paddingLeft;
configs.px = configs.paddingX;
configs.py = configs.paddingY;
var space = system(configs);

// src/styled-system/layout.ts
import { system as system2, get } from "styled-system";
var getWidth = (n, scale) => get(scale, n, !isNumber(n) || n > 1 ? n : n * 100 + "%");
var config = {
  width: {
    property: "width",
    scale: "sizes",
    transform: getWidth
  },
  height: {
    property: "height",
    scale: "sizes"
  },
  minWidth: {
    property: "minWidth",
    scale: "sizes"
  },
  minHeight: {
    property: "minHeight",
    scale: "sizes"
  },
  maxWidth: {
    property: "maxWidth",
    scale: "sizes"
  },
  maxHeight: {
    property: "maxHeight",
    scale: "sizes"
  },
  sizes: {
    properties: ["width", "height"],
    scale: "sizes"
  },
  overflow: true,
  overflowX: true,
  overflowY: true,
  display: true,
  cursor: true,
  verticalAlign: true
};
config.w = config.width;
config.h = config.height;
config.minW = config.minWidth;
config.minH = config.minHeight;
config.maxW = config.maxWidth;
config.maxH = config.maxHeight;
var layout = system2(config);

// src/styled-system/animation.ts
import { system as system3 } from "styled-system";
var config2 = {
  animation: true,
  animationName: true,
  animationDuration: true,
  animationTimingFunction: true,
  animationDelay: true,
  animationIterationCount: true,
  animationDirection: true,
  animationFillMode: true,
  animationPlayState: true,
  animationTimeline: true,
  animationRange: true,
  animationRangeStart: true,
  animationRangeEnd: true,
  AnimationComposition: true
};
var animation = system3(config2);

// src/styled-system/style-fn.ts
var styleFn = compose(
  color,
  space,
  layout,
  flexbox,
  grid,
  background,
  border,
  position,
  shadow,
  typography,
  animation
);
var style_fn_default = styleFn;
var cssPropNames = new Set(styleFn.propNames ?? []);

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
  if (typeof value !== "string" || !/\{([\s\S]*)\}/.test(value)) {
    return value;
  }
  if (!themeVarsCache.has(theme)) {
    themeVarsCache.set(theme, /* @__PURE__ */ new Map());
  }
  const cache = themeVarsCache.get(theme);
  if (cache.has(value)) {
    return cache.get(value);
  } else {
    const cssValue = value.replace(/\{([\s\S]*)\}/, (source, str) => get2(theme, str) ?? source);
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
    if (k.startsWith("--") && !!v && typeof v === "object") {
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
  const styles = Object.fromEntries(
    Object.entries(style_fn_default({ theme, ...sysStyles })).map(([k, v]) => [k, getThemeValue(v, theme)])
  );
  return merge(otherStyles, mediaQueries, styles);
}
function transformMediaQueries(breakpoint, theme) {
  const breakpoints = theme.breakpoints ?? [];
  const size = get2(breakpoints, breakpoint);
  if (size) return `@media screen and (min-width: ${size})`;
}
function merge(...objects) {
  const result = {};
  for (const obj of objects) {
    if (!obj || typeof obj !== "object") continue;
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        if (!result[key]) result[key] = {};
        result[key] = merge(result[key], value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

// src/styled.ts
function styled(component, recipes = {}) {
  return mStyled(component, {
    shouldForwardProp: (prop) => {
      return !(isCssProp(prop) || typeof component === "string" && !isPropValid(prop));
    }
  })((props) => {
    const { theme, preset, className, ...args } = props;
    let styles = typeof recipes === "function" ? recipes({ theme, ...args }) : recipes;
    const { base = {}, variants = {}, defaultVariants = {} } = styles;
    const variantsAttrs = new Set(Object.keys(variants ?? {}));
    const usedVariants = {};
    const otherStyles = {};
    Object.entries(args).forEach(([key, value]) => {
      if (variantsAttrs.has(key)) {
        usedVariants[key] = value;
      } else if (isCssProp(key)) {
        otherStyles[key] = value;
      }
    });
    const variantStyles = Object.entries({
      ...defaultVariants,
      ...usedVariants
    }).reduce((acc, [key, value]) => {
      return {
        ...acc,
        ...variants?.[key]?.[typeof value === "boolean" ? value.toString() : value] ?? {}
      };
    }, {});
    const mergeArgs = [];
    if (base) mergeArgs.push(transform(base, theme));
    if (variantStyles) mergeArgs.push(transform(variantStyles, theme));
    if (theme?.presets?.[preset]) mergeArgs.push(transform(theme.presets[preset], theme));
    if (otherStyles) mergeArgs.push(transform(otherStyles, theme));
    const results = merge(...mergeArgs);
    return results;
  });
}
export {
  styled
};

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
var getWidth = (n, scale) => get(scale, n, !isNumber(n) || n > 1 ? n : n === 0 ? 0 : n * 100 + "%");
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
export {
  cssPropNames,
  style_fn_default as default
};

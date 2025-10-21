import {
  isNumber
} from "./chunk-MPM2RKR7.js";

// src/styled-system/layout.ts
import { system, get } from "styled-system";
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
  verticalAlign: true
};
config.w = config.width;
config.h = config.height;
config.minW = config.minWidth;
config.minH = config.minHeight;
config.maxW = config.maxWidth;
config.maxH = config.maxHeight;
var layout = system(config);

export {
  layout
};
//# sourceMappingURL=chunk-VLAVRT4J.js.map
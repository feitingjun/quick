import {
  deepMerge,
  isCssProp,
  transform
} from "./chunk-O3UFKRAJ.js";

// src/styled.ts
import mStyled from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";
function styled(component, recipes = {}) {
  return mStyled(component, {
    shouldForwardProp: (prop) => {
      return !(isCssProp(prop) || typeof component === "string" && !isPropValid(prop));
    }
  })((props) => {
    const { sx, theme, preset, ...args } = props;
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
    const results = deepMerge(
      // 分别转换之后合并，避免 color: { sm: 'red', md: 'blue' } 等媒体查询覆盖默认 color: 'green' 的情况
      transform(base ?? {}, theme),
      transform(variantStyles ?? {}, theme),
      transform(theme?.presets?.[preset] ?? {}, theme),
      transform(sx ?? {}, theme),
      transform(otherStyles, theme)
    );
    return results;
  });
}

export {
  styled
};
//# sourceMappingURL=chunk-3N7H4NJ2.js.map
import { createContext, useMemo } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { ThemeProvider } from '@quick/cssinjs';
import { ConfigProvider as ConfigProvider$1, App } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'bignumber.js';
import 'dayjs/locale/zh-cn';
import { jsx } from '@quick/cssinjs/jsx-runtime';

// src/config-provider/index.tsx

// src/theme/default.ts
var defaultTheme = {
  colors: {
    bg: "#fff",
    bgLayout: "#f5f5f5",
    primary: "#1DA57A",
    success: "#52c41a",
    warning: "#faad14",
    error: "#ff4d4f",
    info: "#1677ff",
    link: "#1677ff",
    text: "#000",
    secondary: "#616161",
    border: "#e1e1e1",
    borderSecondary: "#f0f0f0",
    disabled: "#c0c0c0"
  },
  breakpoints: {
    sm: "480px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1440px"
  },
  space: 4,
  sizes: {
    controlHeight: 32,
    controlHeightLg: 40,
    controlHeightSm: 24,
    controlHeightXs: 16
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125
  },
  fontWeights: {
    body: 400,
    bold: 700
  },
  fontSizes: {
    caption: 12,
    body: 14,
    subtitle: 16,
    title: 18,
    heading: 20,
    display: 24
  },
  borders: {
    none: "none",
    normal: "1px solid {colors.border}",
    thick: "2px solid {colors.border}",
    dotted: "1px dotted {colors.border}",
    thickDotted: "2px dotted {colors.border}"
  },
  radii: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6
  },
  shadows: {
    none: "none",
    box: "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
    secondary: "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
    tertiary: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)"
  },
  zIndices: {
    hide: -1,
    base: 0,
    docked: 10,
    dropdown: 1e3,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    toast: 1700,
    max: 2147483647
  }
};
var ConfigContext = createContext({
  dicts: {}
});

// src/utils/objects.ts
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
var useRegisterMessage = () => {
  const { message: messageInstance } = App.useApp();
  return null;
};
var useToken = (theme) => {
  return useMemo(
    () => ({
      colorPrimary: theme?.colors?.primary,
      colorError: theme?.colors?.error,
      colorInfo: theme?.colors?.info,
      colorLink: theme?.colors?.link,
      colorSuccess: theme?.colors?.success,
      colorWarning: theme?.colors?.warning,
      colorTextBase: theme?.colors?.text,
      colorText: theme?.colors?.text,
      colorTextSecondary: theme?.colors?.secondary,
      colorBorder: theme?.colors?.border,
      colorBgBase: theme?.colors?.bg,
      colorBgLayout: theme?.colors?.bgLayout,
      fontSize: theme?.fontSizes?.body,
      fontSizeSM: theme?.fontSizes?.caption,
      fontSizeLG: theme?.fontSizes?.subtitle,
      fontSizeXL: theme?.fontSizes?.heading,
      borderRadius: theme?.radii?.sm,
      borderRadiusXS: theme?.radii?.xs,
      borderRadiusSM: theme?.radii?.sm,
      borderRadiusLG: theme?.radii?.md,
      controlHeight: theme?.sizes?.controlHeight,
      controlHeightLG: theme?.sizes?.controlHeightLg,
      controlHeightSM: theme?.sizes?.controlHeightSm,
      controlHeightXS: theme?.sizes?.controlHeightXs
    }),
    [theme]
  );
};
function Register({ children }) {
  useRegisterMessage();
  return children;
}
function ConfigProvider({ theme = {}, dicts = {}, children }) {
  const margedtheme = useMemo(() => merge(defaultTheme, theme), [theme]);
  const token = useToken(margedtheme);
  return /* @__PURE__ */ jsx(ThemeProvider, { theme: margedtheme, children: /* @__PURE__ */ jsx(StyleProvider, { layer: true, children: /* @__PURE__ */ jsx(ConfigProvider$1, { theme: { token }, locale: zhCN, children: /* @__PURE__ */ jsx(ConfigContext.Provider, { value: { dicts }, children: /* @__PURE__ */ jsx(App, { children: /* @__PURE__ */ jsx(Register, { children }) }) }) }) }) });
}

export { ConfigProvider, Register };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
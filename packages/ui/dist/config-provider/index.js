import { createContext, useMemo } from 'react';
import { ConfigProvider as ConfigProvider$1, App } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import zhCN from 'antd/locale/zh_CN';
import 'bignumber.js';
import 'dayjs/locale/zh-cn';
import { jsx } from 'react/jsx-runtime';

// src/config-provider/index.tsx

// src/theme/index.ts
var defaultTheme = {
  colorPrimary: "#1DA57A",
  colorError: "#ff4d4f",
  colorInfo: "#1677ff",
  colorLink: "#1677ff",
  colorSuccess: "#52c41a",
  colorWarning: "#faad14",
  colorTextBase: "#000",
  colorText: "#000",
  colorTextSecondary: "#616161",
  colorBorder: "#e1e1e1",
  colorBgBase: "#fff",
  colorBgLayout: "#f5f5f5",
  fontSize: 14,
  fontSizeSM: 12,
  fontSizeLG: "16px",
  fontSizeXL: "20px",
  borderRadius: 4,
  borderRadiusXS: 2,
  borderRadiusSM: 4,
  borderRadiusLG: 8,
  controlHeight: 32,
  controlHeightLG: 40,
  controlHeightSM: 24,
  controlHeightXS: 16
};

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
var ConfigContext = createContext({
  dicts: {}
});
function Register({ children }) {
  useRegisterMessage();
  return children;
}
function ConfigProvider({ theme = {}, dicts = {}, children }) {
  const mergedToken = useMemo(() => merge(defaultTheme, theme), [theme]);
  return /* @__PURE__ */ jsx(StyleProvider, { layer: true, children: /* @__PURE__ */ jsx(ConfigProvider$1, { theme: { token: mergedToken }, locale: zhCN, children: /* @__PURE__ */ jsx(ConfigContext.Provider, { value: { dicts }, children: /* @__PURE__ */ jsx(App, { children: /* @__PURE__ */ jsx(Register, { children }) }) }) }) });
}

export { ConfigProvider, Register };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
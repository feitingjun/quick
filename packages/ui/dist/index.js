// src/index.ts
import "@ant-design/v5-patch-for-react-19";

// src/theme/default.ts
var defaultTheme = {
  colors: {
    primary: "#1DA57A",
    success: "#52c41a",
    warning: "#faad14",
    error: "#ff4d4f",
    info: "#1677ff",
    link: "#1677ff",
    text: "#000",
    secondary: "#616161",
    border: "#d9d9d9",
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

// src/theme/index.ts
import { useTheme } from "@quick/cssinjs";
var defineTheme = (theme) => theme;

// src/dicts/hooks.ts
import { useContext } from "react";

// src/config-provider/context.ts
import { createContext } from "react";
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

// src/components/button/index.tsx
import { styled } from "@quick/cssinjs";
import { Button as AntdButton } from "antd";
var Button = styled(AntdButton);

// src/components/box/index.tsx
import { styled as styled2 } from "@quick/cssinjs";
import { jsx } from "@quick/cssinjs/jsx-runtime";
var StyledBox = styled2("div");
var Box = (props) => /* @__PURE__ */ jsx(StyledBox, { as: props.as, ...props });

// src/config-provider/index.tsx
import { useMemo } from "react";
import { StyleProvider } from "@ant-design/cssinjs";
import { ThemeProvider, merge } from "@quick/cssinjs";
import { ConfigProvider as AntdConfigProvider } from "antd";
import { jsx as jsx2 } from "@quick/cssinjs/jsx-runtime";
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
function ConfigProvider({ theme = {}, dicts = {}, children }) {
  const margedtheme = useMemo(() => merge(defaultTheme, theme), [theme]);
  const token = useToken(margedtheme);
  return /* @__PURE__ */ jsx2(ThemeProvider, { theme: margedtheme, children: /* @__PURE__ */ jsx2(StyleProvider, { layer: true, children: /* @__PURE__ */ jsx2(AntdConfigProvider, { theme: { token }, children: /* @__PURE__ */ jsx2(ConfigContext.Provider, { value: { dicts }, children }) }) }) });
}

// src/components/input/index.tsx
import { Input as AntdInput } from "antd";
import { styled as styled3 } from "@quick/cssinjs";
var Input = styled3(AntdInput);

// src/components/input-number/index.tsx
import { InputNumber as AntdInputNumber } from "antd";
import { styled as styled4 } from "@quick/cssinjs";
var InputNumber = styled4(AntdInputNumber);

// src/components/table/table.tsx
import { Table as AntdTable } from "antd";
import { styled as styled7 } from "@quick/cssinjs";

// src/components/table/column.tsx
import { useMemo as useMemo2 } from "react";
import { zerofill, round, isNumber, thousands, useNavigate, multiply } from "@quick/utils";
import { QuestionCircleOutlined } from "@ant-design/icons";

// src/components/tooltip/index.tsx
import { Tooltip as AntdTooltip } from "antd";
import { styled as styled5 } from "@quick/cssinjs";
var Tooltip = styled5(AntdTooltip);

// src/components/space/index.tsx
import { Space as AntdSpace } from "antd";
import { styled as styled6 } from "@quick/cssinjs";
var Space = styled6(AntdSpace);

// src/components/table/column.tsx
import { jsx as jsx3, jsxs } from "@quick/cssinjs/jsx-runtime";
function handleStatus(status, value, record, index) {
  let statusStr = typeof status === "function" ? status(value, record, index) : status;
  switch (statusStr) {
    case "completed":
      return "link";
    case "invalid":
      return "disabled";
    case "waiting":
      return "warning";
    case "default":
      return null;
    default:
      return statusStr || null;
  }
}
function handleColumn(col, dicts, navigate) {
  let {
    status,
    bold,
    thousand: thousandNum,
    link,
    precision,
    zerofill: fill,
    percent,
    suffix,
    title,
    tooltip,
    dictCode,
    render: renderFunc,
    ...args
  } = col;
  const render = (value, record, index) => {
    const sx = {};
    value = renderFunc?.(value, record, index) ?? value;
    if (dictCode) {
      const dict = dicts[dictCode];
      const item = dict?.find((item2) => item2.value === value);
      if (item) {
        value = item.label;
        status = item.status;
      }
    }
    if (link) {
      link = typeof link === "function" ? link(value, record, index) : link;
      if (link) {
        sx.color = "link";
        sx.cursor = "pointer";
      }
    }
    if (status) sx.color = handleStatus(status, value, record, index);
    if (bold) sx.fontWeight = "bold";
    if (isNumber(value)) {
      if (percent) value = multiply(value, 100);
      if (precision === true) precision = 2;
      if (isNumber(precision)) value = round(value, precision);
      if (fill === true) fill = precision || 0;
      if (isNumber(fill)) value = zerofill(value, fill);
      if (typeof thousandNum === "function" ? thousandNum(value, record, index) : col.thousand) {
        value = thousands(value);
      }
      if (percent) value = `${value}%`;
    }
    return /* @__PURE__ */ jsxs("span", { sx, onClick: link ? () => navigate(link) : void 0, children: [
      value,
      suffix ?? null
    ] });
  };
  const children = col.children;
  return {
    ...args,
    children: children?.map((col2) => handleColumn(col2, dicts, navigate)) ?? void 0,
    title: tooltip ? (...arrs) => /* @__PURE__ */ jsxs("span", { children: [
      typeof title === "function" ? title(...arrs) : title,
      /* @__PURE__ */ jsx3(Tooltip, { title: tooltip, verticalAlign: "middle", ml: 1, cursor: "pointer", children: /* @__PURE__ */ jsx3(QuestionCircleOutlined, {}) })
    ] }) : title,
    render
  };
}
function handleActions(actions, actionFixed, actionTitle, actionWidth) {
  return {
    title: actionTitle || "\u64CD\u4F5C",
    dataIndex: "__actions",
    width: actionWidth,
    fixed: actionFixed ?? "right",
    render: (_, record, index) => /* @__PURE__ */ jsx3(Space, { children: actions.map((action, i) => {
      let { title, visible = true, render, className, type, onClick, ...args } = action;
      const show = typeof visible === "function" ? visible(record, index) : visible;
      if (!show) return null;
      if (typeof render === "function") title = render(record, index);
      if (typeof className === "function") className = className(record, index);
      return /* @__PURE__ */ jsx3(
        Button,
        {
          p: 0,
          type: type ?? "link",
          className,
          onClick: (e) => onClick?.(e, record, index),
          ...args,
          children: title
        },
        i
      );
    }) })
  };
}
function useColumns(columns, actions, actionFixed, actionTitle, actionWidth) {
  const navigate = useNavigate();
  const dicts = useDicts();
  return useMemo2(
    () => columns.map((col) => handleColumn(col, dicts, navigate)).concat(handleActions(actions || [], actionFixed, actionTitle, actionWidth)),
    [columns, actions, dicts, navigate, actionFixed, actionTitle, actionWidth]
  );
}

// src/components/table/summary.tsx
import { useMemo as useMemo3 } from "react";
import { Table } from "antd";
import { isNumber as isNumber2, round as round2, zerofill as zerofill2, thousands as thousands2, multiply as multiply2 } from "@quick/utils";
import { jsx as jsx4, jsxs as jsxs2 } from "@quick/cssinjs/jsx-runtime";
var { Summary } = Table;
function flatten(arr) {
  return arr.reduce((acc, props) => {
    const { children, ...rest } = props;
    acc.push(rest);
    if (Array.isArray(children)) acc.push(...flatten(children));
    return acc;
  }, []);
}
function useSummary(columns, summaryMap, rowSelection) {
  return useMemo3(() => {
    const summaryList = flatten(columns);
    const hasTotal = summaryList.some((item) => item.total);
    return hasTotal ? () => /* @__PURE__ */ jsx4(Summary, { fixed: true, children: /* @__PURE__ */ jsxs2(Summary.Row, { children: [
      rowSelection && /* @__PURE__ */ jsx4(Summary.Cell, { index: 0 }),
      /* @__PURE__ */ jsx4(Summary.Cell, { index: rowSelection ? 1 : 0, children: "\u5408\u8BA1" }),
      summaryList.slice(1).map((item, index) => {
        let defaultSummary = { thousand: true };
        let value = summaryMap?.[item.totalField ?? item.dataIndex];
        if (typeof item.total === "object") {
          defaultSummary = { ...defaultSummary, ...item.total };
        }
        let {
          precision,
          zerofill: fill,
          percent,
          thousand: thousandNum,
          formatter,
          className
        } = defaultSummary;
        if (typeof formatter === "function") {
          value = formatter(value);
        }
        if (isNumber2(value)) {
          if (percent) value = multiply2(Number(value), 100);
          if (precision === true) precision = 2;
          if (isNumber2(precision)) value = round2(value, precision);
          if (fill === true) fill = precision || 0;
          if (isNumber2(fill)) value = zerofill2(value, fill);
          if (thousandNum) value = value ? thousands2(value) : value;
          if (percent) value = `${value}%`;
        }
        className = typeof className === "function" ? className(value) : className;
        return /* @__PURE__ */ jsx4(
          Summary.Cell,
          {
            className: className ?? void 0,
            index: index + 1,
            children: value ?? null
          },
          index + 1
        );
      })
    ] }) }) : void 0;
  }, [columns, summaryMap]);
}

// src/components/table/table.tsx
import { jsx as jsx5 } from "@quick/cssinjs/jsx-runtime";
var StyledTable = styled7(AntdTable);
function defineColumns(columns) {
  return columns;
}
function Table2({
  columns = [],
  actionFixed,
  actionTitle,
  actionWidth,
  actions,
  summaryMap,
  rowSelection,
  rowKey = "id",
  ...props
}) {
  const cols = useColumns(columns, actions, actionFixed, actionTitle, actionWidth);
  const summary = useSummary(cols, summaryMap, rowSelection);
  return /* @__PURE__ */ jsx5(
    StyledTable,
    {
      rowKey,
      columns: cols,
      rowSelection,
      summary,
      ...props
    }
  );
}
export {
  Box,
  Button,
  ConfigProvider,
  Input,
  InputNumber,
  Table2 as Table,
  defaultTheme,
  defineColumns,
  defineDicts,
  defineTheme,
  useDict,
  useDictItem,
  useDictLabel,
  useDictStatus,
  useDicts,
  useTheme
};
//# sourceMappingURL=index.js.map
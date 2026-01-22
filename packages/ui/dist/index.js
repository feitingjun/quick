import { styled, ThemeProvider, useTheme, useClassName } from '@quick/cssinjs';
export { useTheme } from '@quick/cssinjs';
import { createContext, useContext, useMemo, useCallback, useEffect, useState, useActionState, startTransition, cloneElement, isValidElement } from 'react';
import { Button as Button$1, Space as Space$1, Tooltip as Tooltip$1, Form, Input as Input$1, InputNumber as InputNumber$1, DatePicker as DatePicker$1, Table, Dropdown as Dropdown$1, Popover as Popover$1, Checkbox as Checkbox$1, ConfigProvider as ConfigProvider$1, App } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import zhCN from 'antd/locale/zh_CN';
import Bignumber from 'bignumber.js';
import 'dayjs/locale/zh-cn';
import { jsx, jsxs, Fragment } from '@quick/cssinjs/jsx-runtime';
import dayjs2, { isDayjs } from 'dayjs';
import { RedoOutlined, SearchOutlined, ColumnHeightOutlined, SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router';
import 'antd/es/date-picker';
import copy from 'copy-to-clipboard';
import axios from 'axios';

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
var defineTheme = (theme) => theme;
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
function thousands(num) {
  if (!isNumber(num)) return num;
  const arr = String(num).split(".");
  const intPart = arr[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  return arr[1] ? `${intPart}.${arr[1]}` : intPart;
}
function round(num, n = 2) {
  return new Bignumber(num).decimalPlaces(n, Bignumber.ROUND_HALF_UP).toNumber();
}
function zerofill(num, n = 2) {
  const [intPart, decPart = ""] = String(num).split(".");
  if (decPart.length >= n) return num;
  const filledDec = decPart.padEnd(n, "0").slice(0, n);
  return `${intPart}.${filledDec}`;
}
function isNumber(num) {
  const n = new Bignumber(num);
  return n.isFinite() && !n.isNaN();
}
function multiply(a, b) {
  return new Bignumber(a).times(b).toNumber();
}

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
var message;
var useRegisterMessage = () => {
  const { message: messageInstance } = App.useApp();
  message = messageInstance;
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
var Button = styled(Button$1);
var button_default = Button;
var StyledBox = styled("div");
var Box = (props) => /* @__PURE__ */ jsx(StyledBox, { as: props.as, ...props });
var box_default = Box;
var Space = styled(Space$1);
var space_default = Space;
var Tooltip = styled(Tooltip$1);
var tooltip_default = Tooltip;
var StyledItem = styled(Form.Item);
var Item = StyledItem;
Item.useStatus = Form.Item.useStatus;
var item_default = Item;
var ErrorList = styled(Form.ErrorList);
var error_list_default = ErrorList;
var Provider = styled(Form.Provider);
var provider_default = Provider;

// src/components/form/index.tsx
var { useForm, useFormInstance, useWatch } = Form;
var StyledForm = styled(Form);
var Form4 = StyledForm;
Form4.Item = item_default;
Form4.List = Form.List;
Form4.ErrorList = error_list_default;
Form4.Provider = provider_default;
Form4.useForm = useForm;
Form4.useFormInstance = useFormInstance;
Form4.useWatch = useWatch;
var form_default = Form4;
function useQuery() {
  const [query] = useSearchParams();
  return useMemo(
    () => query.entries().reduce((acc, [key, value]) => {
      if (value === "undefined") {
        acc[key] = void 0;
      } else if (value === "null") {
        acc[key] = null;
      } else if (value.length <= 16 && isNumber(value)) {
        acc[key] = Number(value);
      } else if (value.includes(",")) {
        acc[key] = value.split(",").map((item) => isNumber(item) ? Number(item) : item);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {}),
    [query]
  );
}
function useAsyncAction(dispatch) {
  const [_, action, loading] = useActionState(
    (_2, payload) => dispatch(payload),
    void 0
  );
  return [(values) => startTransition(() => action(values)), loading];
}
function Search({
  children,
  okText = "\u67E5\u8BE2",
  resetText = "\u91CD\u7F6E",
  initLoad,
  onSearch,
  onReset,
  colWidth = 280,
  size = "middle",
  form: externalForm,
  initialValues,
  ...props
}) {
  if (Object.values(initialValues ?? {}).some(
    (item) => Array.isArray(item) ? item.some((i) => isDayjs(i)) : isDayjs(item)
  )) {
    throw new Error("Search \u4E0D\u63A5\u6536 dayjs \u7C7B\u578B\u7684\u521D\u59CB\u503C\uFF0C\u8BF7\u4F7F\u7528\u5B57\u7B26\u4E32\u683C\u5F0F\u5316\u65E5\u671F");
  }
  const [form] = form_default.useForm(externalForm);
  const query = useQuery();
  const theme = useTheme();
  const height = useMemo(() => {
    if (size === "small") {
      return theme.sizes.controlHeightSm;
    }
    if (size === "large") {
      return theme.sizes.controlHeightLg;
    }
    return theme.sizes.controlHeight;
  }, [theme, size]);
  const [onFinish, loading] = useAsyncAction(async (values) => {
    if (typeof onSearch === "function") {
      onSearch(values);
    }
  });
  const onClear = useCallback(async () => {
    form.resetFields();
    if (typeof onReset === "function") {
      await onReset();
    }
    form.submit();
  }, [form, onReset]);
  useEffect(() => {
    form.setFieldsValue(query);
    if (initLoad) {
      form.submit();
    }
  }, [query, form, initLoad]);
  const btns = useMemo(() => {
    return /* @__PURE__ */ jsxs(
      box_default,
      {
        sx: {
          position: "absolute",
          right: 4 * theme.space,
          bottom: 4 * theme.space,
          w: colWidth / 2,
          display: "flex",
          justifyContent: "space-between",
          ".ant-btn": {
            px: 2.5,
            gap: 1
          }
        },
        children: [
          /* @__PURE__ */ jsx(button_default, { mr: 2, onClick: onClear, icon: /* @__PURE__ */ jsx(RedoOutlined, {}), children: resetText }),
          /* @__PURE__ */ jsx(button_default, { type: "primary", htmlType: "submit", loading, icon: /* @__PURE__ */ jsx(SearchOutlined, {}), children: okText })
        ]
      }
    );
  }, [loading, onClear, okText, resetText, theme, colWidth]);
  return /* @__PURE__ */ jsx(
    form_default,
    {
      layout: "inline",
      size,
      form,
      onFinish,
      initialValues,
      preserve: true,
      sx: {
        bg: "bg",
        mb: 2,
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${colWidth / 2}px, 1fr))`,
        p: 4,
        gap: 2.5,
        position: "relative",
        _after: {
          content: '""',
          height,
          gridColumn: "span 1"
        },
        "& > *": {
          gridColumn: "span 2",
          mr: 0
        },
        ".ant-row": {
          flexWrap: "nowrap"
        },
        ".ant-input-number, .ant-input-select, .ant-picker": {
          w: 1
        }
      },
      ...props,
      children: typeof children === "function" ? ((values, form2) => {
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          children(values, form2),
          btns
        ] });
      }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        children,
        btns
      ] })
    }
  );
}
var isDate = (value, format) => {
  if (!value) return false;
  if (isNumber(value)) {
    return dayjs2(value, format).isValid();
  }
  return dayjs2(value).isValid();
};
var parseDate = (value, format) => {
  if (!value) return value;
  if (Array.isArray(value)) {
    return value.map((v) => v && isDate(v, format) ? dayjs2(v) : v);
  }
  return isDate(value, format) ? dayjs2(value) : value;
};
var formatDate = (value, format) => {
  if (!value) return value;
  if (Array.isArray(value)) {
    return value.map((v) => isDayjs(v) ? v.format(format) : v);
  }
  return isDayjs(value) ? value.format(format) : value;
};
var getFormat = (format, child) => {
  if (format) return format;
  if (child?.props?.showTime) return "YYYY-MM-DD HH:mm:ss";
  return "YYYY-MM-DD";
};
function Item2({
  span = 1,
  name,
  names,
  format,
  initialValue,
  children,
  ...props
}) {
  if (Array.isArray(initialValue) ? initialValue.some((i) => isDayjs(i)) : isDayjs(initialValue)) {
    throw new Error("Search.Item \u4E0D\u63A5\u6536 dayjs \u7C7B\u578B\u7684\u521D\u59CB\u503C\uFF0C\u8BF7\u4F7F\u7528\u5B57\u7B26\u4E32\u683C\u5F0F\u5316\u65E5\u671F");
  }
  if (names) {
    return /* @__PURE__ */ jsxs(form_default.Item, { style: { gridColumn: `span ${span * 2}` }, ...props, children: [
      names.map((v, i) => /* @__PURE__ */ jsx(form_default.Item, { name: v, hidden: true, noStyle: true, initialValue: initialValue?.[i] }, v)),
      /* @__PURE__ */ jsx(
        form_default.Item,
        {
          noStyle: true,
          shouldUpdate: (preVal, nextVal) => {
            return names.some((n) => preVal[n] !== nextVal[n]);
          },
          children: (props2) => {
            const values = props2.getFieldsValue(names);
            const child = typeof children === "function" ? children(props2) : children;
            return isValidElement(child) ? cloneElement(child, {
              value: names.map((n) => parseDate(values[n], getFormat(format, child))),
              onChange: (originalValue) => {
                const value = formatDate(originalValue, getFormat(format, child));
                props2.setFieldsValue(
                  names.reduce((acc, n, i) => ({ ...acc, [n]: value?.[i] }), {})
                );
              }
            }) : child;
          }
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsx(
    form_default.Item,
    {
      name,
      initialValue,
      ...props,
      getValueFromEvent: (e) => {
        const value = e?.currentTarget?.value ?? e?.target?.value ?? e;
        return formatDate(value, getFormat(format, children));
      },
      getValueProps: (value) => ({
        value: parseDate(value, getFormat(format, children))
      }),
      children
    }
  );
}

// src/components/search/index.tsx
var Search2 = Search;
Search2.Item = Item2;
var search_default = Search2;
var Input = styled(Input$1);
var input_default = Input;
var InputNumber = styled(InputNumber$1);
var input_number_default = InputNumber;
var { RangePicker: AntdRangePicker } = DatePicker$1;
var StyledRangePicker = styled(AntdRangePicker);
var usePresets = (showTime, allowEmpty) => {
  const presets = useMemo(() => {
    const arr = showTime ? [
      { label: "\u4ECA\u65E5", value: [dayjs2().startOf("day"), dayjs2().add(1, "day").startOf("day")] },
      {
        label: "\u6628\u65E5",
        value: [dayjs2().subtract(1, "day").startOf("day"), dayjs2().startOf("day")]
      },
      {
        label: "\u672C\u5468",
        value: [dayjs2().startOf("week"), dayjs2().add(1, "week").startOf("week")]
      },
      {
        label: "\u4E0A\u5468",
        value: [dayjs2().subtract(1, "week").startOf("week"), dayjs2().startOf("week")]
      },
      {
        label: "\u672C\u6708",
        value: [dayjs2().startOf("month"), dayjs2().add(1, "month").startOf("month")]
      },
      {
        label: "\u4E0A\u6708",
        value: [dayjs2().subtract(1, "month").startOf("month"), dayjs2().startOf("month")]
      },
      {
        label: "\u8FD145\u5929",
        value: [dayjs2().subtract(45, "day"), dayjs2().add(1, "day").startOf("day")]
      },
      {
        label: "\u4ECA\u5E74",
        value: [dayjs2().startOf("year"), dayjs2().add(1, "year").startOf("year")]
      },
      {
        label: "\u8FD15\u5E74",
        value: [dayjs2().subtract(5, "year"), dayjs2().add(1, "year").startOf("year")]
      }
    ] : [
      { label: "\u4ECA\u65E5", value: [dayjs2(), dayjs2()] },
      { label: "\u6628\u65E5", value: [dayjs2().subtract(1, "day"), dayjs2().subtract(1, "day")] },
      { label: "\u672C\u5468", value: [dayjs2().startOf("week"), dayjs2().endOf("week")] },
      {
        label: "\u4E0A\u5468",
        value: [
          dayjs2().subtract(1, "week").startOf("week"),
          dayjs2().subtract(1, "week").endOf("week")
        ]
      },
      { label: "\u672C\u6708", value: [dayjs2().startOf("month"), dayjs2().endOf("month")] },
      {
        label: "\u4E0A\u6708",
        value: [
          dayjs2().subtract(1, "month").startOf("month"),
          dayjs2().subtract(1, "month").endOf("month")
        ]
      },
      { label: "\u8FD145\u5929", value: [dayjs2().subtract(45, "day"), dayjs2()] },
      { label: "\u4ECA\u5E74", value: [dayjs2().startOf("year"), dayjs2().endOf("year")] },
      { label: "\u8FD15\u5E74", value: [dayjs2().subtract(5, "year"), dayjs2()] }
    ];
    if (allowEmpty === true || Array.isArray(allowEmpty) && allowEmpty[0]) {
      arr.push({
        label: "\u622A\u6B62\u6628\u65E5",
        value: [null, showTime ? dayjs2().startOf("day") : dayjs2().subtract(1, "day")]
      });
    }
    return arr;
  }, [showTime, allowEmpty]);
  return presets;
};
function RangePicker({
  showTime,
  allowEmpty = [true, true],
  ...props
}) {
  const presets = usePresets(showTime, allowEmpty);
  const popupRootCls = useClassName({
    ".ant-picker-panel-layout": {
      minHeight: 330
    }
  });
  return /* @__PURE__ */ jsx(
    StyledRangePicker,
    {
      presets,
      showTime,
      allowEmpty,
      classNames: {
        popup: {
          root: popupRootCls
        }
      },
      ...props
    }
  );
}

// src/components/date-picker/index.tsx
var DatePicker = styled(DatePicker$1);
var date_picker_default = DatePicker;
var copyText = (e) => {
  const selection = window.getSelection();
  selection?.removeAllRanges();
  const range = document.createRange();
  range.selectNodeContents(e.currentTarget);
  selection?.addRange(range);
  const text = e.currentTarget?.innerText;
  if (text && copy(text)) {
    message.success("\u6587\u672C\u5DF2\u590D\u5236");
  }
};
var handleStatus = (status, value, record, index) => {
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
};
var handleColumn = (col, dicts, navigate) => {
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
    onCell: onCellFunc,
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
      /* @__PURE__ */ jsx(tooltip_default, { title: tooltip, children: /* @__PURE__ */ jsx(QuestionCircleOutlined, { sx: { ml: 1, cursor: "pointer" } }) })
    ] }) : title,
    render,
    onCell: (record, index) => ({
      onDoubleClick: copyText,
      ...onCellFunc ? onCellFunc(record, index) : {}
    })
  };
};
var handleActions = (actions, actionFixed, actionTitle, actionWidth) => {
  if (!actions || actions.length === 0) return null;
  return {
    title: actionTitle || "\u64CD\u4F5C",
    dataIndex: "__actions",
    width: actionWidth,
    fixed: actionFixed ?? "right",
    render: (_, record, index) => /* @__PURE__ */ jsx(space_default, { children: actions.map((action, i) => {
      let { title, visible = true, render, className, type, onClick, ...args } = action;
      const show = typeof visible === "function" ? visible(record, index) : visible;
      if (!show) return null;
      if (typeof render === "function") title = render(record, index);
      if (typeof className === "function") className = className(record, index);
      return /* @__PURE__ */ jsx(
        button_default,
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
};
var useColumns = (columns, actions, actionFixed, actionTitle, actionWidth) => {
  const navigate = useNavigate();
  const dicts = useDicts();
  return useMemo(
    () => columns.map((col) => handleColumn(col, dicts, navigate)).concat(handleActions(actions || [], actionFixed, actionTitle, actionWidth) ?? []),
    [columns, actions, dicts, navigate, actionFixed, actionTitle, actionWidth]
  );
};
var { Summary } = Table;
var flatten = (arr) => {
  return arr.reduce((acc, props) => {
    const { children, ...rest } = props;
    acc.push(rest);
    if (Array.isArray(children)) acc.push(...flatten(children));
    return acc;
  }, []);
};
var useSummary = (columns, summaryMap, rowSelection) => {
  return useMemo(() => {
    const summaryList = flatten(columns);
    const hasTotal = summaryList.some((item) => item.total);
    return hasTotal ? () => /* @__PURE__ */ jsx(Summary, { fixed: true, children: /* @__PURE__ */ jsxs(Summary.Row, { children: [
      rowSelection && /* @__PURE__ */ jsx(Summary.Cell, { index: 0 }),
      /* @__PURE__ */ jsx(Summary.Cell, { index: rowSelection ? 1 : 0, children: "\u5408\u8BA1" }),
      summaryList.slice(1).map((item, index) => {
        let sx = {};
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
          className,
          status
        } = defaultSummary;
        if (typeof formatter === "function") {
          value = formatter(value);
        }
        if (isNumber(value)) {
          if (percent) value = multiply(Number(value), 100);
          if (precision === true) precision = 2;
          if (isNumber(precision)) value = round(value, precision);
          if (fill === true) fill = precision || 0;
          if (isNumber(fill)) value = zerofill(value, fill);
          if (thousandNum) value = value ? thousands(value) : value;
          if (percent) value = `${value}%`;
        }
        className = typeof className === "function" ? className(value) : className;
        if (status) {
          const statusColor = typeof status === "function" ? status(value) : status;
          sx.color = statusColor === "default" ? null : statusColor;
        }
        return /* @__PURE__ */ jsx(
          Summary.Cell,
          {
            className: className ?? void 0,
            index: index + 1,
            sx,
            children: value ?? null
          },
          index + 1
        );
      })
    ] }) }) : void 0;
  }, [columns, summaryMap]);
};
var StyledTable = styled(Table);
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
  return /* @__PURE__ */ jsx(
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

// src/components/table/index.tsx
function defineColumns(columns) {
  return columns;
}
var table_default = Table2;
var CustomError = class {
  name;
  message;
  code = "ERR_CUSTOM";
  data;
  config;
  constructor(message2, data, config) {
    this.name = "CustomError";
    this.message = message2;
    this.data = data;
    this.config = config;
  }
};
axios.defaults.validateStatus = (status) => {
  return status >= 200 && status < 300;
};
axios.defaults.responseType = "json";
axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMsg = error.message || "\u672A\u77E5\u9519\u8BEF";
    let data = null;
    if (axios.isAxiosError(error)) {
      errorMsg = error.message;
      data = error.response?.data;
    }
    if (error instanceof CustomError) {
      errorMsg = error.message;
      data = error.data;
    }
    if (!error?.config?.skipErrorHandler) {
      message.error(errorMsg);
    }
    return data;
  }
);
var request = {
  _internalResponseHandler: void 0,
  /**初始化配置 */
  init(config) {
    axios.defaults.baseURL = config.baseURL;
    Object.entries(config.headers ?? {}).forEach(([key, value]) => {
      axios.defaults.headers.common[key] = value;
    });
    axios.defaults.timeout = config.timeout;
    axios.defaults.responseType = config.responseType ?? "json";
    this._internalResponseHandler = config?.internalResponseHandler;
    axios.defaults.transformResponse = [
      ...Array.isArray(axios.defaults.transformResponse) ? axios.defaults.transformResponse : axios.defaults.transformResponse ? [axios.defaults.transformResponse] : [],
      function(data) {
        const error = config.responseError?.(data);
        if (error) {
          throw new CustomError(error, data, this);
        }
        return data;
      }
    ];
  },
  request: (config) => axios.request(config),
  get: (url, config) => axios.get(url, config),
  post: (url, data, config) => axios.post(url, data, config),
  put: (url, data, config) => axios.put(url, data, config),
  delete: (url, config) => axios.delete(url, config),
  patch: (url, data, config) => axios.patch(url, data, config),
  all: axios.all,
  spread: axios.spread
};
var request_default = request;
function Actions({ actions, size }) {
  return /* @__PURE__ */ jsx(box_default, { children: actions?.map(({ title, ...props }, i) => {
    return /* @__PURE__ */ jsx(button_default, { size, ...props, children: title }, i);
  }) });
}
var Dropdown = styled(Dropdown$1);
var dropdown_default = Dropdown;
var Popover = styled(Popover$1);
var popover_default = Popover;
var { Group: AntdCheckboxGroup } = Checkbox$1;
var StyledCheckbox = styled(Checkbox$1);
var StyledGroup = styled(AntdCheckboxGroup);
var Checkbox = StyledCheckbox;
Checkbox.Group = StyledGroup;
var checkbox_default = Checkbox;
var CheckboxGroup = checkbox_default.Group;
var sizeItem = [
  { key: "large", label: "\u5BBD\u677E" },
  { key: "middle", label: "\u4E2D\u7B49" },
  { key: "small", label: "\u7D27\u51D1" }
];
var Content = ({
  columns,
  visibleKeys,
  defaultVisibleKeys,
  setVisibleKeys
}) => {
  const options = useMemo(() => {
    return columns?.map((col) => col.title) ?? [];
  }, [columns]);
  const checkAll = useCallback(
    (e) => {
      if (e.target.checked) {
        setVisibleKeys(options);
      } else {
        setVisibleKeys([]);
      }
    },
    [options]
  );
  return /* @__PURE__ */ jsxs(box_default, { children: [
    /* @__PURE__ */ jsxs(
      box_default,
      {
        sx: {
          pb: 2,
          mb: 2,
          minW: 120,
          display: "flex",
          justifyContent: "space-between"
        },
        children: [
          /* @__PURE__ */ jsx(
            checkbox_default,
            {
              onChange: checkAll,
              checked: visibleKeys.length === options.length,
              indeterminate: visibleKeys.length > 0 && visibleKeys.length < options.length,
              children: "\u5168\u9009"
            }
          ),
          /* @__PURE__ */ jsx(
            box_default,
            {
              as: "span",
              color: "primary",
              cursor: "pointer",
              onClick: () => setVisibleKeys(defaultVisibleKeys),
              children: "\u91CD\u7F6E"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      CheckboxGroup,
      {
        options,
        value: visibleKeys,
        onChange: (e) => setVisibleKeys(e),
        sx: {
          display: "flex",
          flexDirection: "column",
          gap: 1
        }
      }
    )
  ] });
};
function Tool({
  size = "middle",
  visibleKeys,
  defaultVisibleKeys,
  setVisibleKeys,
  setSize,
  columns,
  ...props
}) {
  return /* @__PURE__ */ jsxs(space_default, { size, ...props, children: [
    /* @__PURE__ */ jsx(tooltip_default, { title: "\u5BC6\u5EA6", children: /* @__PURE__ */ jsx(
      dropdown_default,
      {
        trigger: ["click"],
        placement: "bottomRight",
        menu: {
          items: sizeItem,
          selectedKeys: [size],
          onClick: ({ key }) => setSize?.(key)
        },
        children: /* @__PURE__ */ jsx(ColumnHeightOutlined, {})
      }
    ) }),
    /* @__PURE__ */ jsx(tooltip_default, { title: "\u5C55\u793A\u5217", children: /* @__PURE__ */ jsx(
      popover_default,
      {
        arrow: false,
        trigger: "click",
        placement: "bottomRight",
        content: /* @__PURE__ */ jsx(
          Content,
          {
            columns,
            visibleKeys,
            defaultVisibleKeys,
            setVisibleKeys
          }
        ),
        children: /* @__PURE__ */ jsx(SettingOutlined, {})
      }
    ) })
  ] });
}
function Page({
  okText,
  resetText,
  initLoad,
  url,
  method = "get",
  paramsLocation,
  params,
  onRequestComplete,
  onSearch: onSearchPage,
  onReset: onResetPage,
  dataSource: propsDataSource,
  colWidth,
  children,
  initialValues,
  form,
  size: defaultSize,
  actions,
  showTool = true,
  columns,
  ...props
}) {
  paramsLocation = paramsLocation ?? (method === "get" ? "query" : "body");
  const [dataSource, setDataSource] = useState([]);
  const defaultVisibleKeys = useMemo(() => {
    return columns?.filter((col) => !col.hidden).map((col) => col.title) ?? [];
  }, [columns]);
  const [size, setSize] = useState(defaultSize);
  const [visibleKeys, setVisibleKeys] = useState(defaultVisibleKeys);
  const [onSearch, loading] = useAsyncAction(async (values) => {
    const vals = await onSearchPage?.(values);
    if (!url) return;
    const config = {};
    if (paramsLocation === "query") {
      Object.assign(config, { params: { ...params ?? {}, ...vals ?? {} } });
    } else {
      Object.assign(config, { data: { ...params ?? {}, ...vals ?? {} } });
    }
    let res = await request_default.request({
      url,
      method,
      ...config
    });
    if (request_default._internalResponseHandler?.all) {
      res = await request_default._internalResponseHandler.all(res);
    }
    if (request_default._internalResponseHandler?.page) {
      res = await request_default._internalResponseHandler.page(res);
    }
    if (typeof onRequestComplete === "function") {
      res = await onRequestComplete(res);
    }
    setDataSource(res?.dataSource ?? []);
  });
  const onReset = useCallback(async () => {
    await onResetPage?.();
  }, [onResetPage]);
  const tableColumns = useMemo(() => {
    return columns?.filter((col) => visibleKeys.includes(col.title))?.map((col) => ({ ...col, hidden: false }));
  }, [columns, visibleKeys]);
  const [pageActions, tableActions] = useMemo(() => {
    return actions?.reduce(
      (acc, action) => {
        if (action.display === "table") {
          acc[1].push(action);
        } else {
          acc[0].push(action);
        }
        return acc;
      },
      [[], []]
    ) ?? [[], []];
  }, [actions]);
  return /* @__PURE__ */ jsxs(
    box_default,
    {
      sx: {
        w: 1
      },
      children: [
        children && /* @__PURE__ */ jsx(
          search_default,
          {
            form,
            initLoad,
            initialValues,
            okText,
            resetText,
            colWidth,
            size,
            onSearch,
            onReset,
            children
          }
        ),
        /* @__PURE__ */ jsxs(box_default, { bg: "bg", children: [
          (showTool || pageActions.length > 0) && /* @__PURE__ */ jsxs(box_default, { px: 2, py: 2, fontSize: "subtitle", display: "flex", justifyContent: "space-between", children: [
            /* @__PURE__ */ jsx(Actions, { actions: pageActions, size }),
            showTool && /* @__PURE__ */ jsx(
              Tool,
              {
                size,
                columns,
                setSize,
                visibleKeys,
                defaultVisibleKeys,
                setVisibleKeys
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            table_default,
            {
              dataSource: propsDataSource || dataSource,
              columns: tableColumns,
              actions: tableActions,
              loading,
              size,
              ...props
            }
          )
        ] })
      ]
    }
  );
}

export { box_default as Box, button_default as Button, checkbox_default as Checkbox, ConfigProvider, date_picker_default as DatePicker, dropdown_default as Dropdown, form_default as Form, input_default as Input, input_number_default as InputNumber, Page, popover_default as Popover, RangePicker, Register, search_default as Search, space_default as Space, table_default as Table, tooltip_default as Tooltip, defaultTheme, defineColumns, defineDicts, defineTheme, message, request_default as request, useDict, useDictItem, useDictLabel, useDictStatus, useDicts };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
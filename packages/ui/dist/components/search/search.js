import dayjs2, { isDayjs } from 'dayjs';
import { createContext, useCallback, useEffect, useMemo, isValidElement, cloneElement, useActionState, startTransition } from 'react';
import { createStyles } from 'antd-style';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { DatePicker, Table, Checkbox, Form, Button } from 'antd';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import Bignumber from 'bignumber.js';
import 'copy-to-clipboard';
import { useSearchParams } from 'react-router';
import axios from 'axios';

// src/components/search/search.tsx
var button_default = Button;
var { RangePicker: AntdRangePicker } = DatePicker;
createStyles({
  container: {
    [`& .ant-picker-presets`]: {
      minHeight: "330px"
    }
  }
});
var message;
function isNumber(num) {
  const n = new Bignumber(num);
  return n.isFinite() && !n.isNaN();
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
function Item({
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
    return /* @__PURE__ */ jsxs(Form.Item, { style: { gridColumn: `span ${span * 2}` }, ...props, children: [
      names.map((v, i) => /* @__PURE__ */ jsx(Form.Item, { name: v, hidden: true, noStyle: true, initialValue: initialValue?.[i] }, v)),
      /* @__PURE__ */ jsx(
        Form.Item,
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
    Form.Item,
    {
      name,
      initialValue,
      style: { gridColumn: `span ${span}` },
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
Search2.Item = Item;
function useQuery() {
  const [query] = useSearchParams();
  return useMemo(
    () => Array.from(query.entries()).reduce(
      (acc, [key, value]) => {
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
      },
      {}
    ),
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
createContext({
  dicts: {}
});
createStyles(({ token }) => ({
  link: {
    color: token.colorLink
  },
  pointer: {
    cursor: "pointer"
  },
  bold: {
    fontWeight: "bold"
  },
  question: {
    marginLeft: token.sizeUnit,
    cursor: "pointer"
  },
  actionBtn: {
    padding: 0
  },
  success: {
    color: token.colorSuccess
  },
  error: {
    color: token.colorError
  },
  warning: {
    color: token.colorWarning
  },
  disabled: {
    color: token.colorTextDisabled
  }
}));
var { Summary } = Table;
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
({
  all: axios.all,
  spread: axios.spread
});
Checkbox.Group;
createStyles(({ token }) => ({
  all: {
    paddingBottom: token.sizeUnit * 2,
    marginBottom: token.sizeUnit * 2,
    minWidth: 100,
    display: "flex",
    justifyContent: "space-between"
  },
  reset: {
    color: token.colorPrimary,
    cursor: "pointer"
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: token.sizeUnit
  }
}));
createStyles(({ token }) => ({
  root: {
    width: "100%"
  },
  btns: {
    display: "flex",
    justifyContent: "space-between",
    padding: token.sizeUnit * 2,
    fontSize: token.fontSizeLG
  },
  tool: {
    backgroundColor: token.colorBgContainer
  }
}));
var useStyles5 = createStyles(
  ({ token }, { colWidth, size }) => {
    let controlHeight = token.controlHeight;
    if (size === "small") controlHeight = token.controlHeightSM;
    if (size === "large") controlHeight = token.controlHeightLG;
    return {
      btns: {
        position: "absolute",
        right: token.sizeUnit * 4,
        bottom: token.sizeUnit * 4,
        display: "flex",
        justifyContent: "space-between",
        "& .ant-btn": {
          paddingInline: token.sizeUnit * 2,
          gap: token.sizeUnit,
          "&:first-of-type": {
            marginRight: token.sizeUnit * 2
          }
        }
      },
      form: {
        backgroundColor: token.colorBgContainer,
        marginBottom: token.sizeUnit * 2,
        padding: token.sizeUnit * 4,
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${colWidth}px, 1fr))`,
        gap: token.sizeUnit * 2.5,
        position: "relative",
        "&:after": {
          width: colWidth,
          content: '""',
          height: controlHeight
        },
        "&>*": {
          marginRight: 0
        },
        "& .ant-row": {
          flexWrap: "nowrap"
        },
        "& .ant-form-item-label": {
          flexShrink: 0
        },
        "& .ant-input-number, & .ant-input-select, & .ant-picker": {
          width: "100%"
        }
      }
    };
  }
);
function Search({
  children,
  okText = "\u67E5\u8BE2",
  resetText = "\u91CD\u7F6E",
  initLoad,
  onSearch,
  onReset,
  colWidth = 240,
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
  const { styles } = useStyles5({ colWidth, size });
  const [form] = Form.useForm(externalForm);
  const query = useQuery();
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
    return /* @__PURE__ */ jsxs("div", { className: styles.btns, children: [
      /* @__PURE__ */ jsx(button_default, { onClick: onClear, icon: /* @__PURE__ */ jsx(RedoOutlined, {}), children: resetText }),
      /* @__PURE__ */ jsx(button_default, { type: "primary", htmlType: "submit", loading, icon: /* @__PURE__ */ jsx(SearchOutlined, {}), children: okText })
    ] });
  }, [loading, onClear, okText, resetText, colWidth]);
  return /* @__PURE__ */ jsx(
    Form,
    {
      layout: "inline",
      size,
      form,
      onFinish,
      initialValues,
      preserve: true,
      className: styles.form,
      ...props,
      children: /* @__PURE__ */ jsxs(Fragment, { children: [
        children,
        btns
      ] })
    }
  );
}

export { Search as default };

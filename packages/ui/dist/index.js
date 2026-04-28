import { createContext, forwardRef, useContext, useMemo, useState, useCallback, useEffectEvent, useLayoutEffect, useImperativeHandle, useEffect, useRef, isValidElement, cloneElement } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
export { useLocation, useNavigate, useOutlet, useParams, useSearchParams } from 'react-router';
import Bignumber from 'bignumber.js';
import { DatePicker, Table, Checkbox, Button, Form, Space, Tooltip, Dropdown, Popover, ConfigProvider as ConfigProvider$1, App } from 'antd';
export { Checkbox, Dropdown, Form, Input, InputNumber, Popover, Space, Tooltip } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import zhCN from 'antd/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { createStyles } from 'antd-style';
import dayjs, { isDayjs } from 'dayjs';
import { RedoOutlined, SearchOutlined, ColumnHeightOutlined, SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import axios, { AxiosError } from 'axios';

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
  if (!num) return num;
  return String(num).replace(/\d+(\.\d+)?/g, (s) => {
    const arr = s.split(".");
    const intPart = arr[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    return arr[1] ? `${intPart}.${arr[1]}` : intPart;
  });
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

// src/hooks/use-query.ts
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
function useAsyncReducer(action, initialState, initialPayload) {
  const [state, setState] = useState(initialState);
  const [isPending, setIsPending] = useState(false);
  const lastPromise = useRef(null);
  const createSerialTask = useCallback(
    (payload) => {
      if (!lastPromise.current) {
        lastPromise.current = action(state, payload);
        return lastPromise.current;
      }
      lastPromise.current = lastPromise.current.then((prev) => {
        return action(prev, payload).catch((e) => {
          setState(prev);
          return Promise.reject(e);
        });
      });
      return lastPromise.current;
    },
    [state, setState, action]
  );
  const dispatch = useCallback(
    async (payload) => {
      setIsPending(true);
      const task = createSerialTask(payload);
      task.then((s) => {
        if (task === lastPromise.current) {
          setState(s);
        }
      }).finally(() => {
        if (task === lastPromise.current) {
          lastPromise.current = null;
          setIsPending(false);
        }
      });
      return task;
    },
    [createSerialTask, setState, setIsPending]
  );
  const immediate = useEffectEvent(() => {
    if (arguments.length >= 3) {
      dispatch(initialPayload);
    }
  });
  useLayoutEffect(immediate, []);
  return [state, dispatch, isPending];
}
var use_async_reducer_default = useAsyncReducer;
function useAsyncState(action, initialState, initialPayload) {
  const [state, setState] = useState(initialState);
  const [isPending, setIsPending] = useState(false);
  const callId = useRef(0);
  const tasks = useRef(/* @__PURE__ */ new Map());
  const reset = useCallback(() => {
    setIsPending(false);
    callId.current = 0;
    tasks.current.clear();
  }, [setIsPending]);
  const lastSuccess = useCallback(
    (taskId) => {
      const task = tasks.current.get(taskId);
      return task?.catch(() => lastSuccess(taskId - 1));
    },
    [setState, reset]
  );
  const dispatch = useCallback(
    async (payload) => {
      setIsPending(true);
      const taskId = ++callId.current;
      const task = action(payload);
      tasks.current.set(taskId, task);
      task.finally(() => {
        if (taskId === callId.current) {
          const success = lastSuccess(taskId);
          success.then((s) => {
            if (taskId === callId.current) {
              setState(s);
            }
          }).finally(() => {
            if (taskId === callId.current) {
              reset();
            }
          });
        }
      });
      return task;
    },
    [action, setState, reset, lastSuccess]
  );
  const immediate = useEffectEvent(() => {
    if (arguments.length >= 3) {
      dispatch(initialPayload);
    }
  });
  useLayoutEffect(immediate, []);
  return [state, dispatch, isPending];
}
var use_async_state_default = useAsyncState;
function useAsync(action, initialPayload) {
  const [isPending, setIsPending] = useState(false);
  const tasks = useRef(0);
  const dispatch = useCallback(
    async (payload) => {
      setIsPending(true);
      const task = action(payload);
      tasks.current++;
      task.finally(() => {
        tasks.current--;
        if (tasks.current <= 0) {
          setIsPending(false);
        }
      });
      return task;
    },
    [action, setIsPending]
  );
  const immediate = useEffectEvent(() => {
    if (arguments.length >= 2) {
      dispatch(initialPayload);
    }
  });
  useLayoutEffect(immediate, []);
  return [dispatch, isPending];
}
var use_async_default = useAsync;
var message;
var modal;
var notification;
var useRegisterStatic = () => {
  const { message: messageInstance, modal: modalInstance, notification: notificationInstance } = App.useApp();
  message = messageInstance;
  modal = modalInstance;
  notification = notificationInstance;
  return null;
};
function Register({ children }) {
  useRegisterStatic();
  return children;
}
function ConfigProvider({
  token = {},
  dicts = {},
  children,
  layer,
  locale = zhCN,
  httpRequest,
  transformResponse,
  transformRequest,
  sortFieldName = "sort",
  orderFieldName = "order",
  requestMethod = "get"
}) {
  const mergedToken = useMemo(() => merge(defaultTheme, token), [token]);
  return /* @__PURE__ */ jsx(StyleProvider, { layer, children: /* @__PURE__ */ jsx(ConfigProvider$1, { theme: { token: mergedToken }, locale, children: /* @__PURE__ */ jsx(
    ConfigContext.Provider,
    {
      value: {
        dicts,
        httpRequest,
        transformResponse,
        transformRequest,
        requestMethod,
        sortFieldName,
        orderFieldName
      },
      children: /* @__PURE__ */ jsx(App, { children: /* @__PURE__ */ jsx(Register, { children }) })
    }
  ) }) });
}
var button_default = Button;
var { RangePicker: AntdRangePicker } = DatePicker;
var usePresets = (showTime, allowEmpty) => {
  const presets = useMemo(() => {
    const arr = showTime ? [
      { label: "\u4ECA\u65E5", value: [dayjs().startOf("day"), dayjs().add(1, "day").startOf("day")] },
      {
        label: "\u6628\u65E5",
        value: [dayjs().subtract(1, "day").startOf("day"), dayjs().startOf("day")]
      },
      {
        label: "\u672C\u5468",
        value: [dayjs().startOf("week"), dayjs().add(1, "week").startOf("week")]
      },
      {
        label: "\u4E0A\u5468",
        value: [dayjs().subtract(1, "week").startOf("week"), dayjs().startOf("week")]
      },
      {
        label: "\u672C\u6708",
        value: [dayjs().startOf("month"), dayjs().add(1, "month").startOf("month")]
      },
      {
        label: "\u4E0A\u6708",
        value: [dayjs().subtract(1, "month").startOf("month"), dayjs().startOf("month")]
      },
      {
        label: "\u8FD145\u5929",
        value: [dayjs().subtract(45, "day"), dayjs().add(1, "day").startOf("day")]
      },
      {
        label: "\u4ECA\u5E74",
        value: [dayjs().startOf("year"), dayjs().add(1, "year").startOf("year")]
      },
      {
        label: "\u8FD15\u5E74",
        value: [dayjs().subtract(5, "year"), dayjs().add(1, "year").startOf("year")]
      }
    ] : [
      { label: "\u4ECA\u65E5", value: [dayjs(), dayjs()] },
      { label: "\u6628\u65E5", value: [dayjs().subtract(1, "day"), dayjs().subtract(1, "day")] },
      { label: "\u672C\u5468", value: [dayjs().startOf("week"), dayjs().endOf("week")] },
      {
        label: "\u4E0A\u5468",
        value: [dayjs().subtract(1, "week").startOf("week"), dayjs().subtract(1, "week").endOf("week")]
      },
      { label: "\u672C\u6708", value: [dayjs().startOf("month"), dayjs().endOf("month")] },
      {
        label: "\u4E0A\u6708",
        value: [
          dayjs().subtract(1, "month").startOf("month"),
          dayjs().subtract(1, "month").endOf("month")
        ]
      },
      { label: "\u8FD145\u5929", value: [dayjs().subtract(45, "day"), dayjs()] },
      { label: "\u4ECA\u5E74", value: [dayjs().startOf("year"), dayjs().endOf("year")] },
      { label: "\u8FD15\u5E74", value: [dayjs().subtract(5, "year"), dayjs()] }
    ];
    if (allowEmpty === true || Array.isArray(allowEmpty) && allowEmpty[0]) {
      arr.push({
        label: "\u622A\u6B62\u6628\u65E5",
        value: [null, showTime ? dayjs().startOf("day") : dayjs().subtract(1, "day")]
      });
    }
    return arr;
  }, [showTime, allowEmpty]);
  return presets;
};
var useStyles = createStyles({
  container: {
    [`& .ant-picker-presets`]: {
      minHeight: "330px"
    }
  }
});
function RangePicker({ showTime, allowEmpty = [true, true], ...props }) {
  const presets = usePresets(showTime, allowEmpty);
  const { styles } = useStyles();
  return /* @__PURE__ */ jsx(
    AntdRangePicker,
    {
      presets,
      showTime,
      allowEmpty,
      classNames: {
        popup: {
          container: styles.container
        }
      },
      ...props
    }
  );
}

// src/components/date-picker/index.tsx
var date_picker_default = DatePicker;
var useStyles2 = createStyles(
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
  loading: propLoading,
  ...props
}) {
  if (Object.values(initialValues ?? {}).some(
    (item) => Array.isArray(item) ? item.some((i) => isDayjs(i)) : isDayjs(item)
  )) {
    throw new Error("Search \u4E0D\u63A5\u6536 dayjs \u7C7B\u578B\u7684\u521D\u59CB\u503C\uFF0C\u8BF7\u4F7F\u7528\u5B57\u7B26\u4E32\u683C\u5F0F\u5316\u65E5\u671F");
  }
  const { styles } = useStyles2({ colWidth, size });
  const [form] = Form.useForm(externalForm);
  const query = useQuery();
  const [onFinish, loading] = use_async_default(async (values) => {
    if (typeof onSearch === "function") {
      await onSearch(values);
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
      /* @__PURE__ */ jsx(
        button_default,
        {
          type: "primary",
          htmlType: "submit",
          loading: typeof propLoading !== "undefined" ? propLoading : loading,
          icon: /* @__PURE__ */ jsx(SearchOutlined, {}),
          children: okText
        }
      )
    ] });
  }, [propLoading, loading, onClear, okText, resetText, colWidth]);
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
var isDate = (value, format) => {
  if (!value) return false;
  if (isNumber(value)) {
    return dayjs(value, format).isValid();
  }
  return dayjs(value).isValid();
};
var parseDate = (value, format) => {
  if (!value) return value;
  if (Array.isArray(value)) {
    return value.map((v) => v && isDate(v, format) ? dayjs(v) : v);
  }
  return isDate(value, format) ? dayjs(value) : value;
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
var search_default = Search2;
var useStyles3 = createStyles(({ token }) => ({
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
var handleColumn = (col, dicts, navigate, styles) => {
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
    const classNames = [];
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
        classNames.push(styles.link);
        classNames.push(styles.pointer);
      }
    }
    const statusStr = handleStatus(status, value, record, index);
    if (statusStr) classNames.push(styles[statusStr]);
    if (bold) classNames.push(styles.bold);
    if (isNumber(value)) {
      if (percent) value = multiply(value, 100);
      if (precision === true) precision = 2;
      if (isNumber(precision)) value = round(value, precision);
      if (fill === true) fill = precision || 0;
      if (isNumber(fill)) value = zerofill(value, fill);
      if (percent) value = `${value}%`;
    }
    if (typeof thousandNum === "function" ? thousandNum(value, record, index) : col.thousand) {
      value = thousands(value);
    }
    return /* @__PURE__ */ jsxs("span", { className: classNames.join(" "), onClick: link ? () => navigate(link) : void 0, children: [
      value,
      suffix ?? null
    ] });
  };
  const children = col.children;
  return {
    ...args,
    children: children?.map((col2) => handleColumn(col2, dicts, navigate, styles)) ?? void 0,
    title: tooltip ? (...arrs) => /* @__PURE__ */ jsxs("span", { children: [
      typeof title === "function" ? title(...arrs) : title,
      /* @__PURE__ */ jsx(Tooltip, { title: tooltip, children: /* @__PURE__ */ jsx(QuestionCircleOutlined, { className: styles.question }) })
    ] }) : title,
    render,
    onCell: (record, index) => ({
      onDoubleClick: copyText,
      ...onCellFunc ? onCellFunc(record, index) : {}
    })
  };
};
var handleActions = (actions, actionFixed, actionTitle, actionWidth, styles) => {
  if (!actions || actions.length === 0) return null;
  return {
    title: actionTitle || "\u64CD\u4F5C",
    dataIndex: "__actions",
    width: actionWidth,
    fixed: actionFixed ?? "right",
    render: (_, record, index) => /* @__PURE__ */ jsx(Space, { children: actions.map((action, i) => {
      let { title, visible = true, render, className, type, onClick, ...args } = action;
      const show = typeof visible === "function" ? visible(record, index) : visible;
      if (!show) return null;
      if (typeof render === "function") title = render(record, index);
      if (typeof className === "function") className = className(record, index);
      return /* @__PURE__ */ jsx(
        button_default,
        {
          classNames: {
            root: styles.actionBtn
          },
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
  const { styles } = useStyles3();
  return useMemo(
    () => columns.map((col) => handleColumn(col, dicts, navigate, styles)).concat(handleActions(actions || [], actionFixed, actionTitle, actionWidth, styles) ?? []),
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
        const cls = [];
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
        if (className) {
          cls.push(typeof className === "function" ? className(value) : className);
        }
        if (status) {
          const statusColor = typeof status === "function" ? status(value) : status;
          if (statusColor !== "default") cls.push(`text-${statusColor}`);
        }
        return /* @__PURE__ */ jsx(
          Summary.Cell,
          {
            className: cls?.length ? cls.join(" ") : void 0,
            index: index + 1,
            children: value ?? null
          },
          index + 1
        );
      })
    ] }) }) : void 0;
  }, [columns, summaryMap]);
};
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
  return /* @__PURE__ */ jsx(Table, { rowKey, columns: cols, rowSelection, summary, ...props });
}

// src/components/table/index.tsx
function defineColumns(columns) {
  return columns;
}
var table_default = Table2;
function Actions({ actions, size }) {
  return /* @__PURE__ */ jsx("div", { children: actions?.map(({ title, ...props }, i) => {
    return /* @__PURE__ */ jsx(button_default, { size, ...props, children: title }, i);
  }) });
}
var CheckboxGroup = Checkbox.Group;
var sizeItem = [
  { key: "large", label: "\u5BBD\u677E" },
  { key: "medium", label: "\u4E2D\u7B49" },
  { key: "small", label: "\u7D27\u51D1" }
];
var useStyles4 = createStyles(({ token }) => ({
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
var Content = ({
  columns,
  hiddenKeys,
  defaultHiddenKeys,
  setHiddenKeys
}) => {
  const { styles } = useStyles4();
  const options = useMemo(() => {
    return columns?.map((col) => col.title) ?? [];
  }, [columns]);
  const checkAll = useCallback(
    (e) => {
      if (e.target.checked) {
        setHiddenKeys([]);
      } else {
        setHiddenKeys(options);
      }
    },
    [options]
  );
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: styles.all, children: [
      /* @__PURE__ */ jsx(
        Checkbox,
        {
          onChange: checkAll,
          checked: hiddenKeys.length === 0,
          indeterminate: hiddenKeys.length > 0 && hiddenKeys.length < options.length,
          children: "\u5168\u9009"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: styles.reset, onClick: () => setHiddenKeys(defaultHiddenKeys), children: "\u91CD\u7F6E" })
    ] }),
    /* @__PURE__ */ jsx(
      CheckboxGroup,
      {
        options,
        value: options.filter((option) => !hiddenKeys.includes(option)),
        onChange: (e) => setHiddenKeys(options.filter((option) => !e.includes(option))),
        className: styles.checkboxGroup
      }
    )
  ] });
};
function Tool({
  size = "medium",
  hiddenKeys,
  defaultHiddenKeys,
  setHiddenKeys,
  setSize,
  columns,
  ...props
}) {
  return /* @__PURE__ */ jsxs(Space, { size, ...props, children: [
    /* @__PURE__ */ jsx(Tooltip, { title: "\u5BC6\u5EA6", children: /* @__PURE__ */ jsx(
      Dropdown,
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
    /* @__PURE__ */ jsx(Tooltip, { title: "\u5C55\u793A\u5217", children: /* @__PURE__ */ jsx(
      Popover,
      {
        arrow: false,
        trigger: "click",
        placement: "bottomRight",
        content: /* @__PURE__ */ jsx(
          Content,
          {
            columns,
            hiddenKeys,
            defaultHiddenKeys,
            setHiddenKeys
          }
        ),
        children: /* @__PURE__ */ jsx(SettingOutlined, {})
      }
    ) })
  ] });
}
var useStyles5 = createStyles(({ token }) => ({
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
function Page({
  okText,
  resetText,
  initLoad = true,
  url,
  method: propMethod,
  paramsLocation,
  params: defaultParams,
  onRequestComplete,
  onSearch: onSearchPage,
  onReset: onResetPage,
  onChange: onChangeTable,
  dataSource: propsDataSource,
  colWidth,
  children,
  initialValues,
  form,
  size: defaultSize,
  actions,
  showTool = true,
  columns,
  totalExtra,
  ...props
}, ref) {
  const { styles } = useStyles5();
  const {
    httpRequest,
    transformResponse,
    transformRequest,
    orderFieldName = "order",
    sortFieldName = "sort",
    requestMethod
  } = useContext(ConfigContext);
  if (!propsDataSource && url && !httpRequest) {
    throw new Error("\u8981\u4F7F\u7528\u8FDC\u7A0B\u6570\u636E\u83B7\u53D6\u529F\u80FD\uFF0C\u5FC5\u987B\u914D\u7F6E ConfigProvider \u7684 http \u53C2\u6570");
  }
  const method = propMethod ?? requestMethod ?? "get";
  paramsLocation = paramsLocation ?? (method === "get" ? "query" : "body");
  const defaultHiddenKeys = useMemo(() => {
    return columns?.filter((col) => !!col.hidden).map((col) => col.title) ?? [];
  }, [columns]);
  const [size, setSize] = useState(defaultSize);
  const [hiddenKeys, setHiddenKeys] = useState(defaultHiddenKeys);
  const [data, onSearch, loading] = use_async_reducer_default(
    async (preData, values) => {
      if (!url || !httpRequest) return preData;
      let vals = {
        page: preData.page,
        pageSize: preData.pageSize,
        ...preData.params,
        ...values
      };
      let params = { ...defaultParams ?? {}, ...vals };
      if (typeof onSearchPage === "function") {
        params = await onSearchPage?.(vals);
      }
      const config = {};
      if (typeof transformRequest === "function") {
        params = transformRequest(params, method);
      }
      if (paramsLocation === "query") {
        Object.assign(config, { params });
      } else {
        Object.assign(config, { data: params });
      }
      let responseData = await httpRequest?.request({
        url,
        method,
        ...config
      });
      let result = {
        dataSource: responseData?.data ?? [],
        total: responseData?.total ?? 0,
        pageSize: responseData?.pageSize ?? 10,
        page: responseData?.page ?? 1
      };
      if (typeof transformResponse === "function") {
        result = transformResponse(responseData);
      }
      let dataSource = result.dataSource;
      if (typeof onRequestComplete === "function") {
        dataSource = await onRequestComplete(result.dataSource);
      }
      delete vals.page;
      delete vals.pageSize;
      return {
        dataSource: dataSource ?? [],
        total: result?.total ?? 0,
        pageSize: result?.pageSize ?? 10,
        page: result?.page ?? 1,
        summaryMap: result?.summaryMap,
        params: vals ?? {}
      };
    },
    {
      dataSource: [],
      total: 0,
      pageSize: 10,
      page: 1,
      params: {}
    }
  );
  const onChange = useCallback(
    async (pagination, filters, sorter, extra) => {
      let values = {
        pageSize: pagination.pageSize,
        page: pagination.current
      };
      if (sorter && typeof sorter === "object" && !Array.isArray(sorter)) {
        values.sort = sorter.field;
        const column = sorter.column;
        if (column && column.sorterField) {
          values[sortFieldName] = column.sorterField;
        }
        values[orderFieldName] = sorter.order;
      }
      if (typeof onChangeTable === "function") {
        const newValues = await onChangeTable(pagination, filters, sorter, extra);
        if (newValues) values = newValues;
      }
      onSearch(values);
    },
    [onChangeTable, onSearch]
  );
  const onReset = useCallback(async () => {
    await onResetPage?.();
  }, [onResetPage]);
  const tableColumns = useMemo(() => {
    return columns?.filter((col) => !hiddenKeys.includes(col.title))?.map((col) => ({ ...col, hidden: false }));
  }, [columns, hiddenKeys]);
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
  const immediate = useEffectEvent(() => {
    if (initLoad && !children) {
      onSearch(data.params);
    }
  });
  useLayoutEffect(() => {
    immediate();
  }, []);
  useImperativeHandle(ref, () => ({
    refresh: async (values = {}) => {
      await onSearch(values);
    },
    reset: onReset
  }));
  return /* @__PURE__ */ jsxs("div", { className: styles.root, children: [
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
        loading,
        onSearch: async (values) => {
          await onSearch(values);
        },
        onReset,
        children
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: styles.tool, children: [
      (showTool || pageActions.length > 0) && /* @__PURE__ */ jsxs("div", { className: styles.btns, children: [
        /* @__PURE__ */ jsx(Actions, { actions: pageActions, size }),
        showTool && /* @__PURE__ */ jsx(
          Tool,
          {
            size,
            columns,
            setSize,
            hiddenKeys,
            defaultHiddenKeys,
            setHiddenKeys
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        table_default,
        {
          dataSource: propsDataSource || data.dataSource,
          columns: tableColumns,
          actions: tableActions,
          loading,
          size,
          summaryMap: data.summaryMap,
          onChange,
          pagination: {
            current: propsDataSource ? void 0 : data.page,
            pageSize: data.pageSize,
            total: propsDataSource ? void 0 : data.total,
            responsive: true,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "30", "50", "100"],
            showTotal: (total) => {
              let extra = totalExtra;
              if (typeof totalExtra === "function") {
                extra = totalExtra(data);
              }
              return `\u5171 ${thousands(total)} \u6761\u6570\u636E${extra ? `\uFF0C${extra}` : ""}`;
            },
            showQuickJumper: {
              goButton: /* @__PURE__ */ jsx(button_default, { className: "page-quick-jumper", size, type: "primary", ghost: true, children: "\u8DF3\u8F6C" })
            }
          },
          ...props
        }
      )
    ] })
  ] });
}
var page_default = forwardRef(Page);
function validateDataFunc(response, validateData, reject) {
  if (validateData && !validateData(response.data)) {
    const error = new AxiosError(
      "Response data validation failed",
      "ERR_VALIDATE_DATA",
      response.config,
      response.request,
      response
    );
    return reject?.(error);
  }
  return response.data;
}
var request_default = {
  ...axios,
  create(config) {
    const axiosInstance = axios.create({
      baseURL: config.baseURL,
      headers: config.headers,
      timeout: config.timeout,
      responseType: config.responseType ?? "json",
      validateStatus: config.validateStatus,
      transformResponse: config.transformResponse
    });
    axiosInstance.interceptors.response.use((response) => {
      return validateDataFunc(response, config.validateData, config.reject);
    }, config.reject);
    return axiosInstance;
  }
};

export { button_default as Button, ConfigProvider, date_picker_default as DatePicker, page_default as Page, RangePicker, Register, search_default as Search, table_default as Table, defaultTheme, defineColumns, defineDicts, message, modal, notification, request_default as request, use_async_default as useAsync, use_async_reducer_default as useAsyncReducer, use_async_state_default as useAsyncState, useDict, useDictItem, useDictLabel, useDictStatus, useDicts, useQuery };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
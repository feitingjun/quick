import { DatePicker, Checkbox, Table as Table$1, Tooltip, Space, Button } from 'antd';
import { createContext, useMemo, useContext } from 'react';
import { createStyles } from 'antd-style';
import { QuestionCircleOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import Bignumber from 'bignumber.js';
import { useNavigate } from 'react-router';
import 'dayjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import axios from 'axios';

// src/components/table/table.tsx
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
createStyles(
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
var ConfigContext = createContext({
  dicts: {}
});

// src/dicts/hooks.ts
function useDicts() {
  const { dicts } = useContext(ConfigContext);
  return dicts;
}
var useStyles5 = createStyles(({ token }) => ({
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
      if (typeof thousandNum === "function" ? thousandNum(value, record, index) : col.thousand) {
        value = thousands(value);
      }
      if (percent) value = `${value}%`;
    }
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: classNames.join(" "),
        onClick: link ? () => navigate(link) : void 0,
        children: [
          value,
          suffix ?? null
        ]
      }
    );
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
  const { styles } = useStyles5();
  return useMemo(
    () => columns.map((col) => handleColumn(col, dicts, navigate, styles)).concat(handleActions(actions || [], actionFixed, actionTitle, actionWidth, styles) ?? []),
    [columns, actions, dicts, navigate, actionFixed, actionTitle, actionWidth]
  );
};
var { Summary } = Table$1;
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
function Table({
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
    Table$1,
    {
      rowKey,
      columns: cols,
      rowSelection,
      summary,
      ...props
    }
  );
}

export { Table as default };
//# sourceMappingURL=table.js.map
//# sourceMappingURL=table.js.map
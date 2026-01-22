import { Tooltip as Tooltip$1, Space as Space$1, Button as Button$1, Table } from 'antd';
import { styled } from '@quick/cssinjs';
import { createContext, useMemo, useContext } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import Bignumber from 'bignumber.js';
import { useNavigate } from 'react-router';
import { jsx, jsxs } from '@quick/cssinjs/jsx-runtime';

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
var Tooltip = styled(Tooltip$1);
var tooltip_default = Tooltip;
var Space = styled(Space$1);
var space_default = Space;
var Button = styled(Button$1);
var button_default = Button;
var message;
var ConfigContext = createContext({
  dicts: {}
});

// src/dicts/hooks.ts
function useDicts() {
  const { dicts } = useContext(ConfigContext);
  return dicts;
}
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

export { table_default as default, defineColumns };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
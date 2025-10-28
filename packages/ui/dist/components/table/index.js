// src/components/table/table.tsx
import { Table as AntdTable } from "antd";
import { styled as styled4 } from "@quick/cssinjs";

// src/components/table/column.tsx
import { useMemo } from "react";
import { zerofill, round, isNumber, thousands, useNavigate, multiply } from "@quick/utils";
import { QuestionCircleOutlined } from "@ant-design/icons";

// src/components/tooltip/index.tsx
import { Tooltip as AntdTooltip } from "antd";
import { styled } from "@quick/cssinjs";
var Tooltip = styled(AntdTooltip);

// src/components/space/index.tsx
import { Space as AntdSpace } from "antd";
import { styled as styled2 } from "@quick/cssinjs";
var Space = styled2(AntdSpace);

// src/components/button/index.tsx
import { styled as styled3 } from "@quick/cssinjs";
import { Button as AntdButton } from "antd";
var Button = styled3(AntdButton);

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

// src/components/table/column.tsx
import { jsx, jsxs } from "@quick/cssinjs/jsx-runtime";
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
      /* @__PURE__ */ jsx(Tooltip, { title: tooltip, verticalAlign: "middle", ml: 1, cursor: "pointer", children: /* @__PURE__ */ jsx(QuestionCircleOutlined, {}) })
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
    render: (_, record, index) => /* @__PURE__ */ jsx(Space, { children: actions.map((action, i) => {
      let { title, visible = true, render, className, type, onClick, ...args } = action;
      const show = typeof visible === "function" ? visible(record, index) : visible;
      if (!show) return null;
      if (typeof render === "function") title = render(record, index);
      if (typeof className === "function") className = className(record, index);
      return /* @__PURE__ */ jsx(
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
  return useMemo(
    () => columns.map((col) => handleColumn(col, dicts, navigate)).concat(handleActions(actions || [], actionFixed, actionTitle, actionWidth)),
    [columns, actions, dicts, navigate, actionFixed, actionTitle, actionWidth]
  );
}

// src/components/table/summary.tsx
import { useMemo as useMemo2 } from "react";
import { Table } from "antd";
import { isNumber as isNumber2, round as round2, zerofill as zerofill2, thousands as thousands2, multiply as multiply2 } from "@quick/utils";
import { jsx as jsx2, jsxs as jsxs2 } from "@quick/cssinjs/jsx-runtime";
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
  return useMemo2(() => {
    const summaryList = flatten(columns);
    const hasTotal = summaryList.some((item) => item.total);
    return hasTotal ? () => /* @__PURE__ */ jsx2(Summary, { fixed: true, children: /* @__PURE__ */ jsxs2(Summary.Row, { children: [
      rowSelection && /* @__PURE__ */ jsx2(Summary.Cell, { index: 0 }),
      /* @__PURE__ */ jsx2(Summary.Cell, { index: rowSelection ? 1 : 0, children: "\u5408\u8BA1" }),
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
        return /* @__PURE__ */ jsx2(
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
import { jsx as jsx3 } from "@quick/cssinjs/jsx-runtime";
var StyledTable = styled4(AntdTable);
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
  return /* @__PURE__ */ jsx3(
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
  Table2 as Table,
  defineColumns
};
//# sourceMappingURL=index.js.map
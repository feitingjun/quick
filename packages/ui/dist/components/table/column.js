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
export {
  useColumns
};
//# sourceMappingURL=column.js.map
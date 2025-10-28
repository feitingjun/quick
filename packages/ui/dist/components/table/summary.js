// src/components/table/summary.tsx
import { useMemo } from "react";
import { Table } from "antd";
import { isNumber, round, zerofill, thousands, multiply } from "@quick/utils";
import { jsx, jsxs } from "@quick/cssinjs/jsx-runtime";
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
  return useMemo(() => {
    const summaryList = flatten(columns);
    const hasTotal = summaryList.some((item) => item.total);
    return hasTotal ? () => /* @__PURE__ */ jsx(Summary, { fixed: true, children: /* @__PURE__ */ jsxs(Summary.Row, { children: [
      rowSelection && /* @__PURE__ */ jsx(Summary.Cell, { index: 0 }),
      /* @__PURE__ */ jsx(Summary.Cell, { index: rowSelection ? 1 : 0, children: "\u5408\u8BA1" }),
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
        return /* @__PURE__ */ jsx(
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
export {
  useSummary
};
//# sourceMappingURL=summary.js.map
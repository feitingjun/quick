import { cloneElement, isValidElement } from 'react';
import dayjs, { isDayjs } from 'dayjs';
import Bignumber from 'bignumber.js';
import { Form } from 'antd';
import { styled } from '@quick/cssinjs';
import { jsxs, jsx } from '@quick/cssinjs/jsx-runtime';

// src/components/search/item.tsx
function isNumber(num) {
  const n = new Bignumber(num);
  return n.isFinite() && !n.isNaN();
}
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

export { Item2 as default };
//# sourceMappingURL=item.js.map
//# sourceMappingURL=item.js.map
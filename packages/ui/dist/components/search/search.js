import { isDayjs } from 'dayjs';
import { useMemo, useCallback, useEffect, useActionState, startTransition } from 'react';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { Form, Button as Button$1 } from 'antd';
import { styled, useTheme } from '@quick/cssinjs';
import { jsxs, jsx } from '@quick/cssinjs/jsx-runtime';
import { useSearchParams } from 'react-router';
import Bignumber from 'bignumber.js';

// src/components/search/search.tsx
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
var Button = styled(Button$1);
var button_default = Button;
var StyledBox = styled("div");
var Box = (props) => /* @__PURE__ */ jsx(StyledBox, { as: props.as, ...props });
var box_default = Box;
function isNumber(num) {
  const n = new Bignumber(num);
  return n.isFinite() && !n.isNaN();
}

// src/hooks/use-query.ts
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
  return /* @__PURE__ */ jsxs(
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
      children: [
        children,
        /* @__PURE__ */ jsxs(
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
        )
      ]
    }
  );
}

export { Search as default };
//# sourceMappingURL=search.js.map
//# sourceMappingURL=search.js.map
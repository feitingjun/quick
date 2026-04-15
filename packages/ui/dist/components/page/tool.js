import { createContext, useMemo, useCallback } from 'react';
import { createStyles } from 'antd-style';
import { ColumnHeightOutlined, SettingOutlined } from '@ant-design/icons';
import { DatePicker, Table, Checkbox, Space, Tooltip, Dropdown, Popover } from 'antd';
import 'dayjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import 'react-router';
import 'bignumber.js';
import 'copy-to-clipboard';
import axios from 'axios';

// src/components/page/tool.tsx
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
var CheckboxGroup = Checkbox.Group;
var sizeItem = [
  { key: "large", label: "\u5BBD\u677E" },
  { key: "medium", label: "\u4E2D\u7B49" },
  { key: "small", label: "\u7D27\u51D1" }
];
var useStyles5 = createStyles(({ token }) => ({
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
  const { styles } = useStyles5();
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

export { Tool as default };

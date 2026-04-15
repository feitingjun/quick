import { DatePicker, Table, Checkbox, Button } from 'antd';
import { createContext } from 'react';
import { createStyles } from 'antd-style';
import 'dayjs';
import { jsx } from 'react/jsx-runtime';
import '@ant-design/icons';
import 'react-router';
import 'bignumber.js';
import 'copy-to-clipboard';
import axios from 'axios';

// src/components/antd/index.ts
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
function Actions({ actions, size }) {
  return /* @__PURE__ */ jsx("div", { children: actions?.map(({ title, ...props }, i) => {
    return /* @__PURE__ */ jsx(button_default, { size, ...props, children: title }, i);
  }) });
}

export { Actions as default };

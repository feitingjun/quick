import { DatePicker as DatePicker$1 } from 'antd';
import { styled, useClassName } from '@quick/cssinjs';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { jsx } from '@quick/cssinjs/jsx-runtime';

// src/components/date-picker/index.tsx
var { RangePicker: AntdRangePicker } = DatePicker$1;
var StyledRangePicker = styled(AntdRangePicker);
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
        value: [
          dayjs().subtract(1, "week").startOf("week"),
          dayjs().subtract(1, "week").endOf("week")
        ]
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
function RangePicker({
  showTime,
  allowEmpty = [true, true],
  ...props
}) {
  const presets = usePresets(showTime, allowEmpty);
  const popupRootCls = useClassName({
    ".ant-picker-panel-layout": {
      minHeight: 330
    }
  });
  return /* @__PURE__ */ jsx(
    StyledRangePicker,
    {
      presets,
      showTime,
      allowEmpty,
      classNames: {
        popup: {
          root: popupRootCls
        }
      },
      ...props
    }
  );
}

// src/components/date-picker/index.tsx
var DatePicker = styled(DatePicker$1);
var date_picker_default = DatePicker;

export { RangePicker, date_picker_default as default };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
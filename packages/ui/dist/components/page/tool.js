import { useMemo, useCallback } from 'react';
import { ColumnHeightOutlined, SettingOutlined } from '@ant-design/icons';
import { styled } from '@quick/cssinjs';
import { jsxs, jsx } from '@quick/cssinjs/jsx-runtime';
import { Space as Space$1, Tooltip as Tooltip$1, Dropdown as Dropdown$1, Popover as Popover$1, Checkbox as Checkbox$1 } from 'antd';

// src/components/page/tool.tsx
var StyledBox = styled("div");
var Box = (props) => /* @__PURE__ */ jsx(StyledBox, { as: props.as, ...props });
var box_default = Box;
var Space = styled(Space$1);
var space_default = Space;
var Tooltip = styled(Tooltip$1);
var tooltip_default = Tooltip;
var Dropdown = styled(Dropdown$1);
var dropdown_default = Dropdown;
var Popover = styled(Popover$1);
var popover_default = Popover;
var { Group: AntdCheckboxGroup } = Checkbox$1;
var StyledCheckbox = styled(Checkbox$1);
var StyledGroup = styled(AntdCheckboxGroup);
var Checkbox = StyledCheckbox;
Checkbox.Group = StyledGroup;
var checkbox_default = Checkbox;
var CheckboxGroup = checkbox_default.Group;
var sizeItem = [
  { key: "large", label: "\u5BBD\u677E" },
  { key: "middle", label: "\u4E2D\u7B49" },
  { key: "small", label: "\u7D27\u51D1" }
];
var Content = ({
  columns,
  visibleKeys,
  defaultVisibleKeys,
  setVisibleKeys
}) => {
  const options = useMemo(() => {
    return columns?.map((col) => col.title) ?? [];
  }, [columns]);
  const checkAll = useCallback(
    (e) => {
      if (e.target.checked) {
        setVisibleKeys(options);
      } else {
        setVisibleKeys([]);
      }
    },
    [options]
  );
  return /* @__PURE__ */ jsxs(box_default, { children: [
    /* @__PURE__ */ jsxs(
      box_default,
      {
        sx: {
          pb: 2,
          mb: 2,
          minW: 120,
          display: "flex",
          justifyContent: "space-between"
        },
        children: [
          /* @__PURE__ */ jsx(
            checkbox_default,
            {
              onChange: checkAll,
              checked: visibleKeys.length === options.length,
              indeterminate: visibleKeys.length > 0 && visibleKeys.length < options.length,
              children: "\u5168\u9009"
            }
          ),
          /* @__PURE__ */ jsx(
            box_default,
            {
              as: "span",
              color: "primary",
              cursor: "pointer",
              onClick: () => setVisibleKeys(defaultVisibleKeys),
              children: "\u91CD\u7F6E"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      CheckboxGroup,
      {
        options,
        value: visibleKeys,
        onChange: (e) => setVisibleKeys(e),
        sx: {
          display: "flex",
          flexDirection: "column",
          gap: 1
        }
      }
    )
  ] });
};
function Tool({
  size = "middle",
  visibleKeys,
  defaultVisibleKeys,
  setVisibleKeys,
  setSize,
  columns,
  ...props
}) {
  return /* @__PURE__ */ jsxs(space_default, { size, ...props, children: [
    /* @__PURE__ */ jsx(tooltip_default, { title: "\u5BC6\u5EA6", children: /* @__PURE__ */ jsx(
      dropdown_default,
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
    /* @__PURE__ */ jsx(tooltip_default, { title: "\u5C55\u793A\u5217", children: /* @__PURE__ */ jsx(
      popover_default,
      {
        arrow: false,
        trigger: "click",
        placement: "bottomRight",
        content: /* @__PURE__ */ jsx(
          Content,
          {
            columns,
            visibleKeys,
            defaultVisibleKeys,
            setVisibleKeys
          }
        ),
        children: /* @__PURE__ */ jsx(SettingOutlined, {})
      }
    ) })
  ] });
}

export { Tool as default };
//# sourceMappingURL=tool.js.map
//# sourceMappingURL=tool.js.map
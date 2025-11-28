import { styled } from '@quick/cssinjs';
import { jsx } from '@quick/cssinjs/jsx-runtime';
import { Button as Button$1 } from 'antd';

// src/components/box/index.tsx
var StyledBox = styled("div");
var Box = (props) => /* @__PURE__ */ jsx(StyledBox, { as: props.as, ...props });
var box_default = Box;
var Button = styled(Button$1);
var button_default = Button;
function Actions({ actions, size }) {
  return /* @__PURE__ */ jsx(box_default, { children: actions?.map(({ title, ...props }, i) => {
    return /* @__PURE__ */ jsx(button_default, { size, ...props, children: title }, i);
  }) });
}

export { Actions as default };
//# sourceMappingURL=actions.js.map
//# sourceMappingURL=actions.js.map
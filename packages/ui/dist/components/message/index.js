import { App } from 'antd';

// src/components/message/index.tsx
var message;
var useRegisterMessage = () => {
  const { message: messageInstance } = App.useApp();
  message = messageInstance;
  return null;
};

export { message, useRegisterMessage };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
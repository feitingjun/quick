import axios from 'axios';
import 'antd';

// src/request/index.ts
var message;

// src/request/index.ts
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
var request = {
  _internalResponseHandler: void 0,
  /**初始化配置 */
  init(config) {
    axios.defaults.baseURL = config.baseURL;
    Object.entries(config.headers ?? {}).forEach(([key, value]) => {
      axios.defaults.headers.common[key] = value;
    });
    axios.defaults.timeout = config.timeout;
    axios.defaults.responseType = config.responseType ?? "json";
    this._internalResponseHandler = config?.internalResponseHandler;
    axios.defaults.transformResponse = [
      ...Array.isArray(axios.defaults.transformResponse) ? axios.defaults.transformResponse : axios.defaults.transformResponse ? [axios.defaults.transformResponse] : [],
      function(data) {
        const error = config.responseError?.(data);
        if (error) {
          throw new CustomError(error, data, this);
        }
        return data;
      }
    ];
  },
  request: (config) => axios.request(config),
  get: (url, config) => axios.get(url, config),
  post: (url, data, config) => axios.post(url, data, config),
  put: (url, data, config) => axios.put(url, data, config),
  delete: (url, config) => axios.delete(url, config),
  patch: (url, data, config) => axios.patch(url, data, config),
  all: axios.all,
  spread: axios.spread
};
var request_default = request;

export { request_default as default };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
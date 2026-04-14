import axios, { type ResponseType, type AxiosRequestConfig } from 'axios'
import { message } from '@/components/message'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorHandler?: boolean
  }
}

interface RequestInit {
  /**请求基础路径 */
  baseURL?: string
  /**额外的请求头信息 */
  headers?: Record<string, string>
  /**请求超时时间 */
  timeout?: number
  /**响应数据格式，默认json */
  responseType?: ResponseType
  /**根据服务器返回数据自定义错误，返回null时表示没有错误 */
  responseError?: (data: any) => string | null
  /**为带数据请求功能的组件定义统一的response处理 */
  internalResponseHandler?: {
    all?: (data: any) => any
    select?: (data: any) => Record<string, any>[]
    page?: (data: any) => {
      dataSource: Record<string, any>[]
      total: number
      pageSize: number
      page: number
    }
  }
}

class CustomError {
  name: string
  message: string
  code = 'ERR_CUSTOM'
  data: any
  config: AxiosRequestConfig
  constructor(message: string, data: any, config: AxiosRequestConfig) {
    this.name = 'CustomError'
    this.message = message
    this.data = data
    this.config = config
  }
}

/**返回false时进入错误处理 */
axios.defaults.validateStatus = status => {
  return status >= 200 && status < 300
}

/**默认ResponseType */
axios.defaults.responseType = 'json'

/**响应拦截器 */
axios.interceptors.response.use(
  response => response.data,
  error => {
    let errorMsg = error.message || '未知错误'
    let data = null
    if (axios.isAxiosError(error)) {
      errorMsg = error.message
      data = error.response?.data
    }
    if (error instanceof CustomError) {
      errorMsg = error.message
      data = error.data
    }
    if (!error?.config?.skipErrorHandler) {
      message.error(errorMsg)
    }
    return data
  }
)

const request = {
  _internalResponseHandler: undefined as RequestInit['internalResponseHandler'],
  /**初始化配置 */
  init(config: RequestInit) {
    axios.defaults.baseURL = config.baseURL
    Object.entries(config.headers ?? {}).forEach(([key, value]) => {
      axios.defaults.headers.common[key] = value
    })
    axios.defaults.timeout = config.timeout
    axios.defaults.responseType = config.responseType ?? 'json'
    this._internalResponseHandler = config?.internalResponseHandler
    axios.defaults.transformResponse = [
      ...(Array.isArray(axios.defaults.transformResponse)
        ? axios.defaults.transformResponse
        : axios.defaults.transformResponse
        ? [axios.defaults.transformResponse]
        : []),
      function (data) {
        const error = config.responseError?.(data)
        if (error) {
          throw new CustomError(error, data, this)
        }
        return data
      }
    ]
  },
  request: <T = any>(config: AxiosRequestConfig<T>) => axios.request<T, T | undefined>(config),
  get: <T = any>(url: string, config?: AxiosRequestConfig<T>) =>
    axios.get<T, T | undefined>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig<T>) =>
    axios.post<T, T | undefined>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig<T>) =>
    axios.put<T, T | undefined>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig<T>) =>
    axios.delete<T, T | undefined>(url, config),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig<T>) =>
    axios.patch<T, T | undefined>(url, data, config),
  all: axios.all,
  spread: axios.spread
}

export default request

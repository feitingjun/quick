import axios, {
  type ResponseType,
  type AxiosResponse,
  type AxiosRequestConfig,
  type AxiosResponseTransformer,
  type AxiosInstance,
  AxiosError
} from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorHandler?: boolean
  }
}

interface Request<ResponseData> extends Omit<
  AxiosInstance,
  | 'request'
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'head'
  | 'options'
  | 'postForm'
  | 'putForm'
  | 'patchForm'
> {
  request: <T = ResponseData>(config: AxiosRequestConfig) => Promise<T>
  get: <T = ResponseData>(url: string, config?: AxiosRequestConfig) => Promise<T>
  post: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
  put: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
  delete: <T = ResponseData>(url: string, config?: AxiosRequestConfig) => Promise<T>
  patch: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
  head: <T = ResponseData>(url: string, config?: AxiosRequestConfig) => Promise<T>
  options: <T = ResponseData>(url: string, config?: AxiosRequestConfig) => Promise<T>
  postForm: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
  putForm: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
  patchForm: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
}

interface RequestConfig<T> {
  /**请求基础路径 */
  baseURL?: string
  /**额外的请求头信息 */
  headers?: AxiosRequestConfig['headers']
  /**请求超时时间 */
  timeout?: number
  /**响应数据格式，默认json */
  responseType?: ResponseType
  /**异常处理 */
  reject?: (error: AxiosError<T>) => void
  /**验证response.data，返回false时进入异常处理 */
  validateData?: (response: AxiosResponse<T>['data']) => boolean
  /**验证http状态码，返回false时进入异常处理 */
  validateStatus?: (status: number) => boolean
  transformResponse?: AxiosResponseTransformer
}
/**响应数据验证 */
function validateDataFunc(
  response: AxiosResponse,
  validateData?: RequestConfig<any>['validateData'],
  reject?: RequestConfig<any>['reject']
) {
  if (validateData && !validateData(response.data)) {
    const error = new AxiosError(
      'Response data validation failed',
      'ERR_VALIDATE_DATA',
      response.config,
      response.request,
      response
    )
    return reject?.(error)
  }
  return response.data
}
export default {
  ...axios,
  create<T = unknown>(config: RequestConfig<T>) {
    const axiosInstance = axios.create({
      baseURL: config.baseURL,
      headers: config.headers,
      timeout: config.timeout,
      responseType: config.responseType ?? 'json',
      validateStatus: config.validateStatus,
      transformResponse: config.transformResponse
    })
    axiosInstance.interceptors.response.use(response => {
      return validateDataFunc(response, config.validateData, config.reject)
    }, config.reject)
    return axiosInstance as Request<T>
  }
}

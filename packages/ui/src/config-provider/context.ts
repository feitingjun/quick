import { createContext } from 'react'
import type { TableProps } from 'antd'
import type { TransformResult, PageProps } from '@/components/page/types'
import type { Dicts } from '@/dicts/types'

interface RequestConfig {
  url?: string
  method?: PageProps['method']
  params?: any
  data?: any
  [key: string]: any
}

export interface HttpRequest {
  request: (config: RequestConfig) => Promise<any>
}

export interface PageComponentConfig {
  /**设置表格的粘性头部和滚动条 */
  sticky?: TableProps['sticky']
  /**默认请求方法 */
  requestMethod?: PageProps['method']
  /**排序sort字段重命名 */
  sortFieldName?: string
  /**排序order字段重命名 */
  orderFieldName?: string
  /*统一转换请求数据格式 */
  transformRequest?: (params: Record<string, any>, method: PageProps['method']) => Record<string, any>
  /**统一转换数据格式*/
  transformResponse?: (response: any) => TransformResult
}

export const ConfigContext = createContext<{
  dicts: Dicts
  httpRequest?: HttpRequest
  page?: PageComponentConfig
}>({
  dicts: {}
})

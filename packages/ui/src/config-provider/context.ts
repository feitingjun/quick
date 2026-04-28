import { createContext } from 'react'
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

export const ConfigContext = createContext<{
  dicts: Dicts
  httpRequest?: HttpRequest
  transformResponse?: (response: any) => TransformResult
  transformRequest?: (params: Record<string, any>, method: PageProps['method']) => Record<string, any>
  sortFieldName?: string
  orderFieldName?: string
  requestMethod?: PageProps['method']
}>({
  dicts: {}
})

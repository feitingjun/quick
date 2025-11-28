import { defineApp } from 'quick'
import { request } from '@quick/ui'

request.init({
  baseURL: 'http://localhost:9000/api',
  timeout: 30000,
  responseError: data => (data?.code !== 0 ? data?.message : null),
  internalResponseHandler: {
    all: res => res?.data,
    select: data => data ?? [],
    page: data => ({
      dataSource: data?.records ?? [],
      total: data?.total ?? 0,
      pageSize: data?.size ?? 10,
      page: data?.current ?? 1
    })
  }
})

export default defineApp({})

import { useCallback, useState, useMemo } from 'react'
import type { ComponentCssStyles } from '@quick/cssinjs'
import Table, {
  type TableProps,
  type AnyObject,
  type Action as TableActions
} from '@/components/table'
import Search, { type SearchProps } from '@/components/search'
import Box from '@/components/box'
import useAsyncAction from '@/hooks/use-async-action'
import request from '@/request'
import Actions, { type Action as PageAction } from './actions'
import Tool from './tool'

export type Action<RecordType extends AnyObject = AnyObject> =
  | PageAction
  | (TableActions<RecordType> & { display: 'table' })

export type PageProps<RecordType extends AnyObject = AnyObject> = ComponentCssStyles &
  Omit<TableProps<RecordType>, 'actions'> &
  Omit<SearchProps, 'onSearch'> & {
    /**请求路径 */
    url?: string
    /**请求方式 */
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch'
    /**请求参数位置，get默认是query，其它默认是body */
    paramsLocation?: 'query' | 'body'
    /**额外的请求参数 */
    params?: Record<string, any>
    /**数据请求完成后的回调，data为经过request.internalResponseHandler处理后的数据 */
    onRequestComplete?: (data: any) => RecordType[] | Promise<RecordType[]>
    onSearch?: (values: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>
    colWidth?: number
    /**页面操作按钮 */
    actions?: Action<RecordType>[]
    /**是否显示工具栏 */
    showTool?: boolean
  }

export default function Page<RecordType extends AnyObject = AnyObject>({
  okText,
  resetText,
  initLoad,
  url,
  method = 'get',
  paramsLocation,
  params,
  onRequestComplete,
  onSearch: onSearchPage,
  onReset: onResetPage,
  dataSource: propsDataSource,
  colWidth,
  children,
  initialValues,
  form,
  size: defaultSize,
  actions,
  showTool = true,
  columns,
  ...props
}: PageProps<RecordType>) {
  paramsLocation = paramsLocation ?? (method === 'get' ? 'query' : 'body')
  const [dataSource, setDataSource] = useState<RecordType[]>([])
  const defaultVisibleKeys = useMemo(() => {
    return columns?.filter(col => !col.hidden).map(col => col.title as string) ?? []
  }, [columns])
  const [size, setSize] = useState(defaultSize)
  const [visibleKeys, setVisibleKeys] = useState<string[]>(defaultVisibleKeys)

  const [onSearch, loading] = useAsyncAction<Record<string, any>>(async values => {
    const vals = await onSearchPage?.(values)
    if (!url) return
    const config = {}
    if (paramsLocation === 'query') {
      Object.assign(config, { params: { ...(params ?? {}), ...(vals ?? {}) } })
    } else {
      Object.assign(config, { data: { ...(params ?? {}), ...(vals ?? {}) } })
    }
    let res = await request.request({
      url,
      method,
      ...config
    })
    if (request._internalResponseHandler?.all) {
      res = await request._internalResponseHandler.all(res)
    }
    if (request._internalResponseHandler?.page) {
      res = await request._internalResponseHandler.page(res)
    }
    if (typeof onRequestComplete === 'function') {
      res = await onRequestComplete(res)
    }
    setDataSource(res?.dataSource ?? [])
  })

  const onReset = useCallback(async () => {
    await onResetPage?.()
  }, [onResetPage])

  const tableColumns = useMemo(() => {
    return columns
      ?.filter(col => visibleKeys.includes(col.title as string))
      ?.map(col => ({ ...col, hidden: false }))
  }, [columns, visibleKeys])

  const [pageActions, tableActions] = useMemo(() => {
    return (
      actions?.reduce(
        (acc, action) => {
          if ((action as any).display === 'table') {
            acc[1].push(action as TableActions<RecordType>)
          } else {
            acc[0].push(action as PageAction)
          }
          return acc
        },
        [[], []] as [PageAction[], TableActions<RecordType>[]]
      ) ?? [[], []]
    )
  }, [actions])

  return (
    <Box
      sx={{
        w: 1
      }}
    >
      {children && (
        <Search
          form={form}
          initLoad={initLoad}
          initialValues={initialValues}
          okText={okText}
          resetText={resetText}
          colWidth={colWidth}
          size={size}
          onSearch={onSearch}
          onReset={onReset}
        >
          {children}
        </Search>
      )}
      <Box bg='bg'>
        {(showTool || pageActions.length > 0) && (
          <Box px={2} py={2} fontSize='subtitle' display='flex' justifyContent='space-between'>
            <Actions actions={pageActions} size={size} />
            {showTool && (
              <Tool
                size={size}
                columns={columns}
                setSize={setSize}
                visibleKeys={visibleKeys}
                defaultVisibleKeys={defaultVisibleKeys}
                setVisibleKeys={setVisibleKeys}
              />
            )}
          </Box>
        )}
        <Table
          dataSource={propsDataSource || dataSource}
          columns={tableColumns}
          actions={tableActions}
          loading={loading}
          size={size}
          {...props}
        />
      </Box>
    </Box>
  )
}

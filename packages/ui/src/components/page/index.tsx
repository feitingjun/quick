import { useCallback, useState, useMemo } from 'react'
import { createStyles } from 'antd-style'
import Table, {
  type TableProps,
  type AnyObject,
  type Action as TableActions
} from '@/components/table'
import Search, { type SearchProps } from '@/components/search'
import useAsyncAction from '@/hooks/use-async-action'
import request from '@/request'
import Actions, { type Action as PageAction } from './actions'
import Tool from './tool'

export type Action<RecordType extends AnyObject = AnyObject> =
  | (PageAction & { display?: 'page' })
  | (TableActions<RecordType> & { display: 'table' })

export type PageProps<RecordType extends AnyObject = AnyObject> = Omit<
  TableProps<RecordType>,
  'actions' | 'summaryMap' | 'size'
> &
  Omit<SearchProps, 'onSearch' | 'size'> & {
    size?: Exclude<TableProps['size'], 'middle'>
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

const useStyles = createStyles(({ token }) => ({
  root: {
    width: '100%'
  },
  btns: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: token.sizeUnit * 2,
    fontSize: token.fontSizeLG
  },
  tool: {
    backgroundColor: token.colorBgContainer
  }
}))

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
  const { styles } = useStyles()
  paramsLocation = paramsLocation ?? (method === 'get' ? 'query' : 'body')
  const [dataSource, setDataSource] = useState<RecordType[]>([])
  const defaultHiddenKeys = useMemo(() => {
    return columns?.filter(col => !!col.hidden).map(col => col.title as string) ?? []
  }, [columns])
  const [size, setSize] = useState(defaultSize)
  const [hiddenKeys, setHiddenKeys] = useState<string[]>(defaultHiddenKeys)

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
      ?.filter(col => !hiddenKeys.includes(col.title as string))
      ?.map(col => ({ ...col, hidden: false }))
  }, [columns, hiddenKeys])

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
    <div className={styles.root}>
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
      <div className={styles.tool}>
        {(showTool || pageActions.length > 0) && (
          <div className={styles.btns}>
            <Actions actions={pageActions} size={size} />
            {showTool && (
              <Tool
                size={size}
                columns={columns}
                setSize={setSize}
                hiddenKeys={hiddenKeys}
                defaultHiddenKeys={defaultHiddenKeys}
                setHiddenKeys={setHiddenKeys}
              />
            )}
          </div>
        )}
        <Table
          dataSource={propsDataSource || dataSource}
          columns={tableColumns}
          actions={tableActions}
          loading={loading}
          size={size}
          {...props}
        />
      </div>
    </div>
  )
}

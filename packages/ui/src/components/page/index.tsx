import {
  useCallback,
  useState,
  useMemo,
  useContext,
  useLayoutEffect,
  useEffectEvent,
  forwardRef,
  useImperativeHandle,
  type Ref
} from 'react'
import { createStyles } from 'antd-style'
import type { GetProp } from 'antd'
import Table, { type AnyObject, type Action as TableActions, type TableProps } from '@/components/table'
import { Button, Search } from '@/components'
import { useAsyncReducer } from '@/hooks'
import { ConfigContext } from '@/config-provider/context'
import { thousands, classnames } from '@/utils'
import Actions from './actions'
import Tool from './tool'
import type { OperationAction, PageProps, PageDatabase, TransformResult, PageRef } from './types'

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
  },
  jumper: {
    marginLeft: token.marginXS
  }
}))

export function Page<RecordType extends AnyObject = AnyObject>(
  {
    okText,
    resetText,
    initLoad = true,
    url,
    method: propMethod,
    paramsLocation,
    params: defaultParams,
    onRequestComplete,
    onSearch: onSearchPage,
    onReset,
    onChange: onChangeTable,
    dataSource: propsDataSource,
    colWidth,
    children,
    initialValues,
    form,
    size: defaultSize,
    actions,
    showTool = true,
    columns,
    totalExtra,
    className,
    ...props
  }: PageProps<RecordType>,
  ref: Ref<PageRef>
) {
  const { styles } = useStyles()
  const {
    httpRequest,
    page: {
      transformResponse,
      transformRequest,
      orderFieldName = 'order',
      sortFieldName = 'sort',
      requestMethod,
      sticky
    } = {}
  } = useContext(ConfigContext)
  if (!propsDataSource && url && !httpRequest) {
    throw new Error('要使用远程数据获取功能，必须配置 ConfigProvider 的 http 参数')
  }
  const method = propMethod ?? requestMethod ?? 'get'
  paramsLocation = paramsLocation ?? (method === 'get' ? 'query' : 'body')
  const defaultHiddenKeys = useMemo(() => {
    return columns?.filter(col => !!col.hidden).map(col => col.title as string) ?? []
  }, [columns])
  const [size, setSize] = useState(defaultSize)
  const [hiddenKeys, setHiddenKeys] = useState<string[]>(defaultHiddenKeys)

  const [data, onSearch, loading] = useAsyncReducer<
    PageDatabase<RecordType>,
    PageDatabase<RecordType>['params']
  >(
    async (preData, values) => {
      if (!url || !httpRequest) return preData
      let vals: Record<string, any> = {
        page: preData.page,
        pageSize: preData.pageSize,
        ...preData.params,
        ...values
      }
      let params = { ...(defaultParams ?? {}), ...vals }
      if (typeof onSearchPage === 'function') {
        params = await onSearchPage?.(vals)
      }
      const config = {}
      if (typeof transformRequest === 'function') {
        params = transformRequest(params, method)
      }
      if (paramsLocation === 'query') {
        Object.assign(config, { params })
      } else {
        Object.assign(config, { data: params })
      }
      let responseData: any = await httpRequest?.request({
        url,
        method,
        ...config
      })
      let result: TransformResult = {
        dataSource: responseData?.data ?? [],
        total: responseData?.total ?? 0,
        pageSize: responseData?.pageSize ?? 10,
        page: responseData?.page ?? 1
      }
      if (typeof transformResponse === 'function') {
        result = transformResponse(responseData)
      }
      let dataSource = result.dataSource as RecordType[]
      if (typeof onRequestComplete === 'function') {
        dataSource = await onRequestComplete(result.dataSource)
      }
      // 剔除params内的分页参数，交由database统一管理，避免不一致
      delete vals.page
      delete vals.pageSize
      return {
        dataSource: dataSource ?? [],
        total: result?.total ?? 0,
        pageSize: result?.pageSize ?? 10,
        page: result?.page ?? 1,
        summaryMap: result?.summaryMap,
        params: vals ?? {}
      }
    },
    {
      dataSource: [],
      total: 0,
      pageSize: 10,
      page: 1,
      params: {}
    }
  )

  const onChange = useCallback<GetProp<TableProps<RecordType>, 'onChange'>>(
    async (pagination, filters, sorter, extra) => {
      let values: PageDatabase<RecordType>['params'] = {
        pageSize: pagination.pageSize,
        page: pagination.current
      }
      // 排序参数处理
      if (sorter && typeof sorter === 'object' && !Array.isArray(sorter)) {
        values.sort = sorter.field
        const column: Record<string, any> | undefined = sorter.column
        if (column && column.sorterField) {
          values[sortFieldName] = column.sorterField
        }
        values[orderFieldName] = sorter.order
      }
      if (typeof onChangeTable === 'function') {
        const newValues = await onChangeTable(pagination, filters, sorter, extra)
        if (newValues) values = newValues
      }
      onSearch(values)
    },
    [onChangeTable, onSearch]
  )

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
            acc[0].push(action as OperationAction)
          }
          return acc
        },
        [[], []] as [OperationAction[], TableActions<RecordType>[]]
      ) ?? [[], []]
    )
  }, [actions])

  const immediate = useEffectEvent(() => {
    if (initLoad && !children) {
      onSearch(data.params)
    }
  })

  useLayoutEffect(() => {
    immediate()
  }, [])

  useImperativeHandle(ref, () => ({
    refresh: async (values: Record<string, any> = {}) => {
      await onSearch(values)
    }
  }))
  return (
    <div className={classnames(styles.root, className, 'quick-ui-page')}>
      {children && (
        <Search
          form={form}
          initLoad={initLoad}
          initialValues={initialValues}
          okText={okText}
          resetText={resetText}
          colWidth={colWidth}
          size={size}
          loading={loading}
          onSearch={async values => {
            await onSearch({ ...values, page: 1 })
          }}
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
                loading={loading}
                setSize={setSize}
                hiddenKeys={hiddenKeys}
                defaultHiddenKeys={defaultHiddenKeys}
                setHiddenKeys={setHiddenKeys}
                refresh={() => onSearch({})}
              />
            )}
          </div>
        )}
        <Table
          dataSource={propsDataSource || data.dataSource}
          columns={tableColumns}
          actions={tableActions}
          loading={loading}
          size={size}
          summaryMap={data.summaryMap}
          onChange={onChange}
          pagination={{
            current: propsDataSource ? undefined : data.page,
            pageSize: data.pageSize,
            total: propsDataSource ? undefined : data.total,
            responsive: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '30', '50', '100'],
            showTotal: (total: number) => {
              let extra = totalExtra
              if (typeof totalExtra === 'function') {
                extra = totalExtra(data)
              }
              return `共 ${thousands(total)} 条数据${extra ? `，${extra}` : ''}`
            },
            showQuickJumper: {
              goButton: (
                <Button
                  className='page-quick-jumper'
                  rootClassName={styles.jumper}
                  size={size}
                  type='primary'
                  ghost
                >
                  跳转
                </Button>
              )
            }
          }}
          sticky={sticky}
          scroll={{ x: 200 }}
          {...props}
        />
      </div>
    </div>
  )
}

export default forwardRef(Page)

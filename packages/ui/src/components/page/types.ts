import type { GetProp } from 'antd'
import type { TableProps, AnyObject, Action as TableActions } from '@/components/table'
import type { SearchProps } from '@/components'
import type { ButtonProps } from '@/components'

export type TabelOnChange<RecordType extends AnyObject> = (
  ...args: Parameters<GetProp<TableProps<RecordType>, 'onChange'>>
) => any

export interface OperationAction extends Omit<ButtonProps, 'title'> {
  title?: React.ReactNode
}

export interface ActionsProps {
  actions?: OperationAction[]
  size?: 'small' | 'medium' | 'large'
}

export type PageAction<RecordType extends AnyObject = AnyObject> =
  | (OperationAction & { display?: 'page' })
  | (TableActions<RecordType> & { display: 'table' })

export interface Pagination {
  total: number
  pageSize: number
  page: number
}

export interface PageDatabase<RecordType extends AnyObject = AnyObject> extends Pagination {
  dataSource: RecordType[]
  summaryMap?: Record<string, number>
  params: Record<string, any>
}

// 预处理数据类型
export interface TransformResult extends Pagination {
  dataSource: AnyObject[]
  summaryMap?: Record<string, number>
}

export type PageProps<RecordType extends AnyObject = AnyObject> = Omit<
  TableProps<RecordType>,
  'actions' | 'summaryMap' | 'size' | 'onChange'
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
    /**数据请求完成后的回调，data为经过request.internal处理后的数据 */
    onRequestComplete?: (data: any) => RecordType[] | Promise<RecordType[]>
    onSearch?: (values: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>
    /**表格change事件，包括分页、排序、筛选变化，返回新的查询条件或undefined */
    onChange?: TabelOnChange<RecordType>
    colWidth?: number
    /**页面操作按钮 */
    actions?: PageAction<RecordType>[]
    /**是否显示工具栏 */
    showTool?: boolean
    /**表格Pagination.showTotal额外的内容 */
    totalExtra?: React.ReactNode | ((data: PageDatabase<RecordType>) => React.ReactNode)
  }

export type PageRef = {
  refresh: (values?: Record<string, any>) => Promise<void>
  reset: () => void
}

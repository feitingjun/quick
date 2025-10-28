import { Table as AntdTable, TableProps as AntdTableProps } from 'antd'
import { styled } from '@quick/cssinjs'
import { useColumns } from './column'
import { useSummary } from './summary'
import { AnyObject, TableProps, ColumnProps } from './types'

const StyledTable = styled<React.ComponentType<AntdTableProps<any>>>(AntdTable)

/**仅在 dataSource[number] 类型未知时使用，通过columns内容自动推断 dataSource[number] 的类型  */
export function defineColumns<const T extends ColumnProps<AnyObject>[]>(columns: T) {
  type P = T[number] extends { dataIndex: string } ? T[number]['dataIndex'] : never
  type Row = {
    [K in P]: any
  }
  return columns as ColumnProps<Row & AnyObject>[]
}

export function Table<T extends AnyObject>({
  columns = [],
  actionFixed,
  actionTitle,
  actionWidth,
  actions,
  summaryMap,
  rowSelection,
  rowKey = 'id',
  ...props
}: TableProps<T>) {
  const cols = useColumns(columns, actions, actionFixed, actionTitle, actionWidth)
  const summary = useSummary(cols, summaryMap, rowSelection)
  return (
    <StyledTable
      rowKey={rowKey}
      columns={cols}
      rowSelection={rowSelection}
      summary={summary}
      {...props}
    />
  )
}

import { Table as AntdTable } from 'antd'
import { useColumns } from './column'
import { useSummary } from './summary'
import type { AnyObject, TableProps } from './types'

export default function Table<T extends AnyObject = AnyObject>({
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
    <AntdTable
      rowKey={rowKey}
      columns={cols}
      rowSelection={rowSelection}
      summary={summary}
      {...props}
    />
  )
}

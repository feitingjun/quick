import { Table as AntdTable, type TableProps as AntdTableProps } from 'antd'
import { styled } from '@quick/cssinjs'
import { useColumns } from './column'
import { useSummary } from './summary'
import type { AnyObject, TableProps } from './types'

const StyledTable = styled<React.ComponentType<AntdTableProps<any>>>(AntdTable)

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
    <StyledTable
      rowKey={rowKey}
      columns={cols}
      rowSelection={rowSelection}
      summary={summary}
      {...props}
    />
  )
}

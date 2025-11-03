import type { ColumnProps, AnyObject } from './types'
import Table from './table'
export * from './types'

/**仅在 dataSource[number] 类型未知时使用，通过columns内容自动推断 dataSource[number] 的类型  */
export function defineColumns<const T extends ColumnProps<AnyObject>[]>(columns: T) {
  type P = T[number] extends { dataIndex: string } ? T[number]['dataIndex'] : never
  type Row = {
    [K in P]: any
  }
  return columns as ColumnProps<Row & AnyObject>[]
}

export default Table

import type { ColumnProps, AnyObject } from './types'
import Table from './table'
export * from './types'

export function defineColumns<const T extends AnyObject>(columns: ColumnProps<T>[]) {
  return columns
}

export default Table

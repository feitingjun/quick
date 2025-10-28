import { useMemo } from 'react'
import { Table } from 'antd'
import { isNumber, round, zerofill, thousands, multiply } from '@quick/utils'
import {
  ColumnProps,
  ColumnType,
  ColumnGroupType,
  AnyObject,
  TableProps,
  SummaryProps
} from './types'

const { Summary } = Table

function flatten(arr: ColumnProps<any>[]) {
  return arr.reduce((acc, props) => {
    const { children, ...rest } = props as ColumnGroupType
    acc.push(rest)
    if (Array.isArray(children)) acc.push(...flatten(children))
    return acc
  }, [] as ColumnType[])
}

export function useSummary<T extends AnyObject = AnyObject>(
  columns: ColumnProps<T>[],
  summaryMap?: Record<string, number>,
  rowSelection?: TableProps<T>['rowSelection']
) {
  return useMemo(() => {
    const summaryList = flatten(columns)
    const hasTotal = summaryList.some(item => item.total)
    return hasTotal
      ? () => (
          <Summary fixed>
            <Summary.Row>
              {rowSelection && <Summary.Cell index={0} />}
              <Summary.Cell index={rowSelection ? 1 : 0}>合计</Summary.Cell>
              {summaryList.slice(1).map((item, index) => {
                let defaultSummary: SummaryProps = { thousand: true }
                let value: number | string | undefined =
                  summaryMap?.[item.totalField ?? (item.dataIndex as string)]
                if (typeof item.total === 'object') {
                  defaultSummary = { ...defaultSummary, ...item.total }
                }
                let {
                  precision,
                  zerofill: fill,
                  percent,
                  thousand: thousandNum,
                  formatter,
                  className
                } = defaultSummary
                if (typeof formatter === 'function') {
                  value = formatter(value)
                }
                if (isNumber(value)) {
                  // 处理百分比
                  if (percent) value = multiply(Number(value), 100)
                  // 处理四舍五入
                  if (precision === true) precision = 2
                  if (isNumber(precision)) value = round(value, precision)
                  // 小数补零
                  if (fill === true) fill = precision || 0
                  if (isNumber(fill)) value = zerofill(value, fill)
                  // 处理千分位
                  if (thousandNum) value = value ? thousands(value) : value
                  // 添加%
                  if (percent) value = `${value}%`
                }
                className = typeof className === 'function' ? className(value) : className
                return (
                  <Summary.Cell
                    className={className ?? undefined}
                    key={index + 1}
                    index={index + 1}
                  >
                    {value ?? null}
                  </Summary.Cell>
                )
              })}
            </Summary.Row>
          </Summary>
        )
      : undefined
  }, [columns, summaryMap])
}

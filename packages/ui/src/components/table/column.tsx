import { type MouseEvent, useMemo } from 'react'
import type { SxProps } from '@quick/cssinjs'
import { QuestionCircleOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { zerofill, round, isNumber, thousands, multiply } from '@/utils'
import { useNavigate } from '@/hooks'
import Tooltip from '@/components/tooltip'
import Space from '@/components/space'
import Button from '@/components/button'
import { message } from '@/components/message'
import { useDicts, type DictItem } from '@/dicts'
import type { AnyObject, ColumnProps, ColumnGroupType, Action, TableProps } from './types'

/**复制文本 */
const copyText = (e: MouseEvent<HTMLTableCellElement>) => {
  // 选中单元格整行文本
  const selection = window.getSelection()
  selection?.removeAllRanges()
  const range = document.createRange()
  range.selectNodeContents(e.currentTarget)
  selection?.addRange(range)

  const text = e.currentTarget?.innerText
  if (text && copy(text)) {
    message.success('文本已复制')
  }
}

const handleStatus = (
  status: ColumnProps<any>['status'],
  value: any,
  record: AnyObject,
  index: number
) => {
  let statusStr = typeof status === 'function' ? status(value, record, index) : status
  switch (statusStr) {
    case 'completed':
      return 'link'
    case 'invalid':
      return 'disabled'
    case 'waiting':
      return 'warning'
    case 'default':
      return null
    default:
      return statusStr || null
  }
}

const handleColumn = <T extends AnyObject = AnyObject>(
  col: ColumnProps<T>,
  dicts: ReturnType<typeof useDicts>,
  navigate: ReturnType<typeof useNavigate>
): ColumnProps<T> => {
  let {
    status,
    bold,
    thousand: thousandNum,
    link,
    precision,
    zerofill: fill,
    percent,
    suffix,
    title,
    tooltip,
    dictCode,
    render: renderFunc,
    onCell: onCellFunc,
    ...args
  } = col
  const render = (value: any, record: T, index: number) => {
    const sx: SxProps = {}
    value = renderFunc?.(value, record, index) ?? value
    // 处理字典
    if (dictCode) {
      const dict = dicts[dictCode]
      const item = dict?.find((item: DictItem) => item.value === value)
      if (item) {
        value = item.label
        status = item.status
      }
    }
    // 处理超链接
    if (link) {
      link = typeof link === 'function' ? link(value, record, index) : link
      if (link) {
        sx.color = 'link'
        sx.cursor = 'pointer'
      }
    }
    // 处理状态
    if (status) sx.color = handleStatus(status, value, record, index)
    // 处理粗体
    if (bold) sx.fontWeight = 'bold'
    if (isNumber(value)) {
      // 处理百分比(先*100,处理完千分位和四舍五入等在添加%号)
      if (percent) value = multiply(value, 100)
      // 处理四舍五入
      if (precision === true) precision = 2
      if (isNumber(precision)) value = round(value, precision)
      // 小数补零
      if (fill === true) fill = precision || 0
      if (isNumber(fill)) value = zerofill(value, fill)
      // 处理千分位
      if (typeof thousandNum === 'function' ? thousandNum(value, record, index) : col.thousand) {
        value = thousands(value)
      }
      // 添加%
      if (percent) value = `${value}%`
    }
    return (
      <span sx={sx} onClick={link ? () => navigate(link as string) : undefined}>
        {value}
        {suffix ?? null}
      </span>
    )
  }
  const children = (col as ColumnGroupType<T>).children
  return {
    ...args,
    children: children?.map(col => handleColumn(col, dicts, navigate)) ?? undefined,
    title: tooltip
      ? (...arrs) => (
          <span>
            {typeof title === 'function' ? title(...arrs) : title}
            <Tooltip title={tooltip} verticalAlign='middle' ml={1} cursor='pointer'>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        )
      : title,
    render,
    onCell: (record, index) => ({
      onDoubleClick: copyText,
      ...(onCellFunc ? onCellFunc(record, index) : {})
    })
  }
}

const handleActions = <T extends AnyObject = AnyObject>(
  actions: Action<T>[],
  actionFixed: TableProps['actionFixed'],
  actionTitle: TableProps['actionTitle'],
  actionWidth: TableProps['actionWidth']
): ColumnProps<T> | null => {
  if (!actions || actions.length === 0) return null
  return {
    title: actionTitle || '操作',
    dataIndex: '__actions',
    width: actionWidth,
    fixed: actionFixed ?? 'right',
    render: (_, record, index) => (
      <Space>
        {actions.map((action, i) => {
          let { title, visible = true, render, className, type, onClick, ...args } = action
          const show = typeof visible === 'function' ? visible(record, index) : visible
          if (!show) return null
          if (typeof render === 'function') title = render(record, index)
          if (typeof className === 'function') className = className(record, index)
          return (
            <Button
              key={i}
              p={0}
              type={type ?? 'link'}
              className={className}
              onClick={e => onClick?.(e, record, index)}
              {...args}
            >
              {title}
            </Button>
          )
        })}
      </Space>
    )
  }
}
export const useColumns = <T extends AnyObject = AnyObject>(
  columns: ColumnProps<T>[],
  actions?: Action<T>[],
  actionFixed?: TableProps['actionFixed'],
  actionTitle?: TableProps['actionTitle'],
  actionWidth?: TableProps['actionWidth']
): ColumnProps<T>[] => {
  const navigate = useNavigate()
  const dicts = useDicts()
  return useMemo(
    () =>
      columns
        .map(col => handleColumn(col, dicts, navigate))
        .concat(handleActions(actions || [], actionFixed, actionTitle, actionWidth) ?? []),
    [columns, actions, dicts, navigate, actionFixed, actionTitle, actionWidth]
  )
}

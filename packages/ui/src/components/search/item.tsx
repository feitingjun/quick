import { cloneElement, isValidElement } from 'react'
import dayjs, { Dayjs, isDayjs } from 'dayjs'
import { isNumber } from '@/utils'
import Form from '@/components/form'

type FormItemProps = React.ComponentProps<typeof Form.Item>

export interface SearchItemProps extends FormItemProps {
  /**搜索项占据的列数 */
  span?: number
  /**日期类型值的转换格式，默认YYYY-MM-DD HH:mm:ss */
  format?: string
  /**以数组形式接受多个值 */
  names?: string[]
}

// 判断是否是日期类型
const isDate = (value: string | undefined, format: string) => {
  if (!value) return false
  // YYYYMMDD这种格式则必须传入format来强制定义格式
  if (isNumber(value)) {
    return dayjs(value, format).isValid()
  }
  return dayjs(value).isValid()
}

// 字符串转换为日期格式
const parseDate = (value: (string | undefined) | (string | undefined)[], format: string) => {
  if (!value) return value
  if (Array.isArray(value)) {
    return value.map(v => (v && isDate(v, format) ? dayjs(v) : v))
  }
  return isDate(value, format) ? dayjs(value) : value
}

// 日期格式化为字符串
const formatDate = (value: Dayjs | Dayjs[] | undefined, format: string) => {
  if (!value) return value
  if (Array.isArray(value)) {
    return value.map(v => (isDayjs(v) ? v.format(format) : v))
  }
  return isDayjs(value) ? value.format(format) : value
}

const getFormat = (format: string | undefined, child: any) => {
  if (format) return format
  if (child?.props?.showTime) return 'YYYY-MM-DD HH:mm:ss'
  return 'YYYY-MM-DD'
}

export default function Item({
  span = 1,
  name,
  names,
  format,
  initialValue,
  children,
  ...props
}: SearchItemProps) {
  if (Array.isArray(initialValue) ? initialValue.some(i => isDayjs(i)) : isDayjs(initialValue)) {
    throw new Error('Search.Item 不接收 dayjs 类型的初始值，请使用字符串格式化日期')
  }

  if (names) {
    return (
      <Form.Item style={{ gridColumn: `span ${span * 2}` }} {...props}>
        {names.map((v, i) => (
          <Form.Item key={v} name={v} hidden noStyle initialValue={initialValue?.[i]} />
        ))}
        <Form.Item
          noStyle
          shouldUpdate={(preVal, nextVal) => {
            return names.some(n => preVal[n] !== nextVal[n])
          }}
        >
          {props => {
            const values = props.getFieldsValue(names)
            const child = typeof children === 'function' ? children(props) : children
            return isValidElement(child)
              ? cloneElement<any>(child, {
                  value: names.map(n => parseDate(values[n], getFormat(format, child))),
                  onChange: (originalValue: any) => {
                    const value = formatDate(originalValue, getFormat(format, child))
                    props.setFieldsValue(
                      names.reduce((acc, n, i) => ({ ...acc, [n]: value?.[i] }), {})
                    )
                  }
                })
              : child
          }}
        </Form.Item>
      </Form.Item>
    )
  }

  return (
    <Form.Item
      name={name}
      initialValue={initialValue}
      {...props}
      // 将children的值存入form
      getValueFromEvent={e => {
        const value = e?.currentTarget?.value ?? e?.target?.value ?? e
        return formatDate(value, getFormat(format, children))
      }}
      // 将form的值转换为children的值
      getValueProps={value => ({
        value: parseDate(value, getFormat(format, children))
      })}
    >
      {children}
    </Form.Item>
  )
}

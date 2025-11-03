import { DatePicker as AntdDatePicker } from 'antd'
import { styled } from '@quick/cssinjs'
export { default as RangePicker, type RangePickerProps } from './range-picker'

const DatePicker = styled(AntdDatePicker)

export type DatePickerProps = typeof DatePicker

export default DatePicker

import { DatePicker as AntdDatePicker, type DatePickerProps as AntdDatePickerProps } from 'antd'
import { styled, type StyledComponent } from '@quick/cssinjs'
export { default as RangePicker, type RangePickerProps } from './range-picker'

const DatePicker = styled(AntdDatePicker) as StyledComponent<AntdDatePickerProps>

export type DatePickerProps = typeof DatePicker

export default DatePicker

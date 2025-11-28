import { InputNumber as AntdInputNumber } from 'antd'
import { styled, type StyledComponent } from '@quick/cssinjs'

const InputNumber = styled(AntdInputNumber) as StyledComponent<typeof AntdInputNumber>

export type InputNumberProps = React.ComponentProps<typeof InputNumber>

export default InputNumber

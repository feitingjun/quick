import { InputNumber as AntdInputNumber, type InputNumberProps as AntdInputNumberProps } from 'antd'
import { styled, type StyledComponent } from '@quick/cssinjs'

const InputNumber = styled(AntdInputNumber) as StyledComponent<AntdInputNumberProps>

export type InputNumberProps = React.ComponentProps<typeof InputNumber>

export default InputNumber

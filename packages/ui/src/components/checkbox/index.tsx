import { Checkbox as AntdCheckbox, type CheckboxChangeEvent } from 'antd'
import { styled } from '@quick/cssinjs'

const { Group: AntdCheckboxGroup } = AntdCheckbox

const StyledCheckbox = styled(AntdCheckbox)
const StyledGroup = styled<typeof AntdCheckboxGroup<any>>(AntdCheckboxGroup)

type CompoundedComponent = typeof StyledCheckbox & {
  Group: typeof StyledGroup
}

const Checkbox = StyledCheckbox as CompoundedComponent
Checkbox.Group = StyledGroup

export type CheckboxProps = React.ComponentProps<typeof AntdCheckbox>
export type { CheckboxChangeEvent }
export default Checkbox

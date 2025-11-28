import { Form, type FormItemProps as AntdFormItemProps } from 'antd'
import { styled, type StyledComponent } from '@quick/cssinjs'

const StyledItem = styled(Form.Item) as StyledComponent<AntdFormItemProps>
type CompoundedComponent = typeof StyledItem & {
  useStatus: typeof Form.Item.useStatus
}
const Item = StyledItem as CompoundedComponent
Item.useStatus = Form.Item.useStatus

export default Item

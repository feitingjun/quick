import { Form } from 'antd'
import { styled } from '@quick/cssinjs'

const StyledItem = styled<typeof Form.Item<any>>(Form.Item)
type CompoundedComponent = typeof StyledItem & {
  useStatus: typeof Form.Item.useStatus
}
const Item = StyledItem as CompoundedComponent
Item.useStatus = Form.Item.useStatus

export default Item

import { Tooltip as AntdTooltip, type TooltipProps as AntdTooltipProps } from 'antd'
import { styled, type StyledComponent } from '@quick/cssinjs'

const Tooltip = styled(AntdTooltip) as StyledComponent<AntdTooltipProps>

export type TooltipProps = React.ComponentProps<typeof Tooltip>

export default Tooltip

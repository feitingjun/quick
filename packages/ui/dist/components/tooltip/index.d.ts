import * as _quick_cssinjs from '@quick/cssinjs';
import * as react from 'react';
import * as antd_es_tooltip from 'antd/es/tooltip';
import * as antd from 'antd';

declare const Tooltip: react.FC<_quick_cssinjs.StyledComponentProps<antd.TooltipProps & react.RefAttributes<antd_es_tooltip.TooltipRef>, {}>>;
type TooltipProps = React.ComponentProps<typeof Tooltip>;

export { Tooltip, type TooltipProps };

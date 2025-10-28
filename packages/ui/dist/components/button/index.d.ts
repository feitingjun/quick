import * as _quick_cssinjs from '@quick/cssinjs';
import * as react from 'react';
import { ComponentProps } from 'react';
import * as antd from 'antd';

declare const Button: react.FC<_quick_cssinjs.StyledComponentProps<antd.ButtonProps & react.RefAttributes<HTMLAnchorElement | HTMLButtonElement>, {}>>;
type ButtonProps = ComponentProps<typeof Button>;

export { Button, type ButtonProps };

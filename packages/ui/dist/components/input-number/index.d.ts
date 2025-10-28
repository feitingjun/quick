import * as _quick_cssinjs from '@quick/cssinjs';
import * as react from 'react';
import * as antd from 'antd';
import * as rc_input_number from 'rc-input-number';

declare const InputNumber: react.FC<_quick_cssinjs.StyledComponentProps<antd.InputNumberProps<rc_input_number.ValueType> & {
    children?: react.ReactNode | undefined;
} & react.RefAttributes<HTMLInputElement>, {}>>;
type InputNumberProps = React.ComponentProps<typeof InputNumber>;

export { InputNumber, type InputNumberProps };

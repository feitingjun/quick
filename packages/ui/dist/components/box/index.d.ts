import * as _quick_cssinjs from '@quick/cssinjs';
import * as react from 'react';
import { ComponentProps } from 'react';

declare const StyledBox: react.FC<_quick_cssinjs.StyledComponentProps<react.DetailedHTMLProps<react.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>>;
type BoxProps = ComponentProps<typeof StyledBox> & {
    as?: keyof React.JSX.IntrinsicElements;
};
declare const Box: (props: BoxProps) => _quick_cssinjs.JSX.Element;

export { Box, type BoxProps };

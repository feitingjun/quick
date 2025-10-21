import * as react from 'react';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import { S as SxProps } from './types-jh6CJxoN.js';
import 'csstype';

declare namespace JSX {
    type IntrinsicElements = {
        [K in keyof React.JSX.IntrinsicElements]: React.JSX.IntrinsicElements[K] & {
            sx?: SxProps;
        };
    };
    interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {
    }
}
declare const jsx: typeof ReactJSXRuntime.jsx;
declare const jsxs: typeof ReactJSXRuntime.jsxs;
declare const Fragment: react.ExoticComponent<react.FragmentProps>;

export { Fragment, JSX, jsx, jsxs };

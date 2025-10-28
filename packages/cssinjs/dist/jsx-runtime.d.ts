import * as react from 'react';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import { e as SxProps$1, T as Theme } from './types-B497DypH.js';
import 'csstype';
import './styled-system/native-css.js';
import './custom-pseudos.js';

type SxProps = SxProps$1 | ((theme: Theme) => SxProps$1);
type WithConditionalCSSProp<P> = 'className' extends keyof P ? string extends P['className' & keyof P] ? {
    sx?: SxProps;
} : {} : {};
declare namespace JSX {
    type ElementType = React.JSX.ElementType;
    interface Element extends React.JSX.Element {
    }
    interface ElementClass extends React.JSX.ElementClass {
    }
    interface ElementAttributesProperty extends React.JSX.ElementAttributesProperty {
    }
    interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {
    }
    type LibraryManagedAttributes<C, P> = P extends unknown ? WithConditionalCSSProp<P> & React.JSX.LibraryManagedAttributes<C, P> : never;
    interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {
    }
    interface IntrinsicClassAttributes<T> extends React.JSX.IntrinsicClassAttributes<T> {
    }
    type IntrinsicElements = {
        [K in keyof React.JSX.IntrinsicElements]: React.JSX.IntrinsicElements[K] & {
            sx?: SxProps;
        };
    };
}
declare const jsx: typeof ReactJSXRuntime.jsx;
declare const jsxs: typeof ReactJSXRuntime.jsxs;
declare const Fragment: react.ExoticComponent<react.FragmentProps>;

export { Fragment, JSX, jsx, jsxs };

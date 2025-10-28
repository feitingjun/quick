import * as react from 'react';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import { e as SxProps, T as Theme } from './types-B497DypH.js';
import 'csstype';
import './styled-system/native-css.js';
import './custom-pseudos.js';

type SxFn = SxProps | ((theme: Theme) => SxProps);
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
    type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>;
    interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {
    }
    interface IntrinsicClassAttributes<T> extends React.JSX.IntrinsicClassAttributes<T> {
    }
    type IntrinsicElements = {
        [K in keyof React.JSX.IntrinsicElements]: React.JSX.IntrinsicElements[K] & {
            sx?: SxFn;
        };
    };
}
declare const jsx: typeof ReactJSXRuntime.jsx;
declare const jsxs: typeof ReactJSXRuntime.jsxs;
declare const Fragment: react.ExoticComponent<react.FragmentProps>;

export { Fragment, JSX, jsx, jsxs };

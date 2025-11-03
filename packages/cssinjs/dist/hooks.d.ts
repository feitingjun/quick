import { DistributiveOmit, PropsOf } from '@emotion/react';
export { Keyframes, keyframes } from '@emotion/react';
import { T as Theme } from './types-B-_E467N.js';
import 'csstype';
import './styled-system/native-css.js';
import './custom-pseudos.js';

declare function useTheme(): Theme;
declare function withTheme<C extends React.ComponentType<React.ComponentProps<C>>>(Component: C): React.ForwardRefExoticComponent<DistributiveOmit<PropsOf<C>, 'theme'> & {
    theme?: Theme;
}>;

declare const ThemeContext: React.Context<Theme>;
interface ThemeProviderProps {
    theme: Partial<Theme> | ((outerTheme: Theme) => Theme);
    children: React.ReactNode;
}
declare const ThemeProvider: React.FC<ThemeProviderProps>;
type WithTheme<P, T> = P extends {
    theme: infer Theme;
} ? P & {
    theme: Exclude<Theme, undefined>;
} : P & {
    theme: T;
};

export { ThemeContext, ThemeProvider, type ThemeProviderProps, type WithTheme, useTheme, withTheme };

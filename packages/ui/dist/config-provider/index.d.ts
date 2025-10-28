import * as _quick_cssinjs from '@quick/cssinjs';
import { Theme } from '../theme/types.js';
import { Dicts } from '../dicts/types.js';

interface ConfigProviderProps {
    theme?: Theme;
    dicts?: Dicts;
    children?: React.ReactNode;
}
declare function ConfigProvider({ theme, dicts, children }: ConfigProviderProps): _quick_cssinjs.JSX.Element;

export { ConfigProvider, type ConfigProviderProps };

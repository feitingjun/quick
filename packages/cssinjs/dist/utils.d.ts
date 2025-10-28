import { T as Theme, e as SxProps, h as ThemeDefine } from './types-B497DypH.js';
import 'csstype';
import './styled-system/native-css.js';
import './custom-pseudos.js';

/**判断是否为styled-system属性 */
declare function isSystemProp(prop: string): boolean;
/**判断是否为可接受的css属性 */
declare function isCssProp(prop: string): boolean;
/**将大括号包裹的css属性值(如{bg: '{colors.primary}'})转换为主题变量 */
declare function getThemeValue(value: any, theme: Theme): any;
/**将styled-system对象处理为css样式对象 */
declare function transform(sx: SxProps, theme: Theme): Record<string, any> | {
    [k: string]: any;
};
/**转换媒体查询 */
declare function transformMediaQueries(breakpoint: string, theme: {
    breakpoints?: string[] | {
        [size: string]: string;
    };
}): string | undefined;
/**合并对象 */
declare function merge<T extends object[]>(...objects: T): T[number];
declare const defineTheme: <T extends ThemeDefine>(theme: T) => T;
/**合并多个classname */
declare function cx(...classNames: string[]): string;

export { cx, defineTheme, getThemeValue, isCssProp, isSystemProp, merge, transform, transformMediaQueries };

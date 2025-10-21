import { T as Theme, S as SxProps } from './types-jh6CJxoN.js';
import 'csstype';

/**判断是否为styled-system属性 */
declare function isSystemProp(prop: string): boolean;
/**判断是否为可接受的css属性 */
declare function isCssProp(prop: string): boolean;
/**将大括号包裹的css属性值(如{bg: '{colors.primary}'})转换为主题变量 */
declare function getThemeValue(value: any, theme: Theme): any;
declare function transform(sx: SxProps, theme: Theme): any;
declare function transformMediaQueries(breakpoint: string, theme: {
    breakpoints?: string[] | {
        [size: string]: string;
    };
}): string | undefined;
declare function deepMerge<T extends object[]>(...objects: T): T[number];

export { deepMerge, getThemeValue, isCssProp, isSystemProp, transform, transformMediaQueries };

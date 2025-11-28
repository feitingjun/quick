import { e as SxProps, T as Theme, d as ComponentCssStyles } from './types-B-_E467N.js';
import 'csstype';
import './styled-system/native-css.js';
import './custom-pseudos.js';

/**变体(variants)定义 */
type VariantsProps = {
    [key: string]: {
        [key: string]: SxProps;
    };
};
/**styled函数的第二个参数返回类型 */
type StyledProps<T extends VariantsProps = VariantsProps> = {
    base?: SxProps;
    variants?: T;
    defaultVariants?: {
        [K in keyof T]?: keyof T[K];
    };
};
/**样式函数参数类型，支持对象或函数形式 */
type RecipeProps<C extends keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<any>, T extends VariantsProps = VariantsProps> = StyledProps<T> | ((props: {
    theme?: Theme;
} & React.ComponentProps<C>) => StyledProps<T>);
type PresetProp<T extends {
    presets?: Record<string, any>;
} = {
    presets?: any;
}> = T['presets'] extends Record<string, any> ? {
    preset?: keyof T['presets'];
} : {};
/**合并原始 props 和 SxProps */
type StyledComponentProps<P, V extends VariantsProps = {}> = Omit<P, keyof ComponentCssStyles> & ComponentCssStyles & {
    [K in keyof V]?: keyof V[K] extends 'true' ? boolean : keyof V[K];
} & PresetProp<Theme>;
type StyledComponent<P, V extends VariantsProps = {}> = React.FC<StyledComponentProps<P, V>>;
/**使用styled创建的组件，样式相关prop将会被过滤，不会传递给children*/
declare function styled<C extends React.JSXElementConstructor<any>, V extends VariantsProps = {}>(component: C, recipes?: RecipeProps<C, V>): StyledComponent<React.ComponentProps<C>, V>;
declare function styled<Tag extends keyof React.JSX.IntrinsicElements, T extends VariantsProps = {}>(component: Tag, recipes?: RecipeProps<Tag, T>): StyledComponent<React.ComponentProps<Tag>, T>;

export { type RecipeProps, type StyledComponent, type StyledComponentProps, type StyledProps, type VariantsProps, styled };

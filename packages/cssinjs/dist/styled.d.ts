import { S as SxProps, T as Theme } from './types-jh6CJxoN.js';
import 'csstype';

type VariantsProps = {
    [key: string]: {
        [key: string]: SxProps;
    };
};
type StyledProps<T extends VariantsProps = VariantsProps> = {
    base?: SxProps;
    variants?: T;
    defaultVariants?: {
        [K in keyof T]?: keyof T[K];
    };
};
type RecipeProps<T extends VariantsProps = VariantsProps> = StyledProps<T> | ((props: {
    theme?: Theme;
}) => StyledProps<T>);
type ComponentPropsType<C> = C extends React.ComponentType<infer P> ? P : C extends keyof React.JSX.IntrinsicElements ? React.JSX.IntrinsicElements[C] : {};
type PresetProp<T extends {
    presets?: Record<string, any>;
} = {
    presets?: any;
}> = T['presets'] extends Record<string, any> ? {
    preset?: keyof T['presets'];
} : {};
type StyledComponentProps<C, V extends VariantsProps> = Omit<ComponentPropsType<C>, keyof SxProps> & SxProps & {
    children?: React.ReactNode;
    sx?: SxProps;
} & {
    [K in keyof V]?: keyof V[K] extends 'true' ? boolean : keyof V[K];
} & PresetProp<Theme>;
/**使用styled创建的组件，样式相关prop将会被过滤，不会传递给children*/
declare function styled<C extends React.ComponentType<any> | React.ForwardRefExoticComponent<any>, T extends VariantsProps = {}>(component: C, recipes?: RecipeProps<T>): React.FC<StyledComponentProps<C, T>>;
declare function styled<Tag extends keyof React.JSX.IntrinsicElements, T extends VariantsProps = {}>(component: Tag, recipes?: RecipeProps<T>): React.FC<StyledComponentProps<Tag, T>>;

export { type ComponentPropsType, type RecipeProps, type StyledComponentProps, type StyledProps, type VariantsProps, styled };

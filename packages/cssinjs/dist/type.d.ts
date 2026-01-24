import { DefaultTheme, SystemStyleObject, MUIStyledCommonProps, MuiStyledOptions } from '@mui/system';
import { FilteringStyledOptions } from '@mui/styled-engine';
import { PropsOf } from '@emotion/react';
import { StyledComponent, StyledOptions } from '@emotion/styled';

type SxProps<Theme extends object = {}, ComponentProps extends object = {}> = SystemStyleObject<Theme> | ((props: MUIStyledCommonProps & ComponentProps) => SystemStyleObject<Theme>) | ReadonlyArray<boolean | SystemStyleObject<Theme> | ((props: MUIStyledCommonProps & ComponentProps) => SystemStyleObject<Theme>)>;
interface CreateStyledComponent<ComponentProps extends {}, SpecificComponentProps extends {} = {}, JSXProps extends {} = {}, T extends object = {}> {
    (...styles: Array<SxProps<T>>): StyledComponent<ComponentProps, SpecificComponentProps, JSXProps>;
    /**
     * @typeparam AdditionalProps  Additional props to add to your styled component
     */
    <AdditionalProps extends {}>(...styles: Array<SxProps<T, ComponentProps & AdditionalProps>>): StyledComponent<ComponentProps & AdditionalProps, SpecificComponentProps, JSXProps>;
    (template: TemplateStringsArray, ...styles: Array<SxProps<T, ComponentProps & SpecificComponentProps>>): StyledComponent<ComponentProps, SpecificComponentProps, JSXProps>;
    /**
     * @typeparam AdditionalProps  Additional props to add to your styled component
     */
    <AdditionalProps extends {}>(template: TemplateStringsArray, ...styles: Array<SxProps<ComponentProps & SpecificComponentProps & AdditionalProps>>): StyledComponent<ComponentProps & AdditionalProps, SpecificComponentProps, JSXProps>;
}
interface CreateMUIStyledStyledEngine<MUIStyledCommonProps extends {}, MuiStyledOptions, Theme extends object> {
    <C extends React.ComponentClass<React.ComponentProps<C>>, ForwardedProps extends keyof React.ComponentProps<C> = keyof React.ComponentProps<C>>(component: C, options: FilteringStyledOptions<React.ComponentProps<C>, ForwardedProps> & MuiStyledOptions): CreateStyledComponent<Pick<PropsOf<C>, ForwardedProps> & MUIStyledCommonProps, {}, {
        ref?: React.Ref<InstanceType<C>>;
    }, Theme>;
    <C extends React.ComponentClass<React.ComponentProps<C>>>(component: C, options?: StyledOptions<PropsOf<C> & MUIStyledCommonProps> & MuiStyledOptions): CreateStyledComponent<PropsOf<C> & MUIStyledCommonProps, {}, {
        ref?: React.Ref<InstanceType<C>>;
    }, Theme>;
    <C extends React.JSXElementConstructor<React.ComponentProps<C>>, ForwardedProps extends keyof React.ComponentProps<C> = keyof React.ComponentProps<C>>(component: C, options: FilteringStyledOptions<React.ComponentProps<C>, ForwardedProps> & MuiStyledOptions): CreateStyledComponent<Pick<PropsOf<C>, ForwardedProps> & MUIStyledCommonProps, {}, {}, Theme>;
    <C extends React.JSXElementConstructor<React.ComponentProps<C>>>(component: C, options?: StyledOptions<PropsOf<C> & MUIStyledCommonProps> & MuiStyledOptions): CreateStyledComponent<PropsOf<C> & MUIStyledCommonProps, {}, {}, Theme>;
    <Tag extends keyof React.JSX.IntrinsicElements, ForwardedProps extends keyof React.JSX.IntrinsicElements[Tag] = keyof React.JSX.IntrinsicElements[Tag]>(tag: Tag, options: FilteringStyledOptions<React.JSX.IntrinsicElements[Tag], ForwardedProps> & MuiStyledOptions): CreateStyledComponent<MUIStyledCommonProps, Pick<React.JSX.IntrinsicElements[Tag], ForwardedProps>, {}, Theme>;
    <Tag extends keyof React.JSX.IntrinsicElements>(tag: Tag, options?: StyledOptions<MUIStyledCommonProps> & MuiStyledOptions): CreateStyledComponent<MUIStyledCommonProps, React.JSX.IntrinsicElements[Tag], {}, Theme>;
}
type CreateMUIStyled<Theme extends object = DefaultTheme> = CreateMUIStyledStyledEngine<MUIStyledCommonProps<Theme>, MuiStyledOptions, Theme>;

export type { CreateMUIStyled, CreateMUIStyledStyledEngine, CreateStyledComponent, SxProps };

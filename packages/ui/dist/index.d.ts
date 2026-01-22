import * as _quick_cssinjs from '@quick/cssinjs';
import { SxProps, StyledComponent, StyledComponentProps, ComponentCssStyles } from '@quick/cssinjs';
export { useTheme } from '@quick/cssinjs';
import * as react from 'react';
import { ComponentProps } from 'react';
import * as antd from 'antd';
import { Space as Space$1, TooltipProps as TooltipProps$1, FormItemProps as FormItemProps$2, Form as Form$1, FormProps as FormProps$1, Input as Input$1, InputNumberProps as InputNumberProps$1, DatePickerProps as DatePickerProps$1, TableProps as TableProps$1, TableColumnType, Dropdown as Dropdown$1, Popover as Popover$1, Checkbox as Checkbox$1 } from 'antd';
export { FormInstance } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import * as antd_es_form_hooks_useFormInstance from 'antd/es/form/hooks/useFormInstance';
import * as antd_es_form_Form from 'antd/es/form/Form';
import * as antd_es_form from 'antd/es/form';
import * as antd_es_form_context from 'antd/es/form/context';
import * as antd_es_tooltip from 'antd/es/tooltip';
import * as antd_es_checkbox from 'antd/es/checkbox';
import * as axios from 'axios';
import { ResponseType, AxiosRequestConfig } from 'axios';
import { RangePickerProps as RangePickerProps$1 } from 'antd/es/date-picker';

type DeepRequired<T> = {
    [K in keyof T]-?: DeepRequired<T[K]>;
};

interface Theme {
    /**颜色配置 */
    colors?: {
        /**基础组件背景 */
        bg?: string;
        /**layout背景,浅灰 */
        bgLayout?: string;
        /**主题颜色 */
        primary?: string;
        /**成功颜色 */
        success?: string;
        /**警告颜色 */
        warning?: string;
        /**错误颜色 */
        error?: string;
        /**信息颜色 */
        info?: string;
        /**link颜色 */
        link?: string;
        /**主文本颜色 */
        text?: string;
        /**次文本颜色 */
        secondary?: string;
        /**边框颜色 */
        border?: string;
        /**次级边框颜色 */
        borderSecondary?: string;
        /**禁用文字颜色 */
        disabled?: string;
    };
    /**媒体查询配置 */
    breakpoints?: {
        /**默认480px */
        sm?: string;
        /**默认768px */
        md?: string;
        /**默认1024px */
        lg?: string;
        /**默认1280px */
        xl?: string;
        /**默认1440px */
        '2xl'?: string;
    };
    /**基础间距，默认4px
     ** margin，padding，gap相关属性值为number类型时，会转换为 n * space
     **/
    space?: number;
    sizes?: {
        /**基础控件高度 */
        controlHeight?: number;
        /**较高组件高度 */
        controlHeightLg?: number;
        /**较小组件高度 */
        controlHeightSm?: number;
        /**更小的组件高度 */
        controlHeightXs?: number;
    };
    fontSizes?: {
        /**小文字，默认12px */
        caption?: number;
        /**正文，默认14px */
        body?: number;
        /**小标题，默认16px */
        subtitle?: number;
        /**标题，默认18px */
        title?: number;
        /**大标题，默认20px */
        heading?: number;
        /**超大字体，默认24px */
        display?: number;
    };
    /**字重 */
    fontWeights?: {
        /**默认400 */
        body?: number;
        /**默认700 */
        bold?: number;
    };
    /**行高 */
    lineHeights?: {
        /**默认1.5 */
        body?: number;
        /**默认1.125 */
        heading?: number;
    };
    /**边框 */
    borders?: {
        none?: 'none';
        /**默认边框，默认1px */
        normal?: string;
        /**宽边框，默认2px */
        thick?: string;
        /**虚线边框 */
        dotted?: string;
        /**宽虚线边框，默认2px */
        thickDotted?: string;
    };
    /**圆角 */
    radii?: {
        none?: number;
        /**默认2px */
        xs?: number;
        /**默认4px */
        sm?: number;
        /**默认6px */
        md?: number;
    };
    /**阴影 */
    shadows?: {
        none?: 'none';
        /**默认阴影 */
        box?: string;
        /**二级阴影 */
        secondary?: string;
        /**三级阴影 */
        tertiary?: string;
    };
    /**z-index */
    zIndices?: {
        hide?: number;
        base?: number;
        docked?: number;
        dropdown?: number;
        sticky?: number;
        banner?: number;
        overlay?: number;
        modal?: number;
        popover?: number;
        tooltip?: number;
        toast?: number;
        max?: number;
    };
    presets?: {
        [key: string]: SxProps;
    };
}
type UITheme = DeepRequired<Omit<Theme, 'presets'>>;
declare module '@quick/cssinjs' {
    interface Theme extends UITheme {
    }
}

declare const defaultTheme: Omit<DeepRequired<Theme>, 'presets'>;

declare const defineTheme: <T extends Theme>(theme: T) => T;

type TableStatus = 'success' | 'error' | 'waiting' | 'invalid' | 'default' | 'completed';
interface DictItem {
    label: string | number;
    value: any;
    status?: TableStatus;
}
interface Dicts {
    [key: string]: DictItem[];
}
type DictCode = keyof Dicts;

/**获取全部的字典数据 */
declare function useDicts(): Dicts;
/**根据code获取字典列表数据 */
declare function useDict<T extends DictCode>(code: T): Dicts[T];
/**根据code和value获取字典的某一项 */
declare function useDictItem<T extends DictCode>(code: T, value: Dicts[T][number]['value']): DictItem | undefined;
/**根据字典code和value获取字典的label */
declare function useDictLabel<T extends DictCode>(code: T, value: Dicts[T][number]['value']): string | number | undefined;
/**根据字典code和value获取字典的status */
declare function useDictStatus<T extends DictCode>(code: T, value: Dicts[T][number]['value']): TableStatus | undefined;

declare const defineDicts: <T extends Dicts>(dicts: T) => T;

interface ConfigProviderProps {
    theme?: Theme;
    dicts?: Dicts;
    children?: React.ReactNode;
}
/**注册全局静态方法 */
declare function Register({ children }: {
    children: React.ReactNode;
}): react.ReactNode;
declare function ConfigProvider({ theme, dicts, children }: ConfigProviderProps): _quick_cssinjs.JSX.Element;

declare const Button: _quick_cssinjs.StyledComponent<antd.ButtonProps & react.RefAttributes<HTMLAnchorElement | HTMLButtonElement>, {}>;
type ButtonProps = ComponentProps<typeof Button>;

declare const StyledBox: _quick_cssinjs.StyledComponent<react.DetailedHTMLProps<react.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>;
type BoxProps = ComponentProps<typeof StyledBox> & {
    as?: keyof React.JSX.IntrinsicElements;
};
declare const Box: (props: BoxProps) => _quick_cssinjs.JSX.Element;

declare const Space: _quick_cssinjs.StyledComponent<antd.SpaceProps & react.RefAttributes<HTMLDivElement>, {}>;
type SpaceProps = typeof Space$1;

declare const Tooltip: StyledComponent<TooltipProps$1>;
type TooltipProps = React.ComponentProps<typeof Tooltip>;

declare let message: MessageInstance;

declare const StyledItem: StyledComponent<FormItemProps$2>;
type CompoundedComponent$3 = typeof StyledItem & {
    useStatus: typeof Form$1.Item.useStatus;
};
declare const Item$1: CompoundedComponent$3;

declare const ErrorList: _quick_cssinjs.StyledComponent<antd_es_form.ErrorListProps, {}>;

declare const Provider: _quick_cssinjs.StyledComponent<antd_es_form_context.FormProviderProps, {}>;

declare const useForm: typeof antd_es_form_Form.useForm;
declare const useFormInstance: typeof antd_es_form_hooks_useFormInstance.default;
declare const useWatch: typeof antd_es_form_Form.useWatch;
declare const StyledForm: StyledComponent<FormProps$1>;
type CompoundedComponent$2 = typeof StyledForm & {
    Item: typeof Item$1;
    List: typeof Form$1.List;
    ErrorList: typeof ErrorList;
    Provider: typeof Provider;
    useForm: typeof useForm;
    useFormInstance: typeof useFormInstance;
    useWatch: typeof useWatch;
};
declare const Form: CompoundedComponent$2;
type FormProps = React.ComponentProps<typeof StyledForm>;
type FormItemProps$1 = React.ComponentProps<typeof Item$1>;
type FormListProps = React.ComponentProps<typeof Form$1.List>;
type FormErrorListProps = React.ComponentProps<typeof ErrorList>;
type FormProviderProps = React.ComponentProps<typeof Provider>;

interface SearchProps extends FormProps {
    okText?: React.ReactNode;
    resetText?: React.ReactNode;
    initLoad?: boolean;
    onSearch?: (values: Record<string, any>) => void | Promise<void>;
    onReset?: () => Promise<void> | void;
    colWidth?: number;
}
declare function Search$1({ children, okText, resetText, initLoad, onSearch, onReset, colWidth, size, form: externalForm, initialValues, ...props }: SearchProps): _quick_cssinjs.JSX.Element;

type FormItemProps = React.ComponentProps<typeof Form.Item>;
interface SearchItemProps extends FormItemProps {
    /**搜索项占据的列数 */
    span?: number;
    /**日期类型值的转换格式，默认YYYY-MM-DD HH:mm:ss */
    format?: string;
    /**以数组形式接受多个值 */
    names?: string[];
}
declare function Item({ span, name, names, format, initialValue, children, ...props }: SearchItemProps): _quick_cssinjs.JSX.Element;

type CompoundedComponent$1 = typeof Search$1 & {
    Item: typeof Item;
};
declare const Search: CompoundedComponent$1;

declare const Input: _quick_cssinjs.StyledComponent<antd.InputProps & react.RefAttributes<antd.InputRef>, {}>;
type InputProps = React.ComponentProps<typeof Input$1>;

declare const InputNumber: StyledComponent<InputNumberProps$1>;
type InputNumberProps = React.ComponentProps<typeof InputNumber>;

declare const StyledRangePicker: StyledComponent<RangePickerProps$1>;
type RangePickerProps = React.ComponentProps<typeof StyledRangePicker>;
declare function RangePicker({ showTime, allowEmpty, ...props }: RangePickerProps): _quick_cssinjs.JSX.Element;

declare const DatePicker: StyledComponent<DatePickerProps$1>;
type DatePickerProps = typeof DatePicker;

type AnyObject = Record<string, any>;
type SummaryStatus = 'success' | 'error' | 'default';
interface SummaryProps {
    precision?: number | boolean;
    /**小数位数不足时是否补零，为 true 时默认为 precision 的值 */
    zerofill?: number | boolean;
    /**是否以百分比的形式显示 */
    percent?: boolean;
    /**千分位 */
    thousand?: boolean;
    /**格式化函数 */
    formatter?: (value: any) => any;
    /**显示状态 */
    status?: SummaryStatus | ((num: any) => SummaryStatus);
    className?: string | ((num: any) => string);
}
type ColumnStatus<RecordType extends AnyObject = AnyObject> = false | null | TableStatus | ((value: any, record: RecordType, index: number) => TableStatus | false | null);
interface ColumnType<RecordType extends AnyObject = AnyObject> extends TableColumnType<RecordType> {
    /**颜色状态，为 false | null 时不显示任何颜色*/
    status?: ColumnStatus<RecordType>;
    /**是否加粗字体 */
    bold?: boolean | ((value: any, record: RecordType, index: number) => boolean);
    /**是否显示千分位 */
    thousand?: boolean | ((value: any, record: RecordType, index: number) => boolean);
    /**点击跳转的地址 */
    link?: string | null | ((value: any, record: RecordType, index: number) => string | null);
    /**小数保留位数，为 true 时默认为 2 */
    precision?: number | boolean;
    /**小数位数不足时是否补零，为 true 时默认为 precision 的值 */
    zerofill?: number | boolean;
    /**是否以百分比的形式显示 */
    percent?: boolean;
    /**后缀 */
    suffix?: React.ReactNode;
    /**表头title的提示 */
    tooltip?: React.ReactNode;
    /**是否有合计（不能是第一列数据，第一列显示 '合计' 字样） */
    total?: boolean | SummaryProps;
    /**合计字段 */
    totalField?: string;
    /**排序时使用的字段名称(默认为 dataIndex) */
    sorterField?: string;
    /**数据字典的code */
    dictCode?: DictCode;
}
interface ColumnGroupType<RecordType extends AnyObject = AnyObject> extends Omit<ColumnType<RecordType>, 'dataIndex'> {
    children?: ColumnType<RecordType>[];
}
type ColumnProps<RecordType extends AnyObject = AnyObject> = ColumnType<RecordType> | ColumnGroupType<RecordType>;
interface Action$2<RecordType extends AnyObject = AnyObject> extends Omit<ButtonProps, keyof SxProps | 'className' | 'title' | 'onClick'> {
    title?: React.ReactNode;
    onClick?: (e: React.MouseEvent, record: RecordType, index: number) => void;
    visible?: boolean | ((record: RecordType, index: number) => boolean);
    render?: (record: RecordType, index: number) => React.ReactNode;
    className?: string | ((record: RecordType, index: number) => string);
}
interface TableProps<RecordType extends AnyObject = AnyObject> extends StyledComponentProps<TableProps$1<RecordType>> {
    columns?: ColumnProps<RecordType>[];
    /**操作栏内容 */
    actions?: Action$2<RecordType>[];
    /**操作栏宽度 */
    actionWidth?: number;
    /**操作栏位置 */
    actionFixed?: 'left' | 'right';
    /**操作栏标题 */
    actionTitle?: React.ReactNode;
    /**服务器返回的合计数据 */
    summaryMap?: Record<string, number>;
}

declare function Table<T extends AnyObject = AnyObject>({ columns, actionFixed, actionTitle, actionWidth, actions, summaryMap, rowSelection, rowKey, ...props }: TableProps<T>): _quick_cssinjs.JSX.Element;

/**仅在 dataSource[number] 类型未知时使用，通过columns内容自动推断 dataSource[number] 的类型  */
declare function defineColumns<const T extends ColumnProps<AnyObject>[]>(columns: T): ColumnProps<{ [K in T[number] extends {
    dataIndex: string;
} ? T[number]["dataIndex"] : never]: any; } & AnyObject>[];

interface Action$1 extends Omit<ButtonProps, keyof SxProps | 'title'> {
    title?: React.ReactNode;
}

type Action<RecordType extends AnyObject = AnyObject> = Action$1 | (Action$2<RecordType> & {
    display: 'table';
});
type PageProps<RecordType extends AnyObject = AnyObject> = ComponentCssStyles & Omit<TableProps<RecordType>, 'actions' | 'summaryMap'> & Omit<SearchProps, 'onSearch'> & {
    /**请求路径 */
    url?: string;
    /**请求方式 */
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
    /**请求参数位置，get默认是query，其它默认是body */
    paramsLocation?: 'query' | 'body';
    /**额外的请求参数 */
    params?: Record<string, any>;
    /**数据请求完成后的回调，data为经过request.internalResponseHandler处理后的数据 */
    onRequestComplete?: (data: any) => RecordType[] | Promise<RecordType[]>;
    onSearch?: (values: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>;
    colWidth?: number;
    /**页面操作按钮 */
    actions?: Action<RecordType>[];
    /**是否显示工具栏 */
    showTool?: boolean;
};
declare function Page<RecordType extends AnyObject = AnyObject>({ okText, resetText, initLoad, url, method, paramsLocation, params, onRequestComplete, onSearch: onSearchPage, onReset: onResetPage, dataSource: propsDataSource, colWidth, children, initialValues, form, size: defaultSize, actions, showTool, columns, ...props }: PageProps<RecordType>): _quick_cssinjs.JSX.Element;

declare const Dropdown: _quick_cssinjs.StyledComponent<antd.DropDownProps, {}>;
type DropdownProps = React.ComponentProps<typeof Dropdown$1>;

declare const Popover: _quick_cssinjs.StyledComponent<antd.PopoverProps & react.RefAttributes<antd_es_tooltip.TooltipRef>, {}>;
type PopoverProps = React.ComponentProps<typeof Popover$1>;

declare const StyledCheckbox: _quick_cssinjs.StyledComponent<antd.CheckboxProps & react.RefAttributes<antd.CheckboxRef>, {}>;
declare const StyledGroup: _quick_cssinjs.StyledComponent<antd_es_checkbox.CheckboxGroupProps<any> & react.RefAttributes<HTMLDivElement>, {}>;
type CompoundedComponent = typeof StyledCheckbox & {
    Group: typeof StyledGroup;
};
declare const Checkbox: CompoundedComponent;
type CheckboxProps = React.ComponentProps<typeof Checkbox$1>;

declare module 'axios' {
    interface AxiosRequestConfig {
        skipErrorHandler?: boolean;
    }
}
interface RequestInit {
    /**请求基础路径 */
    baseURL?: string;
    /**额外的请求头信息 */
    headers?: Record<string, string>;
    /**请求超时时间 */
    timeout?: number;
    /**响应数据格式，默认json */
    responseType?: ResponseType;
    /**根据服务器返回数据自定义错误，返回null时表示没有错误 */
    responseError?: (data: any) => string | null;
    /**为带数据请求功能的组件定义统一的response处理 */
    internalResponseHandler?: {
        all?: (data: any) => any;
        select?: (data: any) => Record<string, any>[];
        page?: (data: any) => {
            dataSource: Record<string, any>[];
            total: number;
            pageSize: number;
            page: number;
        };
    };
}
declare const request: {
    _internalResponseHandler: RequestInit["internalResponseHandler"];
    /**初始化配置 */
    init(config: RequestInit): void;
    request: <T = any>(config: AxiosRequestConfig<T>) => Promise<T | undefined>;
    get: <T = any>(url: string, config?: AxiosRequestConfig<T>) => Promise<T | undefined>;
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig<T>) => Promise<T | undefined>;
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig<T>) => Promise<T | undefined>;
    delete: <T = any>(url: string, config?: AxiosRequestConfig<T>) => Promise<T | undefined>;
    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig<T>) => Promise<T | undefined>;
    all: typeof axios.all;
    spread: typeof axios.spread;
};

export { Box, type BoxProps, Button, type ButtonProps, Checkbox, type CheckboxProps, type ColumnProps, type ColumnStatus, ConfigProvider, type ConfigProviderProps, DatePicker, type DatePickerProps, type DictCode, type DictItem, type Dicts, Dropdown, type DropdownProps, Form, type FormErrorListProps, type FormItemProps$1 as FormItemProps, type FormListProps, type FormProps, type FormProviderProps, Input, InputNumber, type InputNumberProps, type InputProps, Page, type Action as PageAction, type PageProps, Popover, type PopoverProps, RangePicker, type RangePickerProps, Register, Search, type SearchItemProps, type SearchProps, Space, type SpaceProps, type SummaryProps, Table, type Action$2 as TableAction, type TableProps, type TableStatus, type Theme, Tooltip, type TooltipProps, defaultTheme, defineColumns, defineDicts, defineTheme, message, request, useDict, useDictItem, useDictLabel, useDictStatus, useDicts };

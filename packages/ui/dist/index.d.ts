import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { ThemeConfig, FormProps, Form, TableColumnType, TableProps as TableProps$1, ButtonProps } from 'antd';
export { Button, ButtonProps, Checkbox, CheckboxProps, DatePicker, DatePickerProps, Dropdown, DropdownProps, Form, FormProps, Input, InputNumber, InputNumberProps, InputProps, Popover, PopoverProps, Space, SpaceProps, Tooltip, TooltipProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
export { RangePickerProps } from 'antd/es/date-picker';
import { MessageInstance } from 'antd/es/message/interface';
import * as axios from 'axios';
import { ResponseType, AxiosRequestConfig } from 'axios';

declare const defaultTheme: {
    colorPrimary: string;
    colorError: string;
    colorInfo: string;
    colorLink: string;
    colorSuccess: string;
    colorWarning: string;
    colorTextBase: string;
    colorText: string;
    colorTextSecondary: string;
    colorBorder: string;
    colorBgBase: string;
    colorBgLayout: string;
    fontSize: number;
    fontSizeSM: number;
    fontSizeLG: string;
    fontSizeXL: string;
    borderRadius: number;
    borderRadiusXS: number;
    borderRadiusSM: number;
    borderRadiusLG: number;
    controlHeight: number;
    controlHeightLG: number;
    controlHeightSM: number;
    controlHeightXS: number;
};

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
    theme?: ThemeConfig['token'];
    dicts?: Dicts;
    children?: React.ReactNode;
}
/**注册全局静态方法 */
declare function Register({ children }: {
    children: React.ReactNode;
}): react.ReactNode;
declare function ConfigProvider({ theme, dicts, children }: ConfigProviderProps): react_jsx_runtime.JSX.Element;

declare function RangePicker({ showTime, allowEmpty, ...props }: RangePickerProps): react_jsx_runtime.JSX.Element;

declare let message: MessageInstance;

interface SearchProps extends FormProps {
    okText?: React.ReactNode;
    resetText?: React.ReactNode;
    initLoad?: boolean;
    onSearch?: (values: Record<string, any>) => void | Promise<void>;
    onReset?: () => Promise<void> | void;
    colWidth?: number;
}
declare function Search$1({ children, okText, resetText, initLoad, onSearch, onReset, colWidth, size, form: externalForm, initialValues, ...props }: SearchProps): react_jsx_runtime.JSX.Element;

type FormItemProps = React.ComponentProps<typeof Form.Item>;
interface SearchItemProps extends FormItemProps {
    /**搜索项占据的列数 */
    span?: number;
    /**日期类型值的转换格式，默认YYYY-MM-DD HH:mm:ss */
    format?: string;
    /**以数组形式接受多个值 */
    names?: string[];
}
declare function Item({ span, name, names, format, initialValue, children, ...props }: SearchItemProps): react_jsx_runtime.JSX.Element;

type CompoundedComponent = typeof Search$1 & {
    Item: typeof Item;
};
declare const Search: CompoundedComponent;

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
interface Action$2<RecordType extends AnyObject = AnyObject> extends Omit<ButtonProps, 'className' | 'title' | 'onClick'> {
    title?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement>, record: RecordType, index: number) => void;
    visible?: boolean | ((record: RecordType, index: number) => boolean);
    render?: (record: RecordType, index: number) => React.ReactNode;
    className?: string | ((record: RecordType, index: number) => string);
}
interface TableProps<RecordType extends AnyObject = AnyObject> extends TableProps$1<RecordType> {
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

declare function Table<T extends AnyObject = AnyObject>({ columns, actionFixed, actionTitle, actionWidth, actions, summaryMap, rowSelection, rowKey, ...props }: TableProps<T>): react_jsx_runtime.JSX.Element;

/**仅在 dataSource[number] 类型未知时使用，通过columns内容自动推断 dataSource[number] 的类型  */
declare function defineColumns<const T extends ColumnProps<AnyObject>[]>(columns: T): ColumnProps<{ [K in T[number] extends {
    dataIndex: string;
} ? T[number]["dataIndex"] : never]: any; } & AnyObject>[];

interface Action$1 extends Omit<ButtonProps, 'title'> {
    title?: React.ReactNode;
}

type Action<RecordType extends AnyObject = AnyObject> = (Action$1 & {
    display?: 'page';
}) | (Action$2<RecordType> & {
    display: 'table';
});
type PageProps<RecordType extends AnyObject = AnyObject> = Omit<TableProps<RecordType>, 'actions' | 'summaryMap' | 'size'> & Omit<SearchProps, 'onSearch' | 'size'> & {
    size?: Exclude<TableProps['size'], 'middle'>;
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
declare function Page<RecordType extends AnyObject = AnyObject>({ okText, resetText, initLoad, url, method, paramsLocation, params, onRequestComplete, onSearch: onSearchPage, onReset: onResetPage, dataSource: propsDataSource, colWidth, children, initialValues, form, size: defaultSize, actions, showTool, columns, ...props }: PageProps<RecordType>): react_jsx_runtime.JSX.Element;

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

export { type ColumnProps, type ColumnStatus, ConfigProvider, type ConfigProviderProps, type DictCode, type DictItem, type Dicts, Page, type Action as PageAction, type PageProps, RangePicker, Register, Search, type SearchItemProps, type SearchProps, type SummaryProps, Table, type Action$2 as TableAction, type TableProps, type TableStatus, defaultTheme, defineColumns, defineDicts, message, request, useDict, useDictItem, useDictLabel, useDictStatus, useDicts };

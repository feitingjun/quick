export { useLocation, useNavigate, useOutlet, useParams, useSearchParams } from 'react-router';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { GetProp, App, FormProps, Form, TableColumnType, TableProps as TableProps$1, ButtonProps, ThemeConfig, GetProps, ConfigProviderProps as ConfigProviderProps$1 } from 'antd';
export { Button, ButtonProps, Checkbox, CheckboxProps, DatePicker, DatePickerProps, Dropdown, DropdownProps, Form, FormProps, Input, InputNumber, InputNumberProps, InputProps, Popover, PopoverProps, Space, SpaceProps, Tooltip, TooltipProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
export { RangePickerProps } from 'antd/es/date-picker';
import * as axios from 'axios';
import { AxiosRequestConfig, ResponseType, AxiosError, AxiosResponse, AxiosResponseTransformer, AxiosInstance } from 'axios';

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

declare function useQuery(): Record<string, any>;

/**
 * 带请求状态的异步 Reducer hook，多个调用将排队并按顺序触发，每个调用都将接受前一次调用的结果
 *
 * 如果请求 Rejected，队列后续 action 将不会触发，且 dispatch 触发 Rejected，state 将保持最后一次成功的 action 的结果
 * @param action 实际请求函数
 * @param action.state 最新的state
 * @param action.payload 本次请求的参数
 * @param initialState 初始数据
 * @param initialPayload 初始请求参数(可选)，存在时会在初始化时立即发送一次请求(即使传入undefined)
 * @returns [state, dispatch, isPending]
 * - state: 当前状态
 * - dispatch: 触发函数
 * - isPending: 请求状态
 */
declare function useAsyncReducer<State>(action: (state: Readonly<State>) => State | Promise<State>, initialState: State): [State, () => Promise<State>, boolean];
declare function useAsyncReducer<State>(action: (state: Readonly<State>) => State | Promise<State>, initialState: State, initialPayload: true): [State, () => Promise<State>, boolean];
declare function useAsyncReducer<State, Payload>(action: (state: Readonly<State>, payload: Payload) => State | Promise<State>, initialState: State): [State, (payload: Payload) => Promise<State>, boolean];
declare function useAsyncReducer<State, Payload>(action: (state: Readonly<State>, payload: Payload) => State | Promise<State>, initialState: State, initialPayload: Payload): [State, (payload: Payload) => Promise<State>, boolean];

/**
 * 带请求状态的异步数据请求 hook
 *
 * 多个调用将按照触发顺序返回最后一次请求成功的状态和结果
 ** 若最后一次请求成功，直接返回完成状态和其结果，不会等待前面的请求完成
 ** 若最后一次请求失败，将依次查询并等待上一次调用，直到找到调用成功的，返回其完成状态和结果
 * @param action 请求函数
 * @param action.payload 本次请求的参数
 * @param initialState 初始数据
 * @param initialPayload 初始请求参数(可选)，存在时会在初始化时立即发送一次请求(即使传入undefined)
 * @returns [state, dispatch, isPending]
 * - state: 当前状态
 * - dispatch: 触发函数
 * - isPending: 请求状态
 */
declare function useAsyncState<State>(action: () => Promise<State>, initialState: State, initialPayload?: true): [State, () => Promise<State>, boolean];
declare function useAsyncState<State, Payload>(action: (payload: Payload) => Promise<State>, initialState: State, initialPayload?: Payload): [State, (payload: Payload) => Promise<State>, boolean];

/**
 * 触发异步请求 hook，多个请求同时触发时，全部完成后更新请求状态
 * @param action 实际请求函数
 * @param action.payload 请求参数
 * @param initialPayload 初始请求参数
 * @returns [dispatch, isPending]
 * - dispatch: 触发函数
 * - isPending: 请求状态
 */
declare function useAsync(action: () => Promise<void>, initialPayload?: true): [() => Promise<void>, boolean];
declare function useAsync<Payload>(action: (payload: Payload) => Promise<void>, initialPayload?: Payload): [(payload: Payload) => Promise<void>, boolean];

declare function RangePicker({ showTime, allowEmpty, ...props }: RangePickerProps): react_jsx_runtime.JSX.Element;

declare let message: GetProp<ReturnType<typeof App.useApp>, 'message'>;
declare let modal: GetProp<ReturnType<typeof App.useApp>, 'modal'>;
declare let notification: GetProp<ReturnType<typeof App.useApp>, 'notification'>;

interface SearchProps extends FormProps {
    okText?: React.ReactNode;
    resetText?: React.ReactNode;
    initLoad?: boolean;
    onSearch?: (values: Record<string, any>) => void | Promise<void>;
    onReset?: () => Promise<void> | void;
    colWidth?: number;
    loading?: boolean;
}
declare function Search$1({ children, okText, resetText, initLoad, onSearch, onReset, colWidth, size, form: externalForm, initialValues, loading: propLoading, ...props }: SearchProps): react_jsx_runtime.JSX.Element;

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

declare const _default$1: react.ForwardRefExoticComponent<Omit<TableProps<AnyObject>, "onChange" | "size" | "actions" | "summaryMap"> & Omit<SearchProps, "size" | "onSearch"> & {
    size?: Exclude<TableProps["size"], "middle">;
    url?: string;
    method?: "get" | "post" | "put" | "delete" | "patch";
    paramsLocation?: "query" | "body";
    params?: Record<string, any>;
    onRequestComplete?: ((data: any) => AnyObject[] | Promise<AnyObject[]>) | undefined;
    onSearch?: (values: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>;
    onChange?: TabelOnChange<AnyObject> | undefined;
    colWidth?: number;
    actions?: PageAction<AnyObject>[] | undefined;
    showTool?: boolean;
    totalExtra?: react.ReactNode | ((data: PageDatabase<AnyObject>) => React.ReactNode);
} & react.RefAttributes<PageRef>>;

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
interface Action<RecordType extends AnyObject = AnyObject> extends Omit<ButtonProps, 'className' | 'title' | 'onClick'> {
    title?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement>, record: RecordType, index: number) => void;
    visible?: boolean | ((record: RecordType, index: number) => boolean);
    render?: (record: RecordType, index: number) => React.ReactNode;
    className?: string | ((record: RecordType, index: number) => string);
}
interface TableProps<RecordType extends AnyObject = AnyObject> extends TableProps$1<RecordType> {
    columns?: ColumnProps<RecordType>[];
    /**操作栏内容 */
    actions?: Action<RecordType>[];
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

declare function defineColumns<const T extends AnyObject>(columns: ColumnProps<T>[]): ColumnProps<T>[];

type TabelOnChange<RecordType extends AnyObject> = (...args: Parameters<GetProp<TableProps<RecordType>, 'onChange'>>) => any;
interface OperationAction extends Omit<ButtonProps, 'title'> {
    title?: React.ReactNode;
}
type PageAction<RecordType extends AnyObject = AnyObject> = (OperationAction & {
    display?: 'page';
}) | (Action<RecordType> & {
    display: 'table';
});
interface Pagination {
    total: number;
    pageSize: number;
    page: number;
}
interface PageDatabase<RecordType extends AnyObject = AnyObject> extends Pagination {
    dataSource: RecordType[];
    summaryMap?: Record<string, number>;
    params: Record<string, any>;
}
interface TransformResult extends Pagination {
    dataSource: AnyObject[];
    summaryMap?: Record<string, number>;
}
type PageProps<RecordType extends AnyObject = AnyObject> = Omit<TableProps<RecordType>, 'actions' | 'summaryMap' | 'size' | 'onChange'> & Omit<SearchProps, 'onSearch' | 'size'> & {
    size?: Exclude<TableProps['size'], 'middle'>;
    /**请求路径 */
    url?: string;
    /**请求方式 */
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
    /**请求参数位置，get默认是query，其它默认是body */
    paramsLocation?: 'query' | 'body';
    /**额外的请求参数 */
    params?: Record<string, any>;
    /**数据请求完成后的回调，data为经过request.internal处理后的数据 */
    onRequestComplete?: (data: any) => RecordType[] | Promise<RecordType[]>;
    onSearch?: (values: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>;
    /**表格change事件，包括分页、排序、筛选变化，返回新的查询条件或undefined */
    onChange?: TabelOnChange<RecordType>;
    colWidth?: number;
    /**页面操作按钮 */
    actions?: PageAction<RecordType>[];
    /**是否显示工具栏 */
    showTool?: boolean;
    /**表格Pagination.showTotal额外的内容 */
    totalExtra?: React.ReactNode | ((data: PageDatabase<RecordType>) => React.ReactNode);
};
type PageRef = {
    refresh: (values?: Record<string, any>) => Promise<void>;
    reset: () => void;
};

interface RequestConfig$1 {
    url?: string;
    method?: PageProps['method'];
    params?: any;
    data?: any;
    [key: string]: any;
}
interface HttpRequest {
    request: (config: RequestConfig$1) => Promise<any>;
}

type Locale = GetProps<ConfigProviderProps$1>['locale'];
interface ConfigProviderProps {
    /**antd 主题Token配置 */
    token?: ThemeConfig['token'];
    /**数据字典 */
    dicts?: Dicts;
    children?: React.ReactNode;
    /**antd 样式启用 layer*/
    layer?: boolean;
    /**antd 国际化配置 */
    locale?: Locale;
    /**带远程数据获取功能的组件所使用的请求方法实例 */
    httpRequest?: HttpRequest;
    /**Page 组件统一转换数据格式（Select 组件远程获取的数据格式不具有普遍性，不做统一处理）*/
    transformResponse?: (response: any) => TransformResult;
    /**Page 组件统一转换请求数据格式 */
    transformRequest?: (params: Record<string, any>, method: PageProps['method']) => Record<string, any>;
    /**Page组件默认请求方法 */
    requestMethod?: PageProps['method'];
    /**排序sort字段重命名 */
    sortFieldName?: string;
    /**排序order字段重命名 */
    orderFieldName?: string;
}
/**注册全局静态方法 */
declare function Register({ children }: {
    children: React.ReactNode;
}): react.ReactNode;
declare function ConfigProvider({ token, dicts, children, layer, locale, httpRequest, transformResponse, transformRequest, sortFieldName, orderFieldName, requestMethod }: ConfigProviderProps): react_jsx_runtime.JSX.Element;

declare module 'axios' {
    interface AxiosRequestConfig {
        skipErrorHandler?: boolean;
    }
}
interface Request<ResponseData> extends Omit<AxiosInstance, 'request' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options' | 'postForm' | 'putForm' | 'patchForm'> {
    request: <T = ResponseData>(config: AxiosRequestConfig) => Promise<T>;
    get: <T = ResponseData>(url: string, config?: AxiosRequestConfig) => Promise<T>;
    post: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
    put: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
    delete: <T = ResponseData>(url: string, config?: AxiosRequestConfig) => Promise<T>;
    patch: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
    head: <T = ResponseData>(url: string, config?: AxiosRequestConfig) => Promise<T>;
    options: <T = ResponseData>(url: string, config?: AxiosRequestConfig) => Promise<T>;
    postForm: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
    putForm: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
    patchForm: <T = ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
}
interface RequestConfig<T> {
    /**请求基础路径 */
    baseURL?: string;
    /**额外的请求头信息 */
    headers?: AxiosRequestConfig['headers'];
    /**请求超时时间 */
    timeout?: number;
    /**响应数据格式，默认json */
    responseType?: ResponseType;
    /**异常处理 */
    reject?: (error: AxiosError<T>) => void;
    /**验证response.data，返回false时进入异常处理 */
    validateData?: (response: AxiosResponse<T>['data']) => boolean;
    /**验证http状态码，返回false时进入异常处理 */
    validateStatus?: (status: number) => boolean;
    transformResponse?: AxiosResponseTransformer;
}
declare const _default: {
    create<T = unknown>(config: RequestConfig<T>): Request<T>;
    Cancel: axios.CancelStatic;
    CancelToken: axios.CancelTokenStatic;
    Axios: typeof axios.Axios;
    AxiosError: typeof AxiosError;
    HttpStatusCode: typeof axios.HttpStatusCode;
    VERSION: string;
    isCancel: typeof axios.isCancel;
    all: typeof axios.all;
    spread: typeof axios.spread;
    isAxiosError: typeof axios.isAxiosError;
    toFormData: typeof axios.toFormData;
    formToJSON: typeof axios.formToJSON;
    getAdapter: typeof axios.getAdapter;
    CanceledError: typeof axios.CanceledError;
    AxiosHeaders: typeof axios.AxiosHeaders;
    mergeConfig: typeof axios.mergeConfig;
    defaults: Omit<axios.AxiosDefaults, "headers"> & {
        headers: axios.HeadersDefaults & {
            [key: string]: axios.AxiosHeaderValue;
        };
    };
    interceptors: {
        request: axios.AxiosInterceptorManager<axios.InternalAxiosRequestConfig>;
        response: axios.AxiosInterceptorManager<AxiosResponse>;
    };
};

export { type ColumnProps, type ColumnStatus, ConfigProvider, type ConfigProviderProps, type DictCode, type DictItem, type Dicts, _default$1 as Page, type PageAction, type PageProps, RangePicker, Register, Search, type SearchItemProps, type SearchProps, type SummaryProps, Table, type Action as TableAction, type TableProps, type TableStatus, defaultTheme, defineColumns, defineDicts, message, modal, notification, _default as request, useAsync, useAsyncReducer, useAsyncState, useDict, useDictItem, useDictLabel, useDictStatus, useDicts, useQuery };

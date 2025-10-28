import { TableColumnType, TableProps as TableProps$1 } from 'antd';
import { StyledComponentProps } from '@quick/cssinjs';
import { TableStatus, DictCode } from '../../dicts/types.js';
import { ButtonProps } from '../button/index.js';
import 'react';

type AnyObject = Record<string, any>;
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
interface Actions<RecordType extends AnyObject = AnyObject> extends Omit<ButtonProps, 'className' | 'title' | 'onClick'> {
    title?: React.ReactNode;
    onClick?: (e: React.MouseEvent, record: RecordType, index: number) => void;
    visible?: boolean | ((record: RecordType, index: number) => boolean);
    render?: (record: RecordType, index: number) => React.ReactNode;
    className?: string | ((record: RecordType, index: number) => string);
}
interface TableProps<RecordType extends AnyObject = AnyObject> extends StyledComponentProps<TableProps$1<RecordType>> {
    columns?: ColumnProps<RecordType>[];
    /**操作栏内容 */
    actions?: Actions<RecordType>[];
    /**操作栏宽度 */
    actionWidth?: number;
    /**操作栏位置 */
    actionFixed?: 'left' | 'right';
    /**操作栏标题 */
    actionTitle?: React.ReactNode;
    /**服务器返回的合计数据 */
    summaryMap?: Record<string, number>;
}

export type { Actions, AnyObject, ColumnGroupType, ColumnProps, ColumnStatus, ColumnType, SummaryProps, TableProps };

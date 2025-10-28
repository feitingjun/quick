import * as _quick_cssinjs from '@quick/cssinjs';
import { ColumnProps, AnyObject, TableProps } from './types.js';
import 'antd';
import '../../dicts/types.js';
import '../button/index.js';
import 'react';

/**仅在 dataSource[number] 类型未知时使用，通过columns内容自动推断 dataSource[number] 的类型  */
declare function defineColumns<const T extends ColumnProps<AnyObject>[]>(columns: T): ColumnProps<{ [K in T[number] extends {
    dataIndex: string;
} ? T[number]["dataIndex"] : never]: any; } & AnyObject>[];
declare function Table<T extends AnyObject>({ columns, actionFixed, actionTitle, actionWidth, actions, summaryMap, rowSelection, rowKey, ...props }: TableProps<T>): _quick_cssinjs.JSX.Element;

export { Table, defineColumns };

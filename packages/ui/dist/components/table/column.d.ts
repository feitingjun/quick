import { AnyObject, ColumnProps, Actions, TableProps } from './types.js';
import 'antd';
import '@quick/cssinjs';
import '../../dicts/types.js';
import '../button/index.js';
import 'react';

declare function useColumns<T extends AnyObject = AnyObject>(columns: ColumnProps<T>[], actions?: Actions<T>[], actionFixed?: TableProps['actionFixed'], actionTitle?: TableProps['actionTitle'], actionWidth?: TableProps['actionWidth']): ColumnProps<T>[];

export { useColumns };

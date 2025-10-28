import * as _quick_cssinjs from '@quick/cssinjs';
import { AnyObject, ColumnProps, TableProps } from './types.js';
import 'antd';
import '../../dicts/types.js';
import '../button/index.js';
import 'react';

declare function useSummary<T extends AnyObject = AnyObject>(columns: ColumnProps<T>[], summaryMap?: Record<string, number>, rowSelection?: TableProps<T>['rowSelection']): (() => _quick_cssinjs.JSX.Element) | undefined;

export { useSummary };

import { Dicts, DictCode, DictItem, TableStatus } from './types.js';

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

export { useDict, useDictItem, useDictLabel, useDictStatus, useDicts };

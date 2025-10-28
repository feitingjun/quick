export { useDict, useDictItem, useDictLabel, useDictStatus, useDicts } from './hooks.js';
import { Dicts } from './types.js';
export { DictCode, DictItem, TableStatus } from './types.js';

declare const defineDicts: <T extends Dicts>(dicts: T) => T;

export { Dicts, defineDicts };

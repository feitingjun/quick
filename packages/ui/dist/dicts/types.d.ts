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

export type { DictCode, DictItem, Dicts, TableStatus };

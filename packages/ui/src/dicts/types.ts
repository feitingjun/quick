export type TableStatus = 'success' | 'error' | 'waiting' | 'invalid' | 'default' | 'completed'

export interface DictItem {
  label: string | number
  value: any
  status?: TableStatus
}

export interface Dicts {
  [key: string]: DictItem[]
}

export type DictCode = keyof Dicts

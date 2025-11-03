import { useContext } from 'react'
import type { DictItem, Dicts, DictCode } from './types'
import { ConfigContext } from '@/config-provider/context'

/**获取全部的字典数据 */
export function useDicts() {
  const { dicts } = useContext(ConfigContext)
  return dicts
}

/**根据code获取字典列表数据 */
export function useDict<T extends DictCode>(code: T) {
  const dicts = useDicts()
  return dicts[code]
}

/**根据code和value获取字典的某一项 */
export function useDictItem<T extends DictCode>(code: T, value: Dicts[T][number]['value']) {
  const dict = useDict(code)
  return dict?.find((item: DictItem) => item.value === value)
}

/**根据字典code和value获取字典的label */
export function useDictLabel<T extends DictCode>(code: T, value: Dicts[T][number]['value']) {
  const item = useDictItem(code, value)
  return item?.label
}

/**根据字典code和value获取字典的status */
export function useDictStatus<T extends DictCode>(code: T, value: Dicts[T][number]['value']) {
  const item = useDictItem(code, value)
  return item?.status
}

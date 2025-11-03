import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { isNumber } from '@/utils'

export default function useQuery() {
  const [query] = useSearchParams()
  return useMemo(
    () =>
      query.entries().reduce((acc, [key, value]) => {
        if (value === 'undefined') {
          acc[key] = undefined
        } else if (value === 'null') {
          acc[key] = null
        }
        // 避免数字长度超过16为转换精度丢失
        else if (value.length <= 16 && isNumber(value)) {
          acc[key] = Number(value)
        }
        // 以逗号分割的数组
        else if (value.includes(',')) {
          acc[key] = value.split(',').map(item => (isNumber(item) ? Number(item) : item))
        } else {
          acc[key] = value
        }
        return acc
      }, {} as Record<string, any>),
    [query]
  )
}

/** 辅助类型：把联合类型转为交叉类型 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

/**合并对象 */
export function merge<T extends object[]>(...objects: T): UnionToIntersection<T[number]> {
  const result: any = {}
  for (const obj of objects) {
    if (!obj || typeof obj !== 'object') continue

    for (const key in obj) {
      const value = (obj as any)[key]

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (!result[key]) result[key] = {}
        result[key] = merge(result[key], value)
      } else {
        result[key] = value
      }
    }
  }

  return result
}

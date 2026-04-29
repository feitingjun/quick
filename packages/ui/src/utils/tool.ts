/**防抖函数 */
export const debounce = (fn: Function, delay: number) => {
  let timer: number
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**多个classname合并 */
export const classnames = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')

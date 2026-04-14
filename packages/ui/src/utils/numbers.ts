import Bignumber from 'bignumber.js'

/**千分位 */
export function thousands(num: number | string) {
  if (!isNumber(num)) return num
  const arr = String(num).split('.')
  const intPart = arr[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  return arr[1] ? `${intPart}.${arr[1]}` : intPart
}

/**小数保留n位 */
export function toFixed(num: number | string, n = 2) {
  return new Bignumber(num).toFixed(n)
}

/**四舍五入 */
export function round(num: number | string, n = 2) {
  return new Bignumber(num).decimalPlaces(n, Bignumber.ROUND_HALF_UP).toNumber()
}

/**小数不足n位补零 */
export function zerofill(num: number | string, n = 2) {
  const [intPart, decPart = ''] = String(num).split('.')
  if (decPart.length >= n) return num
  const filledDec = decPart.padEnd(n, '0').slice(0, n)
  return `${intPart}.${filledDec}`
}

/**数字转换为百分比模式 */
export function toPercent(num: number | string) {
  return multiply(num, 100) + '%'
}

/**判断是否是数字 */
export function isNumber(num: any): num is number {
  const n = new Bignumber(num)
  return n.isFinite() && !n.isNaN()
}

/**乘法 */
export function multiply(a: number | string, b: number | string) {
  return new Bignumber(a).times(b).toNumber()
}

/**除法 */
export function divide(a: number | string, b: number | string) {
  return new Bignumber(a).div(b).toNumber()
}

/**加法 */
export function add(a: number | string, b: number | string) {
  return new Bignumber(a).plus(b).toNumber()
}

/**减法 */
export function subtract(a: number | string, b: number | string) {
  return new Bignumber(a).minus(b).toNumber()
}

/**取余 */
export function mod(a: number | string, b: number | string) {
  return new Bignumber(a).mod(b).toNumber()
}

/**千分位 */
declare function thousands(num: number | string): string;
/**小数保留n位 */
declare function toFixed(num: number | string, n?: number): string;
/**四舍五入 */
declare function round(num: number | string, n?: number): number;
/**小数不足n位补零 */
declare function zerofill(num: number | string, n?: number): string | number;
/**数字转换为百分比模式 */
declare function toPercent(num: number | string): string;
/**判断是否是数字 */
declare function isNumber(num: any): num is number;
/**乘法 */
declare function multiply(a: number | string, b: number | string): number;
/**除法 */
declare function divide(a: number | string, b: number | string): number;
/**加法 */
declare function add(a: number | string, b: number | string): number;
/**减法 */
declare function subtract(a: number | string, b: number | string): number;
/**取余 */
declare function mod(a: number | string, b: number | string): number;

export { add, divide, isNumber, mod, multiply, round, subtract, thousands, toFixed, toPercent, zerofill };

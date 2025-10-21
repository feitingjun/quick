/**防抖函数 */
declare const debounce: (fn: Function, delay: number) => (...args: any) => void;

export { debounce };

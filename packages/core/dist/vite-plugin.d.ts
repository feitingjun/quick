import { PluginOption } from 'vite';
import { QuickConfig } from './types.js';
import 'fs';
import 'react';

/**防抖函数 */
declare const debounce: (fn: Function, delay: number) => (...args: any) => void;
/**vite插件，负责解析配置，生成约定式路由，以及提供quick插件功能*/
declare function QucikCore(quickonfig?: QuickConfig): PluginOption;

export { debounce, QucikCore as default };

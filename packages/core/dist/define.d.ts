import { QuickConfig, Plugin, Runtime } from './types.js';
import 'vite';
import 'fs';
import 'react';

/**定义用户配置 */
declare function defineConfig(config: QuickConfig): QuickConfig;
/**定义插件 */
declare function definePlugin<T extends Plugin | ((...args: any[]) => Plugin)>(plugin: T): T;
/**定义运行时函数 */
declare function defineRuntime(fn: Runtime): Runtime;

export { defineConfig, definePlugin, defineRuntime };

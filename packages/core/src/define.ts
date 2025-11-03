import type { QuickConfig, Runtime, Plugin } from './types'

/**定义用户配置 */
export function defineConfig(config: QuickConfig) {
  return config
}

/**定义插件 */
export function definePlugin<T extends Plugin | ((...args: any[]) => Plugin)>(plugin: T) {
  return plugin
}

/**定义运行时函数 */
export function defineRuntime(fn: Runtime) {
  return fn
}

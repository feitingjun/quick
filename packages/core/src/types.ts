import { UserConfig } from 'vite'
import { Stats } from 'fs'
import { ComponentType, PropsWithChildren } from 'react'

/**路由清单对象值 */
export interface RouteManifestObject {
  id: string
  path: string
  pathname: string
  parentId?: string
  file: string
  layout?: boolean
}
/**路由清单 */
export type RouteManifest = Record<string, RouteManifestObject>

/**使类型的某一个属性可选 */
export type MakePropertyOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

/**插件 */
export interface Plugin {
  setup?: (options: PluginOptions) => void
  runtime?: string
}

export type Provider = ComponentType<PropsWithChildren<{}>>
export type Wrapper = ComponentType<
  PropsWithChildren<{
    routeId: string
    layout?: boolean
    path: string
    pathname: string
    parentId?: string
  }>
>

/**插件运行时参数 */
export interface RuntimeOptions {
  /**运行时上下文信息 */
  appContext: {
    /**app配置 */
    appConfig: any
    /**路由清单 */
    manifest: RouteManifest
  }
  /**添加全局Provider */
  addProvider: (fn: Provider) => void
  /**给所有路由组件添加一层包裹 */
  addWrapper: (fn: Wrapper) => void
}

/**插件运行时类型 */
export type Runtime = (options: RuntimeOptions) => void

/**quick插件配置 */
export interface QuickConfig {
  /**src路径 */
  srcDir?: string
  /**quick插件 */
  plugins?: Plugin[]
}

/**添加临时文件方法参数 */
export interface AddFileOptions {
  specifier: string | string[]
  source: string
}

/**插件addWatch参数 */
export type PluginWatcher = (
  eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
  path: string,
  stats?: Stats
) => void

/**插件参数 */
export interface PluginOptions {
  /**配置上下文 */
  context: {
    mode: UserConfig['mode']
    /**项目根目录 */
    root: string
    /**src目录 */
    srcDir: string
    /**用户配置 */
    userConfig: QuickConfig
    /**项目package.json内容 */
    pkg: Record<string, any>
  }
  /**修改用户配置 */
  modifyUserConfig: (fn: (config: QuickConfig) => QuickConfig) => void
  /**添加文件 */
  addFile: (options: { content: string; outPath: string }) => void
  /**根据Handlebars模板写入文件 */
  addFileTemplate: <T extends Record<string, any>>(options: {
    sourcePath: string
    outPath: string
    data?: T
  }) => void
  /**添加额外的pageConfig类型 */
  addPageConfigType: (options: AddFileOptions) => void
  /**添加额外的appConfig类型 */
  addAppConfigType: (options: AddFileOptions) => void
  /**添加从quick命名空间导出的模块 */
  addExport: (options: AddFileOptions & { type?: boolean }) => void
  /**在入口文件的最前面添加import */
  addEntryImport: (
    options: MakePropertyOptional<AddFileOptions, 'specifier'>
  ) => void
  /**在入口文件的最前插入代码 */
  addEntryCodeAhead: (code: string) => void
  /**在入口文件的最后插入代码 */
  addEntryCodeTail: (code: string) => void
  /**文件变更时触发 */
  addWatch: (fn: PluginWatcher) => void
  /**合并vite配置 */
  mergeViteConfig: (config: UserConfig) => void
}

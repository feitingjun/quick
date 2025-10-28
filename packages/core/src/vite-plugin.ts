import { PluginOption, UserConfig as ViteConfig, mergeConfig } from 'vite'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, relative } from 'path'
import { globSync } from 'glob'
import { renderHbsTpl } from '@quick/cli'
import {
  QuickConfig,
  RouteManifest,
  AddFileOptions,
  PluginWatcher,
  PluginOptions,
  Plugin,
  MakePropertyOptional
} from './types'
import { createTmpDir, writeEntryTsx, writeRoutesTs } from './writeFile'

/**防抖函数 */
export const debounce = (fn: Function, delay: number) => {
  let timer: NodeJS.Timeout
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**是否需要重新生成路由 */
function needGenerateRoutes(path: string, srcDir = 'src') {
  // 匹配src目录下的layout(s).tsx | layout(s)/index.tsx
  const regex = new RegExp(`^${srcDir}/(layout|layouts)(?:/index)?.tsx$`)
  const isRootLayout = regex.test(path)
  // 匹配以(.)page.tsx | (.)layout.tsx | layout/index.tsx 结尾且page.tsx不在layout(s)下的文件
  const isPageOrLayout =
    /^(?:(?!.*(layout|layouts)\/.*page\.tsx).)*\/((\S+\.)?page\.tsx|(\S+\.)?layout\.tsx|layout\/index\.tsx)$/.test(
      path
    )
  // 是否在指定的pages目录下
  const inPagesDir = existsSync(resolve(process.cwd(), srcDir, 'pages'))
    ? path.startsWith(`${srcDir}/pages`)
    : path.startsWith(srcDir)
  return (
    isRootLayout || (isPageOrLayout && inPagesDir) || path === srcDir || path === `${srcDir}/pages`
  )
}

/**生成路由清单 */
function generateRouteManifest(src: string = 'src') {
  const srcDir = resolve(process.cwd(), src)
  // 获取页面根目录
  const pageDir = existsSync(srcDir + '/pages') ? 'pages' : ''
  // 获取全局layout
  const rootLayout = globSync('layout{s,}{/index,}.tsx', { cwd: srcDir })
  // 获取所有页面
  const include = [
    '**/{*.,}page.tsx',
    '**/{*.,}layout.tsx',
    '**/layout/index.tsx',
    '**/404{/index,}.tsx'
  ]
  const ignore = ['**/layout/**/*{[^/],}page.tsx', '**/layout/**/layout.tsx']
  const pages = globSync(include, { cwd: resolve(srcDir, pageDir), ignore })
  // 获取id和文件的映射
  const idpaths = pages.reduce((prev, file) => {
    const id = file
      // 去除路径中文件夹为index的部分
      .replace(/index\//, '')
      // 去除结尾的index.tsx(layout才有) | (/)page.tsx | (/).page.tsx | (/)index.page.tsx
      .replace(/\/?((index)|((((\/|^)index)?\.)?page))?\.tsx$/, '')
      // 将user.detail 转换为 user/detail格式(简化目录层级)
      .replace('.', '/')
      // 将$id转换为:id
      .replace(/\$(\w+)/, ':$1')
      // 将$转换为通配符*
      .replace(/\$$/, '*')
      // 将404转换为通配符*
      .replace(/404$/, '*')
    prev[id || '/'] = file
    return prev
  }, {} as Record<string, string>)
  const ids = Object.keys(idpaths).sort((a, b) => {
    const nA = a.replace(/\/?layout/, ''),
      nB = b.replace(/\/?layout/, '')
    return nA.length === nB.length ? a.indexOf('layout') : nB.length - nA.length
  })

  // 生成路由清单
  const routesManifest = ids.reduce((prev, id, index) => {
    const parentId = ids.slice(index + 1).find(v => {
      return v.endsWith('layout') && id.startsWith(v.replace(/\/?layout/, ''))
    })
    const regex = new RegExp(`^${parentId?.replace(/\/?layout$/, '')}/?|/?layout$`, 'g')
    return {
      ...prev,
      [id]: {
        id,
        parentId,
        path: id === '/' ? '' : id.replace(regex, ''),
        pathname: id.replace(/\/?layout?$/, ''),
        file: resolve(srcDir, pageDir, idpaths[id]),
        layout: id.endsWith('layout')
      }
    }
  }, {} as RouteManifest)

  if (rootLayout.length > 0 && pageDir) {
    Object.values(routesManifest).forEach(v => {
      if (!v.parentId) v.parentId = 'rootLayout'
    })
    routesManifest['rootLayout'] = {
      id: 'rootLayout',
      path: '',
      pathname: '',
      file: resolve(srcDir, rootLayout[0]),
      layout: true
    }
  }
  return routesManifest
}

/**监听路由文件变化 */
async function watchRoutes(event: string, path: string, srcDir = 'src') {
  // 获取项目根目录的的路径
  path = relative(process.cwd(), path)
  // 重新生成路由
  if (event !== 'change' && needGenerateRoutes(path)) {
    writeRoutesTs(resolve(process.cwd(), '.quick'), generateRouteManifest(srcDir))
  }
}

async function loadPlugins(plugins: Plugin[], config: QuickConfig) {
  // 运行时配置
  const runtimes: string[] = []
  // 额外的pageConfig类型
  const pageConfigTypes: any[] = []
  // 额外的appConfig类型
  const appConfigTypes: any[] = []
  // 从quick命名空间导出的模块
  const exports: (any & { type?: boolean })[] = []
  // 在入口文件中导入的模块
  const imports: any[] = []
  // 在入口文件顶部插入的代码
  const aheadCodes: string[] = []
  // 在入口文件尾部插入的代码
  const tailCodes: string[] = []
  // 文件变更时触发的函数
  const watchers: PluginWatcher[] = []
  // vite配置
  let viteConfig: ViteConfig = {}
  const modifyUserConfig: PluginOptions['modifyUserConfig'] = fn => {
    config = fn(config)
  }
  const addFile: PluginOptions['addFile'] = ({ content, outPath }) => {
    writeFileSync(outPath, content)
  }
  const addFileTemplate: PluginOptions['addFileTemplate'] = options => {
    renderHbsTpl(options)
  }
  const addPageConfigType: PluginOptions['addPageConfigType'] = options => {
    pageConfigTypes.push(options)
  }
  const addAppConfigType: PluginOptions['addAppConfigType'] = options => {
    appConfigTypes.push(options)
  }
  const addExport: PluginOptions['addExport'] = options => {
    exports.push(options)
  }
  const addEntryImport: PluginOptions['addEntryImport'] = options => {
    imports.push(options)
  }
  const addEntryCodeAhead: PluginOptions['addEntryCodeAhead'] = code => {
    aheadCodes.push(code)
  }
  const addEntryCodeTail: PluginOptions['addEntryCodeTail'] = code => {
    tailCodes.push(code)
  }
  const addWatch: PluginOptions['addWatch'] = fn => {
    watchers.push(fn)
  }
  const mergeViteConfig: PluginOptions['mergeViteConfig'] = (config: ViteConfig) => {
    viteConfig = mergeConfig(viteConfig, config)
  }
  // 解析quick插件
  if (plugins && plugins.length > 0) {
    // 动态导入package.json
    const pkgText = readFileSync(`${process.cwd()}/package.json`, 'utf-8')
    const pkg = JSON.parse(pkgText)
    // 执行quick插件
    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i]
      const { setup, runtime } = plugin
      const context = {
        mode: process.env.NODE_ENV as ViteConfig['mode'],
        root: process.cwd(),
        srcDir: config.srcDir ?? 'src',
        userConfig: config,
        pkg
      }
      if (runtime) runtimes.push(runtime)
      await setup?.({
        context,
        modifyUserConfig,
        addFile,
        addFileTemplate,
        addPageConfigType,
        addAppConfigType,
        addExport,
        addEntryImport,
        addEntryCodeAhead,
        addEntryCodeTail,
        addWatch,
        mergeViteConfig
      })
    }
  }
  return {
    pageConfigTypes,
    appConfigTypes,
    exports,
    imports,
    aheadCodes,
    tailCodes,
    runtimes,
    watchers,
    viteConfig
  }
}
/**加载全局样式文件 */
function loadGlobalStyle(
  srcDir: string,
  {
    imports,
    aheadCodes,
    tailCodes,
    watchers
  }: {
    imports: MakePropertyOptional<AddFileOptions, 'specifier'>[]
    aheadCodes: string[]
    tailCodes: string[]
    watchers: PluginWatcher[]
  }
) {
  // 判断是否存在global.less文件
  const globalStyle = globSync(`${srcDir}/global.{less,scss,css}`, {
    cwd: process.cwd()
  })
  if (globalStyle && globalStyle.length > 0) {
    imports.push({ source: `${process.cwd()}/${globalStyle[0]}` })
  }
  // 添加一个监听global.less增删的监听器
  watchers.push((event, path) => {
    const reg = new RegExp(`^${process.cwd()}/${srcDir}/global.(less|scss|css)$`)
    if (!reg.test(path)) return
    if (event === 'add') {
      imports.push({ source: path })
      writeEntryTsx(resolve(process.cwd(), '.quick'), srcDir, {
        imports,
        aheadCodes,
        tailCodes
      })
    } else if (event === 'unlink') {
      imports.splice(
        imports.findIndex(v => v.source === path),
        1
      )
      writeEntryTsx(resolve(process.cwd(), '.quick'), srcDir, {
        imports,
        aheadCodes,
        tailCodes
      })
    }
  })
}

/**vite插件，负责解析配置，生成约定式路由，以及提供quick插件功能*/
export default function QucikCore(quickonfig: QuickConfig = {}): PluginOption {
  const { srcDir = 'src', plugins = [] } = quickonfig
  let watchers: PluginWatcher[] = []
  return {
    name: 'quick-core',
    enforce: 'pre',
    config: async () => {
      // 用户配置文件变更时重置
      watchers = []
      const {
        pageConfigTypes,
        appConfigTypes,
        exports,
        imports,
        aheadCodes,
        tailCodes,
        runtimes,
        watchers: pluginWatchers,
        viteConfig
      } = await loadPlugins(plugins, quickonfig)
      watchers = pluginWatchers
      loadGlobalStyle(srcDir, { imports, aheadCodes, tailCodes, watchers })
      // 创建临时文件夹
      createTmpDir({
        root: process.cwd(),
        srcDir,
        options: {
          manifest: generateRouteManifest(srcDir),
          pageConfigTypes,
          appConfigTypes,
          exports,
          imports,
          aheadCodes,
          tailCodes,
          runtimes
        }
      })
      // 返回的配置将与原有的配置深度合并
      return mergeConfig(
        {
          resolve: {
            alias: {
              '@': resolve(process.cwd(), srcDir.split('/')[0]),
              quick: resolve(process.cwd(), '.quick'),
              '/quick.tsx': resolve(process.cwd(), '.quick', 'entry.tsx')
            }
          },
          build: {
            rollupOptions: {
              input: {
                quick: resolve(process.cwd(), '.quick', 'entry.tsx'),
                main: 'index.html'
              }
            }
          }
        },
        viteConfig
      )
    },
    configureServer: server => {
      server.watcher.on('all', (event, path, stats) => {
        debounce(() => watchRoutes(event, path, srcDir), 150)()
        watchers.forEach(fn => fn(event, path, stats))
      })
    }
  }
}

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PluginOption, ResolvedConfig, ViteDevServer } from 'vite'

const VIRTUAL_MODULE_ID = 'virtual:file-router'
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`
const PAGE_FILE_RE = /(?:^|\.)page\.(?:[cm]?[jt]sx?)$/
const LAYOUT_FILE_RE = /(?:^|\.)layout\.(?:[cm]?[jt]sx?)$/
const INDEX_FILE_RE = /^index\.(?:[cm]?[jt]sx?)$/
const NESTED_LAYOUT_INDEX_RE = /(?:^|\/)layout\/index\.(?:[cm]?[jt]sx?)$/
const FILE_EXTENSION_RE = /\.(?:[cm]?[jt]sx?)$/
const DYNAMIC_SEGMENT_RE = /^\[(.+)\]$/
const STRUCTURE_CHANGE_EVENTS = ['add', 'unlink', 'addDir', 'unlinkDir'] as const
const TEMPLATE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), 'template')
const VIRTUAL_MODULE_TEMPLATE_FILE = 'virtual-module.js.template'
const TEMPLATE_CONTENT_CACHE = new Map<string, string>()

type FileKind = 'page' | 'layout'
type StructureChangeEvent = (typeof STRUCTURE_CHANGE_EVENTS)[number]

interface RouteFile {
  file: string
  importPath: string
  kind: FileKind
  routeSegments: string[]
}

interface RouteNode {
  segment: string | null
  page?: RouteFile
  layout?: RouteFile
  children: Map<string, RouteNode>
}

interface PluginContextLike {
  warn(message: string): void
}

interface CollectRouteFileOptions {
  ignoredDirs?: string[]
  allowRootIndexAsLayout?: boolean
}

interface RouteRoots {
  routeRoot: string
  layoutsDir: string
  routeRootIgnoredDirs: string[]
}

interface RouteScanTarget {
  rootDir: string
  kind: FileKind
  options?: CollectRouteFileOptions
}

/** 文件路由 Vite 插件。 */
export default function fileRouterPlugin(): PluginOption {
  let config: ResolvedConfig | undefined
  let knownRouteFiles = new Set<string>()

  return {
    name: 'vite-plugin-file-router',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    configureServer(server) {
      const createStructureChangeHandler = (event: StructureChangeEvent) => (file: string) => {
        if (!config || !isInsideSrc(config.root, file)) {
          return
        }
        if (!shouldRefreshVirtualRoutes(config.root, file, event, knownRouteFiles)) {
          return
        }
        refreshVirtualRoutes(server)
      }
      for (const event of STRUCTURE_CHANGE_EVENTS) {
        server.watcher.on(event, createStructureChangeHandler(event))
      }
    },
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID || !config) {
        return null
      }
      const routeFiles = scanRouteFiles(config.root)
      knownRouteFiles = new Set(routeFiles.map(routeFile => normalizeSlashes(routeFile.file)))
      return generateVirtualModule(routeFiles, this)
    }
  }
}

/** 生成虚拟路由模块。 */
function generateVirtualModule(routeFiles: RouteFile[], ctx: PluginContextLike): string {
  const routeCode = renderRoutes(buildRouteTree(routeFiles, ctx))
  return renderTemplate(VIRTUAL_MODULE_TEMPLATE_FILE, { ROUTES: routeCode })
}

/** 解析路由相关目录。 */
function resolveRouteRoots(root: string): RouteRoots {
  const srcDir = resolve(root, 'src')
  const pagesDir = resolve(srcDir, 'pages')
  const layoutsDir = resolve(srcDir, 'layouts')
  const routeRoot = existsSync(pagesDir) ? pagesDir : srcDir
  return {
    routeRoot,
    layoutsDir,
    routeRootIgnoredDirs: routeRoot === srcDir ? [layoutsDir] : []
  }
}

/** 解析所有路由文件。 */
function scanRouteFiles(root: string): RouteFile[] {
  return getRouteScanTargets(root).flatMap(target =>
    collectRouteFiles(target.rootDir, target.kind, target.options)
  )
}

/** 获取路由扫描配置。 */
function getRouteScanTargets(root: string): RouteScanTarget[] {
  const { routeRoot, layoutsDir, routeRootIgnoredDirs } = resolveRouteRoots(root)
  return [
    { rootDir: routeRoot, kind: 'page', options: { ignoredDirs: routeRootIgnoredDirs } },
    { rootDir: routeRoot, kind: 'layout', options: { ignoredDirs: routeRootIgnoredDirs } },
    { rootDir: layoutsDir, kind: 'layout', options: { allowRootIndexAsLayout: true } }
  ]
}

/** 收集页面或 layout 文件。 */
function collectRouteFiles(
  rootDir: string,
  kind: FileKind,
  options: CollectRouteFileOptions = {}
): RouteFile[] {
  if (!existsSync(rootDir)) {
    return []
  }
  const { ignoredDirs = [], allowRootIndexAsLayout = false } = options
  const ignoredDirSet = new Set(ignoredDirs.map(dir => normalizeSlashes(resolve(dir))))
  const routeFiles: RouteFile[] = []
  walkFiles(
    rootDir,
    file => {
      const routeFile = toRouteFile(file, rootDir, kind, allowRootIndexAsLayout)
      if (routeFile) {
        routeFiles.push(routeFile)
      }
    },
    ignoredDirSet
  )
  return routeFiles.sort((left, right) => left.file.localeCompare(right.file))
}

/** 递归遍历目录。 */
function walkFiles(
  dir: string,
  onFile: (file: string) => void,
  ignoredDirs: Set<string> = new Set()
): void {
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry)
    const normalizedPath = normalizeSlashes(fullPath)
    if (ignoredDirs.has(normalizedPath)) {
      continue
    }
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      walkFiles(fullPath, onFile, ignoredDirs)
      continue
    }
    if (stats.isFile()) {
      onFile(fullPath)
    }
  }
}

/** 解析单个路由文件。 */
function toRouteFile(
  file: string,
  rootDir: string,
  kind: FileKind,
  allowRootIndexAsLayout: boolean
): RouteFile | null {
  const relativeFile = normalizeSlashes(relative(rootDir, file))
  if (!isRouteFile(relativeFile, kind, allowRootIndexAsLayout)) {
    return null
  }
  return {
    file,
    importPath: normalizeImportPath(file),
    kind,
    routeSegments: parseRouteSegments(relativeFile, kind)
  }
}

/** 判断文件是否匹配路由约定。 */
function isRouteFile(relativeFile: string, kind: FileKind, allowRootIndexAsLayout = false): boolean {
  const fileName = getFileName(relativeFile)
  if (isInsideLayoutDir(relativeFile) && !isNestedLayoutIndexFile(relativeFile)) {
    return false
  }
  if (kind === 'page') {
    return isPageFile(fileName)
  }
  return (
    isLayoutFile(fileName) ||
    isNestedLayoutIndexFile(relativeFile) ||
    isRootIndexLayoutFile(relativeFile, fileName, allowRootIndexAsLayout)
  )
}

/** 判断是否为页面文件。 */
function isPageFile(fileName: string): boolean {
  return PAGE_FILE_RE.test(fileName) && !LAYOUT_FILE_RE.test(fileName)
}

/** 判断是否为 layout 文件。 */
function isLayoutFile(fileName: string): boolean {
  return LAYOUT_FILE_RE.test(fileName)
}

/** 判断是否为 index 入口文件。 */
function isIndexFile(fileName: string): boolean {
  return INDEX_FILE_RE.test(fileName)
}

/** 判断是否为根 layout 目录下的 index 入口。 */
function isRootIndexLayoutFile(
  relativeFile: string,
  fileName: string,
  allowRootIndexAsLayout: boolean
): boolean {
  return allowRootIndexAsLayout && relativeFile === fileName && isIndexFile(fileName)
}

/** 解析文件路径对应的路由片段。 */
function parseRouteSegments(relativeFile: string, kind: FileKind): string[] {
  const pathWithoutExtension = relativeFile.replace(FILE_EXTENSION_RE, '')
  const pathParts = pathWithoutExtension.split('/')
  const fileName = pathParts.pop() ?? ''
  const directoryParts =
    kind === 'layout' && fileName === 'index' && pathParts.at(-1) === 'layout'
      ? pathParts.slice(0, -1)
      : pathParts

  return [
    ...directoryParts.flatMap(splitRouteToken),
    ...parseFileNameSegments(fileName, kind)
  ].filter(isRouteSegment)
}

/** 解析文件名中的路由片段。 */
function parseFileNameSegments(fileName: string, kind: FileKind): string[] {
  const suffix = kind === 'layout' ? '.layout' : '.page'
  const bareName = kind === 'layout' ? 'layout' : 'page'
  if (fileName === bareName) {
    return []
  }
  if (fileName.endsWith(suffix)) {
    return splitRouteToken(fileName.slice(0, -suffix.length))
  }
  return splitRouteToken(fileName)
}

/** 判断路由片段是否有效。 */
function isRouteSegment(segment: string): boolean {
  return segment.length > 0 && segment !== 'index'
}

/** 拆分并规范化单个路径片段。 */
function splitRouteToken(token: string): string[] {
  return token.split('.').filter(Boolean).map(normalizeRouteSegment)
}

/** 规范化单个路由片段。 */
function normalizeRouteSegment(segment: string): string {
  if (segment === '404') {
    return '*'
  }
  const dynamicMatch = DYNAMIC_SEGMENT_RE.exec(segment)
  return dynamicMatch ? `:${dynamicMatch[1]}` : segment
}

/** 判断是否为目录式 layout 入口。 */
function isNestedLayoutIndexFile(relativeFile: string): boolean {
  return NESTED_LAYOUT_INDEX_RE.test(relativeFile)
}

/** 判断是否位于 `layout` 目录内。 */
function isInsideLayoutDir(relativeFile: string): boolean {
  return relativeFile.split('/').slice(0, -1).includes('layout')
}

/** 获取路径中的文件名。 */
function getFileName(relativeFile: string): string {
  return relativeFile.split('/').at(-1) ?? relativeFile
}

/** 判断结构变更是否需要刷新虚拟路由。 */
function shouldRefreshVirtualRoutes(
  root: string,
  file: string,
  event: StructureChangeEvent,
  knownRouteFiles: Set<string>
): boolean {
  const normalizedFile = normalizeSlashes(file)
  if (event === 'add' || event === 'unlink') {
    return isRoutableFilePath(root, normalizedFile)
  }
  if (isPagesDir(root, normalizedFile)) {
    return true
  }
  return event === 'unlinkDir' && containsKnownRouteFile(knownRouteFiles, normalizedFile)
}

/** 判断文件路径是否可能影响 routes。 */
function isRoutableFilePath(root: string, file: string): boolean {
  return getRouteScanTargets(root).some(target => matchesRouteScanTarget(file, target))
}

/** 判断文件是否命中某个扫描配置。 */
function matchesRouteScanTarget(file: string, target: RouteScanTarget): boolean {
  const relativeFile = getRelativeFileIfInsideTarget(file, target)
  if (!relativeFile) {
    return false
  }
  return isRouteFile(relativeFile, target.kind, target.options?.allowRootIndexAsLayout)
}

/** 获取文件在扫描目标内的相对路径。 */
function getRelativeFileIfInsideTarget(file: string, target: RouteScanTarget): string | null {
  const normalizedRootDir = normalizeSlashes(resolve(target.rootDir))
  if (file === normalizedRootDir || !file.startsWith(`${normalizedRootDir}/`)) {
    return null
  }
  if (isInsideIgnoredDir(file, target.options?.ignoredDirs ?? [])) {
    return null
  }
  return normalizeSlashes(relative(normalizedRootDir, file))
}

/** 判断文件是否位于忽略目录中。 */
function isInsideIgnoredDir(file: string, ignoredDirs: string[]): boolean {
  return ignoredDirs.some(dir => {
    const normalizedDir = normalizeSlashes(resolve(dir))
    return file === normalizedDir || file.startsWith(`${normalizedDir}/`)
  })
}

/** 判断路径是否是 `src/pages` 目录。 */
function isPagesDir(root: string, file: string): boolean {
  return normalizeSlashes(resolve(root, 'src/pages')) === file
}

/** 判断目录下是否包含已知路由文件。 */
function containsKnownRouteFile(knownRouteFiles: Set<string>, dir: string): boolean {
  const normalizedDir = normalizeSlashes(dir)
  for (const routeFile of knownRouteFiles) {
    if (routeFile.startsWith(`${normalizedDir}/`)) {
      return true
    }
  }
  return false
}

/** 渲染模板。 */
function renderTemplate(templateFile: string, replacements: Record<string, string>): string {
  let content = readTemplateFile(templateFile)
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(`__${key}__`, value)
  }
  return content
}

/** 读取模板文件。 */
function readTemplateFile(templateFile: string): string {
  let content = TEMPLATE_CONTENT_CACHE.get(templateFile)
  if (!content) {
    content = readFileSync(resolve(TEMPLATE_DIR, templateFile), 'utf8')
    TEMPLATE_CONTENT_CACHE.set(templateFile, content)
  }
  return content
}

/** 构建路由树。 */
function buildRouteTree(files: RouteFile[], ctx: PluginContextLike): RouteNode {
  const root = createNode(null)
  for (const routeFile of files) {
    const node = ensureRouteNode(root, routeFile.routeSegments)
    attachRouteFile(node, routeFile, ctx)
  }
  return root
}

/** 确保路由树节点存在。 */
function ensureRouteNode(root: RouteNode, segments: string[]): RouteNode {
  let current = root
  for (const segment of segments) {
    let child = current.children.get(segment)
    if (!child) {
      child = createNode(segment)
      current.children.set(segment, child)
    }
    current = child
  }
  return current
}

/** 挂载页面或 layout 文件。 */
function attachRouteFile(node: RouteNode, routeFile: RouteFile, ctx: PluginContextLike): void {
  const previous = routeFile.kind === 'page' ? node.page : node.layout
  if (previous) {
    ctx.warn(createDuplicateRouteWarning(previous, routeFile))
  }
  if (routeFile.kind === 'page') {
    node.page = routeFile
  } else {
    node.layout = routeFile
  }
}

/** 生成重复路由告警。 */
function createDuplicateRouteWarning(previous: RouteFile, next: RouteFile): string {
  return (
    `[vite-plugin-file-router] Duplicate ${next.kind} route "${toRoutePath(next.routeSegments)}": ` +
    `"${previous.file}" will be replaced by "${next.file}".`
  )
}

/** 创建空路由节点。 */
function createNode(segment: string | null): RouteNode {
  return {
    segment,
    children: new Map()
  }
}

/** 渲染根路由数组。 */
function renderRoutes(root: RouteNode): string {
  return renderArray(renderRouteEntries(root, [], true))
}

/** 递归渲染路由节点。 */
function renderRouteEntries(
  node: RouteNode,
  parentSegments: string[] = [],
  isRoot = false
): string[] {
  const currentSegments = node.segment ? [...parentSegments, node.segment] : [...parentSegments]
  const childSegments = node.page || node.layout ? [] : currentSegments
  const renderedChildren = getSortedChildren(node).flatMap(child =>
    renderRouteEntries(child, childSegments)
  )
  if (!node.page && !node.layout) {
    return renderedChildren
  }
  return [renderRouteObject(buildRouteProps(node, currentSegments, renderedChildren, isRoot))]
}

/** 生成单个路由对象的属性。 */
function buildRouteProps(
  node: RouteNode,
  segments: string[],
  renderedChildren: string[],
  isRoot: boolean
): string[] {
  if (isRoot && node.page && !node.layout && renderedChildren.length === 0) {
    return [
      renderPathProperty([]),
      renderRouteMetaProperty(false),
      renderLazyProperty(node.page)
    ]
  }
  const props: string[] = isRoot ? [] : [renderPathProperty(segments)]
  const children = [...renderedChildren]
  if (node.page && (node.layout || children.length > 0)) {
    children.unshift(renderIndexRoute(node.page))
  } else if (node.page) {
    props.push(renderRouteMetaProperty(false), renderLazyProperty(node.page))
  }
  if (node.layout) {
    props.push(renderRouteMetaProperty(true), renderLazyProperty(node.layout))
  }
  if (children.length > 0) {
    props.push(renderChildrenProperty(children))
  }
  return props
}

/** 获取排序后的子节点。 */
function getSortedChildren(node: RouteNode): RouteNode[] {
  return Array.from(node.children.values()).sort(compareNodes)
}

/** 渲染路由对象。 */
function renderRouteObject(props: string[]): string {
  return `{\n${indent(props.join(',\n'))}\n}`
}

/** 渲染路由数组。 */
function renderArray(routes: string[]): string {
  return routes.length > 0 ? `[\n${indent(routes.join(',\n'))}\n]` : '[]'
}

/** 渲染 path 属性。 */
function renderPathProperty(segments: string[]): string {
  return `path: ${JSON.stringify(joinRoutePath(segments))}`
}

/** 渲染 lazy 属性。 */
function renderLazyProperty(routeFile: RouteFile): string {
  return `lazy: ${renderLazyLoader(routeFile.importPath)}`
}

/** 渲染文件路由元信息。 */
function renderRouteMetaProperty(isLayout: boolean): string {
  return `__fileRouter: { isLayout: ${JSON.stringify(isLayout)} }`
}

/** 渲染索引路由。 */
function renderIndexRoute(routeFile: RouteFile): string {
  return `{ index: true, ${renderRouteMetaProperty(false)}, lazy: ${renderLazyLoader(routeFile.importPath)} }`
}

/** 渲染 children 属性。 */
function renderChildrenProperty(routes: string[]): string {
  return `children: ${renderArray(routes)}`
}

/** 渲染 lazy loader。 */
function renderLazyLoader(importPath: string): string {
  return `() => import(${JSON.stringify(importPath)})`
}

/** 比较两个路由节点。 */
function compareNodes(left: RouteNode, right: RouteNode): number {
  if (left.segment === '*' && right.segment !== '*') {
    return 1
  }
  if (left.segment !== '*' && right.segment === '*') {
    return -1
  }
  return (left.segment ?? '').localeCompare(right.segment ?? '')
}

/** 拼接完整路由路径。 */
function toRoutePath(segments: string[]): string {
  return segments.length > 0 ? `/${segments.join('/')}` : '/'
}

/** 拼接路由 path 值。 */
function joinRoutePath(segments: string[]): string {
  return segments.length > 0 ? segments.join('/') : '/'
}

/** 转换为 `/@fs/` 导入路径。 */
function normalizeImportPath(file: string): string {
  const normalized = normalizeSlashes(file)
  return normalized.startsWith('/') ? `/@fs${normalized}` : `/@fs/${normalized}`
}

/** 统一路径分隔符。 */
function normalizeSlashes(value: string): string {
  return value.replaceAll('\\', '/')
}

/** 缩进多行字符串。 */
function indent(value: string): string {
  return value
    .split('\n')
    .map(line => `  ${line}`)
    .join('\n')
}

/** 判断是否位于 `src` 下。 */
function isInsideSrc(root: string, file: string): boolean {
  const srcDir = normalizeSlashes(resolve(root, 'src'))
  const normalizedFile = normalizeSlashes(file)
  return normalizedFile === srcDir || normalizedFile.startsWith(`${srcDir}/`)
}

/** 刷新虚拟路由模块。 */
function refreshVirtualRoutes(server: ViteDevServer): void {
  invalidateVirtualModule(server)
  server.ws.send({ type: 'full-reload' })
}

/** 失效虚拟路由模块缓存。 */
function invalidateVirtualModule(server: ViteDevServer): void {
  const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
  if (module) {
    server.moduleGraph.invalidateModule(module)
  }
}

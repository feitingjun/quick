import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { renderHbsTpl } from '@quick/utils'
import { RouteManifest, AddFileOptions, MakePropertyOptional } from './types'

const __dirname = import.meta.dirname
const TML_DIR = resolve(__dirname, 'template')

// 深拷贝
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**创建.quick/index.ts文件 */
export function writeIndexts(outDir: string, exports?: AddFileOptions[]) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'index.ts.hbs'),
    outPath: resolve(outDir, 'index.ts'),
    data: { exports }
  })
}
/**创建.quick/entry.tsx文件 */
export function writeEntryTsx(
  outDir: string,
  srcDir: string,
  data: {
    imports: MakePropertyOptional<AddFileOptions, 'specifier'>[]
    aheadCodes: string[]
    tailCodes: string[]
  }
) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'entry.tsx.hbs'),
    outPath: resolve(outDir, 'entry.tsx'),
    data: {
      ...data,
      srcDir: resolve(outDir, '..', srcDir)
    }
  })
}

/**写入.quick/types.ts */
export function writeTypesTs(
  outDir: string,
  pageConfigTypes: AddFileOptions[] = [],
  appConfigTypes: AddFileOptions[] = []
) {
  const all = deepClone([...pageConfigTypes, ...appConfigTypes]).reduce(
    (acc, item) => {
      const index = acc.findIndex(v => v.source === item.source)
      if (
        index > -1 &&
        Array.isArray(item.specifier) &&
        Array.isArray(acc[index].specifier)
      ) {
        acc[index].specifier = [...acc[index].specifier, ...item.specifier]
      } else {
        acc.push(item)
      }
      return acc
    },
    [] as AddFileOptions[]
  )
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'types.ts.hbs'),
    outPath: resolve(outDir, 'types.ts'),
    data: { all, pageConfigTypes, appConfigTypes }
  })
}

/**写入.quick/define.ts */
export function writeDefineTs(outDir: string, srcDir: string) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'define.ts.hbs'),
    outPath: `${outDir}/define.ts`,
    data: {
      srcDir: resolve(outDir, '..', srcDir)
    }
  })
}

/**写入.quick/manifest.ts */
export function writeRoutesTs(outDir: string, manifest: RouteManifest) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'manifest.ts.hbs'),
    outPath: resolve(outDir, 'manifest.ts'),
    data: {
      manifest: Object.values(manifest).sort((a, b) => {
        const nA = a.id.replace(/\/?layout/, ''),
          nB = b.id.replace(/\/?layout/, '')
        return nA.length === nB.length
          ? b.id.indexOf('layout')
          : nA.length - nB.length
      })
    }
  })
}

/**写入.quick/runtimes.ts */
export function wirteRuntime(outDir: string, runtimes?: string[]) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'runtime.ts.hbs'),
    outPath: resolve(outDir, 'runtime.ts'),
    data: { runtimes }
  })
}

/**写入.quick/typings.d.ts */
export function wirteTypings(outDir: string) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'typings.d.ts.hbs'),
    outPath: resolve(outDir, 'typings.d.ts')
  })
}

/**创建临时文件夹 */
export function createTmpDir({
  root,
  srcDir,
  options
}: {
  root: string
  srcDir: string
  options: {
    manifest?: RouteManifest
    pageConfigTypes: AddFileOptions[]
    appConfigTypes: AddFileOptions[]
    exports: AddFileOptions[]
    imports: MakePropertyOptional<AddFileOptions, 'specifier'>[]
    aheadCodes: string[]
    tailCodes: string[]
    runtimes: string[]
  }
}) {
  const {
    manifest = {},
    pageConfigTypes,
    appConfigTypes,
    exports,
    imports,
    aheadCodes,
    tailCodes,
    runtimes
  } = options
  const outDir = resolve(root, '.quick')
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }
  // 创建.quick/index.ts文件
  writeIndexts(outDir, exports)
  // 创建.quick/entry.tsx
  writeEntryTsx(outDir, srcDir, {
    imports,
    aheadCodes,
    tailCodes
  })
  // 创建.quick/types.ts
  writeTypesTs(outDir, pageConfigTypes, appConfigTypes)
  // 创建.quick/define.ts
  writeDefineTs(outDir, srcDir)
  // 创建.quick/routes.ts
  writeRoutesTs(outDir, manifest)
  // 创建.quick/runtime.tsx
  wirteRuntime(outDir, runtimes)
  // 创建.quick/typings.d.ts
  wirteTypings(outDir)
}

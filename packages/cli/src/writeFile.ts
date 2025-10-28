import { readFileSync } from 'fs'
import { resolve } from 'path'
import { renderHbsTpl } from './hbs'

const __dirname = import.meta.dirname
const TML_DIR = resolve(__dirname, 'template')

/**写入package.json文件 */
export function writePackageJson(root: string, description: string) {
  const isDev = process.argv.includes('--development')
  const appPackageJson = readFileSync(resolve(__dirname, '../../app', 'package.json'), 'utf-8')
  const corePackageJson = readFileSync(resolve(__dirname, '../../core', 'package.json'), 'utf-8')
  const appVersion = JSON.parse(appPackageJson).version
  const coreVersion = JSON.parse(corePackageJson).version

  const path = root.split('/')
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'package.json.hbs'),
    outPath: resolve(root, 'package.json'),
    data: {
      projectName: path[path.length - 1],
      description,
      appVersion: isDev ? 'workspace:*' : appVersion,
      coreVersion: isDev ? 'workspace:*' : coreVersion
    }
  })
}

/**写入tsconfig.json文件 */
export function writeTsConfigJson(root: string, srcDir: string) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'tsconfig.json.hbs'),
    outPath: resolve(root, 'tsconfig.json'),
    data: { srcDir, srcDirRoot: srcDir.split('/')[0] }
  })
}

/**写入app.ts文件 */
export function writeAppTs(root: string, srcDir: string) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'app.tsx.hbs'),
    outPath: resolve(root, srcDir, 'app.tsx')
  })
}

/**写入page.tsx文件 */
export function writeIndexPageTsx(root: string, srcDir: string) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'page.tsx.hbs'),
    outPath: resolve(root, srcDir, 'page.tsx')
  })
}

/**写入vite.config.ts文件 */
export function writeViteConfigTs(root: string) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'vite.config.ts.hbs'),
    outPath: resolve(root, 'vite.config.ts')
  })
}

/**写入index.html */
export function writeIndexHtml(root: string) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, 'index.html.hbs'),
    outPath: resolve(root, 'index.html')
  })
}

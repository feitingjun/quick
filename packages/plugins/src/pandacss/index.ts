import { resolve, join } from 'path'
import { existsSync } from 'fs'
import { loadConfigAndCreateContext, codegen } from '@pandacss/node'
import { definePlugin } from '@quick/core'

const configTml = (srcDir: string, outPath: string) =>
  `
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: ['./${srcDir}/**/*.{js,jsx,ts,tsx}'],
  exclude: ['.quick/**/*', 'node_modules'],
  jsxFramework: 'react',
  outdir: '${outPath}'
})
`.trim()

const postcssTml = `
module.exports = {
  plugins: {
    '@pandacss/dev/postcss': {}
  }
}
`.trim()

const generate = async (configPath: string) => {
  const ctx = await loadConfigAndCreateContext({
    configPath,
    cwd: process.cwd()
  })
  await codegen(ctx)
}

export default definePlugin({
  setup: async ({ context: { srcDir }, addWatch, addFile }) => {
    const pandacss = 'panda.config.ts'
    const configPath = resolve(process.cwd(), pandacss)
    const postcssPath = resolve(process.cwd(), 'postcss.config.cjs')
    const outPath = '.quick/pandacss'
    if (!existsSync(configPath)) {
      addFile({
        content: configTml(srcDir, outPath),
        outPath: resolve(process.cwd(), configPath)
      })
    }
    if (!existsSync(postcssPath)) {
      addFile({
        content: postcssTml,
        outPath: resolve(process.cwd(), postcssPath)
      })
    }
    // 生成pandacss文件
    await generate(configPath)
    addWatch((event, path) => {
      // 配置文件变化时重新生成
      if (path === configPath && (event === 'add' || event === 'change')) {
        generate(configPath)
      }
    })
  }
})

import { cpSync, existsSync } from 'node:fs'
import { defineConfig } from 'tsup'

export default defineConfig([
  // esm
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    outDir: 'dist',
    sourcemap: false,
    clean: true,
    splitting: false,
    onSuccess: async () => {
      if (existsSync('src/template')) {
        cpSync('src/template', 'dist/template', { recursive: true })
      }
    }
  }
])

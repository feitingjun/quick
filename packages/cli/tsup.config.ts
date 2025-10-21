import { defineConfig } from 'tsup'
import { cpSync } from 'fs'

export default defineConfig([
  // esm
  {
    entry: ['src/**/*.ts'],
    format: ['esm'],
    dts: true,
    outDir: 'dist',
    sourcemap: true,
    clean: true,
    onSuccess: async () => {
      cpSync('src/template', 'dist/template', { recursive: true })
    }
  }
])

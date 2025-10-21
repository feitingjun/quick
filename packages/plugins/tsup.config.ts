// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig([
  // esm
  {
    entry: ['src/**/*.ts'],
    format: ['esm'],
    dts: true,
    outDir: 'dist',
    sourcemap: true,
    clean: true
  }
])

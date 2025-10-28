// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig([
  // esm
  {
    entry: ['src/**/*.ts{,x}'],
    format: ['esm'],
    dts: true,
    outDir: 'dist',
    sourcemap: true,
    clean: true,
    splitting: false
  }
])

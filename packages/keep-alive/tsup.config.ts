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
    splitting: false
  }
])

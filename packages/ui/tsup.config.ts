// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig(options => [
  // esm
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts:
      options.env?.NODE_ENV === 'development'
        ? {
            entry: ['src/index.ts']
          }
        : true,
    outDir: 'dist',
    treeshake: true,
    sourcemap: options.env?.NODE_ENV === 'development',
    clean: true,
    splitting: true
  }
])

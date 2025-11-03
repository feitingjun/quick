// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig(options => [
  // esm
  {
    entry: ['src/**/*.ts{,x}'],
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
    external: ['react', 'react-dom', 'antd', '@quick/cssinjs'],
    clean: true,
    splitting: false
  }
])

import { resolve } from 'path'
import { definePlugin } from '@quick/core'

export default definePlugin({
  setup: ({ addExport }) => {
    addExport({
      specifier: ['atom', 'useAtom'],
      source: resolve(import.meta.dirname, 'jotai')
    })
  }
})

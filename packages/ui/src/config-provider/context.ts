import { createContext } from 'react'
import type { Dicts } from '@/dicts/types'

export const ConfigContext = createContext<{
  dicts: Dicts
}>({
  dicts: {}
})

import { createContext } from 'react'
import { Dicts } from '@/dicts/types'

export const ConfigContext = createContext<{
  dicts: Dicts
}>({
  dicts: {}
})

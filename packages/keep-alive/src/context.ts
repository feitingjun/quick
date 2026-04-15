import { createContext } from 'react'
import type { CacheStore } from './cacheStore'
import type { KeepAliveContextValue } from './types'

export const ScopeContext = createContext<CacheStore | null>(null)
export const KeepAliveContext = createContext<KeepAliveContextValue | null>(null)

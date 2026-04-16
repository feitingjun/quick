import { createContext } from 'react'
import { CacheStore, CacheNode } from './cacheStore'

export const ScopeContext = createContext<CacheStore | null>(null)

export const CacheNodeContext = createContext<CacheNode | null>(null)

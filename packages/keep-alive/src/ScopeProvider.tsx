import { type ReactNode, useRef } from 'react'
import { CacheStore } from './cacheStore'
import { ScopeContext } from './context'

export function ScopeProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<CacheStore | null>(null)

  if (storeRef.current === null) {
    storeRef.current = new CacheStore()
  }

  return <ScopeContext.Provider value={storeRef.current}>{children}</ScopeContext.Provider>
}

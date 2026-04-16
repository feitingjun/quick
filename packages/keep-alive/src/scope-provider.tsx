import { useRef, type ReactNode } from 'react'
import { ScopeContext } from './context'
import { CacheStore } from './cacheStore'

export default function ScopeProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<CacheStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = new CacheStore()
  }
  return <ScopeContext.Provider value={storeRef.current}>{children}</ScopeContext.Provider>
}

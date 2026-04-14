import { type ReactNode, useRef, useCallback } from 'react'
import { ScopeContext } from './context'
import { CacheStore } from './cacheStore'
import { CacheRenderer } from './CacheRenderer'

/**
 * AliveScope：缓存容器，必须包裹在应用顶层
 * 所有 KeepAlive 组件必须在其内部才能生效
 */
export function ScopeProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<CacheStore | null>(null)
  if (storeRef.current === null) {
    storeRef.current = new CacheStore()
  }
  const store = storeRef.current
  // 所有失活缓存都会暂存在这个停车场节点下，直到再次激活。
  const setParkingRoot = useCallback(
    (node: HTMLDivElement | null) => {
      store.setParkingRoot(node)
    },
    [store]
  )

  return (
    <ScopeContext.Provider value={store}>
      {children}
      <CacheRenderer store={store} parkingRootRef={setParkingRoot} />
    </ScopeContext.Provider>
  )
}

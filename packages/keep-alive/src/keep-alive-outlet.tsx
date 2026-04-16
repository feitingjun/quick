import { useContext, useLayoutEffect, useEffect, useSyncExternalStore, Activity } from 'react'
import { useLocation, useOutlet } from 'react-router'
import { ScopeContext, CacheNodeContext } from './context'
import { CacheStore, CacheNode } from './cacheStore'
import type { KeepAliveOutletProps } from './types'

const CacheItem = ({ cacheNode }: { cacheNode: CacheNode; store: CacheStore }) => {
  const active = useSyncExternalStore(
    listener => cacheNode.subscribe(listener),
    () => cacheNode.getActive(),
    () => cacheNode.getActive()
  )
  // 触发销毁监听器
  useEffect(() => {
    return () => {
      cacheNode.emitDestroy()
    }
  }, [])
  return (
    <Activity mode={active ? 'visible' : 'hidden'} name={cacheNode.cacheId}>
      <CacheNodeContext.Provider value={cacheNode}>
        {cacheNode.getOutlet()}
      </CacheNodeContext.Provider>
    </Activity>
  )
}

export default function KeepAliveOutlet({ cacheId, cacheProps }: KeepAliveOutletProps) {
  const store = useContext(ScopeContext)
  const outlet = useOutlet()
  const { pathname } = useLocation()
  const currentId = cacheId ?? pathname

  const cacheNodes = useSyncExternalStore(
    listener => store?.subscribe(listener) ?? (() => {}),
    () => store?.getCacheNodes() ?? [],
    () => store?.getCacheNodes() ?? []
  )

  useLayoutEffect(() => {
    if (!store || !outlet) {
      return
    }
    const cacheNode = store.getOrCreate(currentId, outlet, cacheProps)
    if (!cacheNode.getActive()) {
      store.activate(currentId)
    }
  }, [currentId, store, outlet, cacheProps])

  if (!store) {
    return outlet
  }

  return cacheNodes.map(cacheNode => (
    <CacheItem key={cacheNode.cacheId} cacheNode={cacheNode} store={store} />
  ))
}

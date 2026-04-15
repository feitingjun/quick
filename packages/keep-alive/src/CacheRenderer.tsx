import {
  type ComponentType,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore
} from 'react'
import { createPortal } from 'react-dom'
import { KeepAliveContext } from './context'
import type { CacheEntry, CacheStore } from './cacheStore'
import type { BridgeProvider } from './types'

function BridgeProviders({
  bridges,
  children
}: {
  bridges: readonly BridgeProvider[]
  children: ReactNode
}) {
  // 按 provider 从外到内恢复，使缓存树重新接上原位置的 context。
  return bridges.reduceRight<ReactNode>((accumulator, bridge) => {
    const Provider = bridge.context as unknown as ComponentType<{
      value: unknown
      children?: ReactNode
    }>
    return <Provider value={bridge.value}>{accumulator}</Provider>
  }, children)
}

function CacheItem({ entry, store }: { entry: CacheEntry; store: CacheStore }) {
  const snapshot = useSyncExternalStore(
    listener => entry.subscribe(listener),
    () => entry.getSnapshot(),
    () => entry.getSnapshot()
  )
  const portalContainerRef = useRef<HTMLDivElement>(document.createElement('div'))

  useLayoutEffect(() => {
    entry.setPortalContainer(portalContainerRef.current)
    return () => {
      entry.setPortalContainer(null)
    }
  }, [entry])

  useEffect(() => {
    entry.flushPendingLifecycleEffects()
    if (entry.isPendingDestroy()) {
      store.finalizeDestroy(entry)
    }
  }, [entry, store, snapshot])

  return createPortal(
    <BridgeProviders bridges={snapshot.bridge}>
      <KeepAliveContext.Provider value={entry.getLifecycleContextValue()}>
        {snapshot.children}
      </KeepAliveContext.Provider>
    </BridgeProviders>,
    portalContainerRef.current
  )
}

export function CacheRenderer({
  store,
  parkingRootRef
}: {
  store: CacheStore
  parkingRootRef: (node: HTMLDivElement | null) => void
}) {
  const entries = useSyncExternalStore(
    listener => store.subscribe(listener),
    store.getEntriesSnapshot,
    store.getEntriesSnapshot
  )
  return (
    <>
      <div
        ref={parkingRootRef}
        hidden
        style={{ display: 'none' }}
        data-keep-alive-root='parking'
      />
      {entries.map(entry => (
        <CacheItem key={entry.name} entry={entry} store={store} />
      ))}
    </>
  )
}

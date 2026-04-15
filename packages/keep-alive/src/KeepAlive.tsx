import { type ReactNode, use, useContext, useLayoutEffect, useRef, useState } from 'react'
import { ScopeContext, KeepAliveContext } from './context'
import { collectBridgeProviders } from './fiberBridge'
import type { CacheEntry } from './cacheStore'
import type { BridgeProvider, KeepAliveProps } from './types'

function equalBridgeContexts(left: readonly BridgeProvider[], right: readonly BridgeProvider[]) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((bridge, index) => bridge.context === right[index]?.context)
}

function equalBridgeValues(left: readonly BridgeProvider[], right: readonly BridgeProvider[]) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((bridge, index) => {
    const next = right[index]
    return bridge.context === next?.context && Object.is(bridge.value, next.value)
  })
}

function BridgeTracker({
  entry,
  bridges
}: {
  entry: CacheEntry
  bridges: readonly BridgeProvider[]
}) {
  const lastReconciledBridgesRef = useRef<BridgeProvider[]>([])
  const lastEntryRef = useRef<CacheEntry | null>(null)
  const liveBridges = bridges.map(bridge => ({
    context: bridge.context,
    value: use(bridge.context)
  }))

  useLayoutEffect(() => {
    if (
      lastEntryRef.current === entry &&
      equalBridgeValues(lastReconciledBridgesRef.current, liveBridges)
    ) {
      return
    }

    lastEntryRef.current = entry
    lastReconciledBridgesRef.current = liveBridges
    entry.reconcile({ bridge: liveBridges })
  }, [entry, liveBridges])

  return null
}

/**
 * KeepAlive：将其 children 缓存起来
 *
 * 用法：
 * <KeepAlive name={`user-${userId}`} title="用户详情">
 *   <UserDetail id={userId} />
 * </KeepAlive>
 *
 * 通过 useAliveController().cachingNodes 可获取所有缓存节点信息，
 * 包括 name、active、props（含 title 等自定义属性）。
 */
export function KeepAlive({ name, children, ...restProps }: KeepAliveProps): ReactNode {
  const anchorRef = useRef<HTMLDivElement>(null)
  const store = useContext(ScopeContext)
  const parentKeepAlive = useContext(KeepAliveContext)
  const [trackedBridges, setTrackedBridges] = useState<BridgeProvider[]>([])
  const entry = store?.get(name) ?? null
  // 首次注册
  useLayoutEffect(() => {
    if (!store) {
      return
    }
    const anchor = anchorRef.current
    if (!anchor) {
      return
    }
    const entry = store.getOrCreate(name)
    entry.reconcile({
      target: anchor
    })
    return () => {
      entry.reconcile({ target: null })
    }
  }, [store, name])

  // 依赖更新
  useLayoutEffect(() => {
    if (!store) {
      return
    }
    const anchor = anchorRef.current
    const entry = store.get(name)
    if (!anchor || !entry) {
      return
    }
    const nextBridge = collectBridgeProviders(anchor)
    entry.reconcile({
      parentActive: parentKeepAlive?.getActive() ?? true,
      children,
      props: restProps,
      bridge: nextBridge
    })
    setTrackedBridges(current => (equalBridgeContexts(current, nextBridge) ? current : nextBridge))
  }, [store, name, parentKeepAlive, children, restProps])

  // 嵌套缓存
  useLayoutEffect(() => {
    if (!store) {
      return
    }
    const entry = store.get(name)
    if (!entry) {
      return
    }
    entry.reconcile({
      parentActive: parentKeepAlive?.getActive() ?? true
    })
    if (!parentKeepAlive) {
      return
    }
    // 嵌套 KeepAlive 时，子缓存跟随父缓存的 active 状态变化。
    return parentKeepAlive.addActiveListener(active => {
      entry.reconcile({ parentActive: active })
    })
  }, [store, name, parentKeepAlive])

  if (!store) {
    return children
  }

  return (
    <>
      <div ref={anchorRef} data-keep-alive-anchor={name} />
      {entry && trackedBridges.length > 0 ? (
        <BridgeTracker entry={entry} bridges={trackedBridges} />
      ) : null}
    </>
  )
}

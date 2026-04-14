import { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { ScopeContext, KeepAliveContext } from './context'
import { collectBridgeProviders } from './fiberBridge'
import type { KeepAliveProps } from './types'

const useSafeLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

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
export function KeepAlive({ name, children, ...restProps }: KeepAliveProps) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const store = useContext(ScopeContext)
  const parentKeepAlive = useContext(KeepAliveContext)
  // 首次注册
  useSafeLayoutEffect(() => {
    if (!store) {
      return
    }
    const anchor = anchorRef.current
    if (!anchor) {
      return
    }
    const entry = store.getOrCreate(name)
    // 首次注册时记录占位点和当前 provider 链，后面只增量同步内容。
    entry.reconcile({
      target: anchor,
      parentActive: parentKeepAlive?.getActive() ?? true,
      children,
      props: restProps,
      bridge: collectBridgeProviders(anchor)
    })
    return () => {
      entry.reconcile({ target: null })
    }
  }, [store, name])

  // 依赖更新
  useSafeLayoutEffect(() => {
    if (!store) {
      return
    }
    const anchor = anchorRef.current
    const entry = store.get(name)
    if (!anchor || !entry) {
      return
    }
    entry.reconcile({
      children,
      props: restProps,
      bridge: collectBridgeProviders(anchor)
    })
  }, [store, name, children, restProps])

  // 嵌套缓存
  useSafeLayoutEffect(() => {
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

  return <div ref={anchorRef} data-keep-alive-anchor={name} />
}

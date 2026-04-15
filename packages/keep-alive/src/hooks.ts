import { useEffect, useLayoutEffect, useContext, useRef, useSyncExternalStore } from 'react'
import { ScopeContext, KeepAliveContext } from './context'
import type { CacheNode } from './types'

/**
 * 获取缓存控制器
 *
 * 返回：
 * - destroy(name) - 销毁指定缓存
 * - destroyAll() - 销毁所有缓存
 * - cachingNodes() - 获取缓存列表
 */
export function useAliveController() {
  const store = useContext(ScopeContext)
  // 此处不能使用store.getCachingNodes(),因为他每次返回一个新的对象，会导致useSyncExternalStore无限渲染。
  const snapshots = useSyncExternalStore(
    listener => store?.subscribe(listener) ?? (() => {}),
    () => store?.getEntriesSnapshot() ?? [],
    () => store?.getEntriesSnapshot() ?? []
  )
  const destroy = (name: string | string[]) => store?.destroy(name)
  const destroyAll = () => store?.destroyAll()
  return {
    destroy,
    destroyAll,
    cachingNodes: snapshots.reduce<CacheNode[]>((cacheNodes, entry) => {
      const cacheNode = entry.getCacheNode()
      if (cacheNode) {
        cacheNodes.push(cacheNode)
      }
      return cacheNodes
    }, [])
  }
}

/**
 * 缓存组件激活时执行
 */
export function useActivate(fn: () => void) {
  const ctx = useContext(KeepAliveContext)
  useLayoutEffect(() => {
    if (!ctx) {
      return
    }
    return ctx.addActivateHook(fn)
  }, [ctx, fn])
}

/**
 * 缓存组件失活时执行
 * destroy 也会触发一次失活回调
 */
export function useUnactivate(fn: () => void) {
  const ctx = useContext(KeepAliveContext)
  useLayoutEffect(() => {
    if (!ctx) {
      return
    }
    return ctx.addUnactivateHook(fn)
  }, [ctx, fn])
}

/**
 * 跳过首次渲染的 useEffect
 */
export function useSkipFirstEffect(fn: () => void | (() => void), deps: unknown[]) {
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    return fn()
  }, deps)
}

/**
 * 跳过首次渲染的 useLayoutEffect
 */
export function useSkipFirstLayoutEffect(fn: () => void | (() => void), deps: unknown[]) {
  const mounted = useRef(false)
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    return fn()
  }, deps)
}

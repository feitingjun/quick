import {
  useContext,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useSyncExternalStore
} from 'react'
import type { CacheEntrySnapshot } from './cacheStore'
import { KeepAliveContext, ScopeContext } from './context'
import type { CacheNode } from './types'

const EMPTY_ENTRIES: CacheEntrySnapshot[] = []

export function useAliveController() {
  const store = useContext(ScopeContext)
  const snapshots = useSyncExternalStore(
    listener => store?.subscribe(listener) ?? (() => {}),
    () => store?.getEntriesSnapshot() ?? EMPTY_ENTRIES,
    () => store?.getEntriesSnapshot() ?? EMPTY_ENTRIES
  )

  return {
    destroy: (name: string | string[]) => store?.destroy(name),
    destroyAll: () => store?.destroyAll(),
    cachingNodes: snapshots.reduce<CacheNode[]>((nodes, entry) => {
      nodes.push({
        name: entry.name,
        active: entry.active,
        props: { ...entry.props }
      })
      return nodes
    }, [])
  }
}

export function useActivate(fn: () => void) {
  const ctx = useContext(KeepAliveContext)
  const onActivate = useEffectEvent(fn)

  useLayoutEffect(() => {
    if (!ctx?.active) {
      return
    }

    onActivate()
  }, [ctx?.active])
}

export function useUnactivate(fn: () => void) {
  const ctx = useContext(KeepAliveContext)
  const onUnactivate = useEffectEvent(fn)

  useLayoutEffect(() => {
    if (!ctx?.active) {
      return
    }

    return () => {
      onUnactivate()
    }
  }, [ctx?.active])
}

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

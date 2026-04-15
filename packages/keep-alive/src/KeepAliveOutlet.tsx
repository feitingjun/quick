import {
  Activity,
  type ReactNode,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useSyncExternalStore
} from 'react'
import { useLocation, useOutlet } from 'react-router'
import { type CacheEntrySnapshot, type CacheStore, createEntryId } from './cacheStore'
import { KeepAliveContext, ScopeContext } from './context'
import type { KeepAliveOutletProps } from './types'

const EMPTY_ENTRIES: CacheEntrySnapshot[] = []
const EMPTY_PROPS: Record<string, unknown> = {}

function CacheItem({ entry, store }: { entry: CacheEntrySnapshot; store: CacheStore }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const lastActiveRef = useRef(entry.active)

  useLayoutEffect(() => {
    const wasActive = lastActiveRef.current

    if (wasActive && !entry.active) {
      store.captureScrollPositions(entry.id, rootRef.current)
    }

    if (!wasActive && entry.active) {
      store.restoreScrollPositions(entry.id)
    }

    lastActiveRef.current = entry.active
  }, [entry.active, entry.id, store])

  return (
    <Activity mode={entry.active ? 'visible' : 'hidden'} name={entry.name}>
      <div ref={rootRef} data-keep-alive-root={entry.name} style={{ display: 'contents' }}>
        <KeepAliveContext.Provider value={{ active: entry.active, name: entry.name }}>
          {entry.element}
        </KeepAliveContext.Provider>
      </div>
    </Activity>
  )
}

function buildRenderedEntries(
  entries: CacheEntrySnapshot[],
  scopeId: string,
  currentName: string,
  currentProps: Record<string, unknown>,
  outlet: ReactNode
): CacheEntrySnapshot[] {
  const nextEntries = entries.map(entry => ({
    ...entry,
    active: outlet !== null && entry.name === currentName,
    props: entry.name === currentName ? currentProps : entry.props
  }))

  if (outlet === null || nextEntries.some(entry => entry.name === currentName)) {
    return nextEntries
  }

  return [
    ...nextEntries,
    {
      id: createEntryId(scopeId, currentName),
      scopeId,
      name: currentName,
      active: true,
      element: outlet,
      props: currentProps
    }
  ]
}

export function KeepAliveOutlet({
  context,
  name,
  cacheProps
}: KeepAliveOutletProps = {}) {
  const store = useContext(ScopeContext)
  const scopeId = useId()
  const location = useLocation()
  const outlet = useOutlet(context)
  const currentName = name ?? location.pathname
  const currentProps = cacheProps ?? EMPTY_PROPS
  const entriesSnapshot = useSyncExternalStore(
    listener => store?.subscribe(listener) ?? (() => {}),
    () => store?.getEntriesSnapshot() ?? EMPTY_ENTRIES,
    () => store?.getEntriesSnapshot() ?? EMPTY_ENTRIES
  )
  const scopedEntries = entriesSnapshot.filter(entry => entry.scopeId === scopeId)
  const renderedEntries = buildRenderedEntries(
    scopedEntries,
    scopeId,
    currentName,
    currentProps,
    outlet
  )

  useLayoutEffect(() => {
    if (!store) {
      return
    }

    return () => {
      store.clearScope(scopeId)
    }
  }, [scopeId, store])

  useLayoutEffect(() => {
    if (!store) {
      return
    }

    if (outlet === null) {
      store.deactivateScope(scopeId)
      return
    }

    store.syncScope({
      scopeId,
      name: currentName,
      element: outlet,
      props: currentProps
    })
  }, [currentName, currentProps, outlet, scopeId, store])

  if (!store) {
    return outlet
  }

  return renderedEntries.map(entry => <CacheItem key={entry.id} entry={entry} store={store} />)
}

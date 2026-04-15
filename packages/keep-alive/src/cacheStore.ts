import type { ReactNode } from 'react'
import type { CacheNode } from './types'

type StoreListener = () => void
type ScrollTarget = Window | HTMLElement

interface ScrollPosition {
  target: ScrollTarget
  top: number
  left: number
}

export interface CacheEntrySnapshot {
  id: string
  scopeId: string
  name: string
  active: boolean
  element: ReactNode
  props: Record<string, unknown>
}

interface SyncScopePayload {
  scopeId: string
  name: string
  element: ReactNode
  props?: Record<string, unknown>
}

function shallowEqualRecord(
  left: Record<string, unknown>,
  right: Record<string, unknown>
): boolean {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)

  if (leftKeys.length !== rightKeys.length) {
    return false
  }

  return leftKeys.every(key => Object.is(left[key], right[key]))
}

function isScrollableElement(node: HTMLElement): boolean {
  const style = window.getComputedStyle(node)
  const canScrollY =
    /(auto|scroll|overlay)/.test(style.overflowY) && node.scrollHeight > node.clientHeight
  const canScrollX =
    /(auto|scroll|overlay)/.test(style.overflowX) && node.scrollWidth > node.clientWidth

  return canScrollY || canScrollX
}

function collectAncestorScrollTargets(target: HTMLElement): ScrollTarget[] {
  const targets: ScrollTarget[] = []
  let current = target.parentElement

  while (current) {
    if (isScrollableElement(current)) {
      targets.push(current)
    }
    current = current.parentElement
  }

  if (document.scrollingElement && !targets.includes(window)) {
    targets.push(window)
  }

  return targets
}

function collectDescendantScrollTargets(root: HTMLElement): HTMLElement[] {
  const targets: HTMLElement[] = []

  if (isScrollableElement(root)) {
    targets.push(root)
  }

  root.querySelectorAll<HTMLElement>('*').forEach(node => {
    if (isScrollableElement(node)) {
      targets.push(node)
    }
  })

  return targets
}

function collectScrollTargets(root: HTMLElement): ScrollTarget[] {
  const targets: ScrollTarget[] = [...collectAncestorScrollTargets(root)]

  for (const node of collectDescendantScrollTargets(root)) {
    if (!targets.includes(node)) {
      targets.push(node)
    }
  }

  return targets
}

function readScrollPosition(target: ScrollTarget): ScrollPosition {
  if (target instanceof Window) {
    return {
      target,
      top: window.scrollY,
      left: window.scrollX
    }
  }

  return {
    target,
    top: target.scrollTop,
    left: target.scrollLeft
  }
}

function writeScrollPosition({ target, top, left }: ScrollPosition): void {
  if (target instanceof Window) {
    window.scrollTo(left, top)
    return
  }

  if (!target.isConnected) {
    return
  }

  target.scrollTop = top
  target.scrollLeft = left
}

export function createEntryId(scopeId: string, name: string): string {
  return `${scopeId}:${name}`
}

export class CacheStore {
  private readonly entries = new Map<string, CacheEntrySnapshot>()
  private readonly listeners = new Set<StoreListener>()
  private readonly scrollPositions = new Map<string, ScrollPosition[]>()
  private entriesSnapshot: CacheEntrySnapshot[] = []

  subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getEntriesSnapshot = (): CacheEntrySnapshot[] => {
    return this.entriesSnapshot
  }

  syncScope({ scopeId, name, element, props }: SyncScopePayload): void {
    const activeId = createEntryId(scopeId, name)
    const nextProps = { ...(props ?? {}) }
    let changed = false

    const current = this.entries.get(activeId)
    if (!current) {
      this.entries.set(activeId, {
        id: activeId,
        scopeId,
        name,
        active: true,
        element,
        props: nextProps
      })
      changed = true
    } else if (!current.active || !shallowEqualRecord(current.props, nextProps)) {
      this.entries.set(activeId, {
        ...current,
        active: true,
        props: nextProps
      })
      changed = true
    }

    this.entries.forEach((entry, id) => {
      if (id === activeId || entry.scopeId !== scopeId || !entry.active) {
        return
      }

      this.entries.set(id, {
        ...entry,
        active: false
      })
      changed = true
    })

    if (changed) {
      this.emit()
    }
  }

  deactivateScope(scopeId: string): void {
    let changed = false

    this.entries.forEach((entry, id) => {
      if (entry.scopeId !== scopeId || !entry.active) {
        return
      }

      this.entries.set(id, {
        ...entry,
        active: false
      })
      changed = true
    })

    if (changed) {
      this.emit()
    }
  }

  destroy(name: string | string[]): void {
    const names = typeof name === 'string' ? [name] : name
    let changed = false

    this.entries.forEach((entry, id) => {
      if (entry.active || !names.includes(entry.name)) {
        return
      }

      this.entries.delete(id)
      this.scrollPositions.delete(id)
      changed = true
    })

    if (changed) {
      this.emit()
    }
  }

  destroyAll(): void {
    let changed = false

    this.entries.forEach((entry, id) => {
      if (entry.active) {
        return
      }

      this.entries.delete(id)
      this.scrollPositions.delete(id)
      changed = true
    })

    if (changed) {
      this.emit()
    }
  }

  clearScope(scopeId: string): void {
    let changed = false

    this.entries.forEach((entry, id) => {
      if (entry.scopeId !== scopeId) {
        return
      }

      this.entries.delete(id)
      this.scrollPositions.delete(id)
      changed = true
    })

    if (changed) {
      this.emit()
    }
  }

  captureScrollPositions(id: string, root: HTMLElement | null): void {
    if (!root) {
      this.scrollPositions.delete(id)
      return
    }

    this.scrollPositions.set(id, collectScrollTargets(root).map(readScrollPosition))
  }

  restoreScrollPositions(id: string): void {
    const positions = this.scrollPositions.get(id)
    if (!positions?.length) {
      return
    }

    for (let index = positions.length - 1; index >= 0; index -= 1) {
      writeScrollPosition(positions[index])
    }
  }

  getCacheNodes(): CacheNode[] {
    return this.entriesSnapshot.map(entry => ({
      name: entry.name,
      active: entry.active,
      props: { ...entry.props }
    }))
  }

  private emit(): void {
    this.entriesSnapshot = Array.from(this.entries.values()).map(entry => ({
      ...entry,
      props: { ...entry.props }
    }))
    this.listeners.forEach(listener => listener())
  }
}

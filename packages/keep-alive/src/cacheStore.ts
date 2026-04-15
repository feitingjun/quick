import type { ReactNode } from 'react'
import type { BridgeProvider, CacheNode, KeepAliveLifecycleContextValue } from './types'

type StoreListener = () => void
type LifecycleEvent = 'activate' | 'unactivate'

export interface CacheEntrySnapshot {
  name: string
  active: boolean
  children: ReactNode
  props: Record<string, unknown>
  bridge: BridgeProvider[]
}

interface CacheEntryUpdate {
  target?: HTMLDivElement | null
  parentActive?: boolean
  children?: ReactNode
  props?: Record<string, unknown>
  bridge?: BridgeProvider[]
}

type ScrollTarget = Window | HTMLElement

interface ScrollPosition {
  target: ScrollTarget
  top: number
  left: number
}

/**浅比较 KeepAlive 透传 props，避免无意义地刷新缓存快照。 */
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

/**比较 context bridge 列表，只有 provider 或其值变化时才视为更新。 */
function equalBridges(left: readonly BridgeProvider[], right: readonly BridgeProvider[]): boolean {
  if (left.length !== right.length) {
    return false
  }

  return left.every((bridge, index) => {
    const next = right[index]
    return bridge.context === next.context && Object.is(bridge.value, next.value)
  })
}

/**判断元素是否真的承载了滚动，而不只是声明了 overflow。 */
function isScrollableElement(node: HTMLElement): boolean {
  const style = window.getComputedStyle(node)
  const canScrollY =
    /(auto|scroll|overlay)/.test(style.overflowY) && node.scrollHeight > node.clientHeight
  const canScrollX =
    /(auto|scroll|overlay)/.test(style.overflowX) && node.scrollWidth > node.clientWidth

  return canScrollY || canScrollX
}

/**从占位点向上收集所有外层滚动容器。 */
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

/**收集缓存内容内部所有可滚动的子节点。 */
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

/**组合收集外层滚动容器和缓存内容内部滚动容器。 */
function collectScrollTargets(
  target: HTMLElement,
  portalContainer: HTMLElement | null
): ScrollTarget[] {
  const targets: ScrollTarget[] = [...collectAncestorScrollTargets(target)]

  if (portalContainer) {
    for (const node of collectDescendantScrollTargets(portalContainer)) {
      if (!targets.includes(node)) {
        targets.push(node)
      }
    }
  }

  return targets
}

/**读取单个滚动容器当前位置。 */
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

/**把缓存的滚动值写回到滚动容器。 */
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

export class CacheEntry {
  readonly name: string
  private portalContainer: HTMLDivElement | null = null
  private parkingRoot: HTMLDivElement | null = null
  private target: HTMLDivElement | null = null
  private parentActive = true
  private active = false
  private children: ReactNode = null
  private props: Record<string, unknown> = {}
  private bridge: BridgeProvider[] = []
  private scrollPositions: ScrollPosition[] = []
  private pendingDestroy = false
  private pendingLifecycleEvents: LifecycleEvent[] = []
  private snapshot: CacheEntrySnapshot
  private readonly listeners = new Set<StoreListener>()
  private readonly activeListeners = new Set<(active: boolean) => void>()
  private readonly activateHooks = new Set<() => void>()
  private readonly unactivateHooks = new Set<() => void>()
  private readonly lifecycleContextValue: KeepAliveLifecycleContextValue

  /**初始化单个缓存实体的内部状态与对外生命周期接口。 */
  constructor(name: string) {
    this.name = name
    this.snapshot = {
      name,
      active: false,
      children: null,
      props: {},
      bridge: []
    }
    this.lifecycleContextValue = {
      getActive: () => this.active,
      addActiveListener: listener => this.addActiveListener(listener),
      addActivateHook: listener => this.addActivateHook(listener),
      addUnactivateHook: listener => this.addUnactivateHook(listener)
    }
  }

  /**订阅当前缓存实体的快照变化，供 renderer 使用。 */
  subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**返回供 useSyncExternalStore 使用的不可变快照。 */
  getSnapshot(): CacheEntrySnapshot {
    return this.snapshot
  }

  /**暴露给缓存树内部的生命周期上下文对象。 */
  getLifecycleContextValue(): KeepAliveLifecycleContextValue {
    return this.lifecycleContextValue
  }

  /**将内部状态转换成公开的缓存列表项。 */
  getCacheNode(): CacheNode | null {
    if (this.pendingDestroy) {
      return null
    }

    return {
      name: this.name,
      active: this.active,
      props: { ...this.props }
    }
  }

  /**标记当前缓存是否已进入销毁流程。 */
  isPendingDestroy(): boolean {
    return this.pendingDestroy
  }

  /**更新停车场根节点，失活时会把 portal 容器移动到这里。 */
  setParkingRoot(node: HTMLDivElement | null): void {
    this.parkingRoot = node
    this.syncHost()
  }

  /**绑定或替换稳定的 portal 容器，并立即同步到正确宿主节点。 */
  setPortalContainer(node: HTMLDivElement | null): void {
    if (this.portalContainer === node) {
      return
    }
    if (this.portalContainer?.parentNode) {
      this.portalContainer.parentNode.removeChild(this.portalContainer)
    }
    this.portalContainer = node
    if (node) {
      node.dataset.keepAlivePortal = this.name
      this.syncHost()
    }
  }

  /**合并来自 KeepAlive 的最新输入，并在必要时派发生命周期与快照更新。 */
  reconcile(update: CacheEntryUpdate): void {
    if (this.pendingDestroy) {
      return
    }

    const previousTarget = this.getUsableTarget()
    const wasActive = this.active
    let shouldEmit = false

    if ('target' in update) {
      const nextTarget = update.target ?? null
      if (this.target && nextTarget && this.target !== nextTarget) {
        console.warn(
          `[KeepAlive] duplicated active name "${this.name}" detected. Reusing the latest mounted instance.`
        )
      }
      if (this.target !== nextTarget) {
        this.target = nextTarget
        shouldEmit = true
      }
    }
    if ('parentActive' in update) {
      const nextParentActive = update.parentActive ?? true
      if (this.parentActive !== nextParentActive) {
        this.parentActive = nextParentActive
        shouldEmit = true
      }
    }
    if ('children' in update && !Object.is(this.children, update.children)) {
      this.children = update.children ?? null
      shouldEmit = true
    }
    if ('props' in update) {
      const nextProps = { ...(update.props ?? {}) }
      if (!shallowEqualRecord(this.props, nextProps)) {
        this.props = nextProps
        shouldEmit = true
      }
    }
    if ('bridge' in update) {
      const nextBridge = [...(update.bridge ?? [])]
      if (!equalBridges(this.bridge, nextBridge)) {
        this.bridge = nextBridge
        shouldEmit = true
      }
    }

    const activeChanged = this.syncActive()
    shouldEmit = shouldEmit || activeChanged

    if (wasActive && !this.active) {
      this.captureScrollPositions(previousTarget)
      this.enqueueLifecycle('unactivate')
      shouldEmit = true
    }

    this.syncHost()

    if (!wasActive && this.active) {
      this.restoreScrollPositions()
      this.enqueueLifecycle('activate')
      shouldEmit = true
    }

    if (shouldEmit) {
      this.emit()
    }
  }

  /**销毁缓存实体，等待生命周期在 effect 阶段派发后再做最终清理。 */
  destroy(): void {
    if (this.pendingDestroy) {
      return
    }

    const previousTarget = this.getUsableTarget()
    const wasActive = this.active
    this.target = null
    this.parentActive = false
    const activeChanged = this.syncActive()

    if (wasActive && !this.active) {
      this.captureScrollPositions(previousTarget)
    }

    this.syncHost()
    this.pendingDestroy = true
    this.enqueueLifecycle('unactivate')
    if (!activeChanged && !wasActive) {
      this.emit()
      return
    }

    this.emit()
  }

  /**在 effect 阶段派发累计的激活/失活事件。 */
  flushPendingLifecycleEffects(): void {
    if (this.pendingLifecycleEvents.length === 0) {
      return
    }

    const events = [...this.pendingLifecycleEvents]
    this.pendingLifecycleEvents = []

    events.forEach(event => {
      if (event === 'activate') {
        this.fireActivate()
        return
      }

      this.fireUnactivate()
    })
  }

  /**完成销毁流程，清空监听器并把容器从 DOM 中摘除。 */
  finalizeDestroy(): void {
    if (this.portalContainer?.parentNode) {
      this.portalContainer.parentNode.removeChild(this.portalContainer)
    }

    this.listeners.clear()
    this.activeListeners.clear()
    this.activateHooks.clear()
    this.unactivateHooks.clear()
    this.pendingLifecycleEvents = []
    this.scrollPositions = []
  }

  /**触发当前缓存实体内注册的激活回调。 */
  fireActivate(): void {
    this.activateHooks.forEach(listener => listener())
  }

  /**触发当前缓存实体内注册的失活回调。 */
  fireUnactivate(): void {
    this.unactivateHooks.forEach(listener => listener())
  }

  /**注册 active 变化监听，主要给嵌套 KeepAlive 透传父级状态。 */
  private addActiveListener(listener: (active: boolean) => void): () => void {
    this.activeListeners.add(listener)
    return () => {
      this.activeListeners.delete(listener)
    }
  }

  /**注册 useActivate 对应的生命周期回调。 */
  private addActivateHook(listener: () => void): () => void {
    this.activateHooks.add(listener)
    return () => {
      this.activateHooks.delete(listener)
    }
  }

  /**注册 useUnactivate 对应的生命周期回调。 */
  private addUnactivateHook(listener: () => void): () => void {
    this.unactivateHooks.add(listener)
    return () => {
      this.unactivateHooks.delete(listener)
    }
  }
  /**获取当前实体的active状态 */
  getActive() {
    return this.active
  }

  /**根据目标占位点和父级状态推导当前active是否变更 */
  private syncActive(): boolean {
    const nextActive = Boolean(this.getUsableTarget()) && this.parentActive
    if (nextActive === this.active) {
      return false
    }

    this.active = nextActive
    this.activeListeners.forEach(listener => listener(nextActive))
    return true
  }

  /**把激活/失活事件排队到 passive effect 阶段统一派发。 */
  private enqueueLifecycle(event: LifecycleEvent): void {
    const lastEvent = this.pendingLifecycleEvents[this.pendingLifecycleEvents.length - 1]
    if (lastEvent === event) {
      return
    }

    if (
      (lastEvent === 'activate' && event === 'unactivate') ||
      (lastEvent === 'unactivate' && event === 'activate')
    ) {
      this.pendingLifecycleEvents.pop()
      return
    }

    this.pendingLifecycleEvents.push(event)
  }

  /**返回当前仍可安全挂载的占位点，过滤掉已脱离文档或形成环引用的 target。 */
  private getUsableTarget(): HTMLDivElement | null {
    if (!this.target || !this.target.isConnected) {
      return null
    }
    if (this.portalContainer && this.portalContainer.contains(this.target)) {
      return null
    }

    return this.target
  }

  /**记录当前占位点外层滚动容器的位置，供下次激活时恢复。 */
  private captureScrollPositions(target: HTMLDivElement | null): void {
    if (!target) {
      this.scrollPositions = []
      return
    }

    this.scrollPositions = collectScrollTargets(target, this.portalContainer).map(
      readScrollPosition
    )
  }

  /**恢复上次失活时记录的外层滚动容器位置。 */
  private restoreScrollPositions(): void {
    for (let index = this.scrollPositions.length - 1; index >= 0; index -= 1) {
      writeScrollPosition(this.scrollPositions[index])
    }
  }

  /**把稳定的 portal 容器挂到当前应该显示的位置，或挂回停车场。 */
  private syncHost(): void {
    const host = this.getUsableTarget() ?? this.parkingRoot
    // 缓存节点始终挂在稳定的 portal 容器上，只在“占位点”和“停车场”之间移动容器。
    if (!host || !this.portalContainer || this.portalContainer.parentNode === host) {
      return
    }
    host.appendChild(this.portalContainer)
  }

  /**生成新快照并广播给订阅方，驱动底层 renderer 更新。 */
  private emit(): void {
    this.snapshot = {
      name: this.name,
      active: this.active,
      children: this.children,
      props: { ...this.props },
      bridge: [...this.bridge]
    }
    this.listeners.forEach(listener => listener())
  }
}

export class CacheStore {
  private parkingRoot: HTMLDivElement | null = null
  private readonly entries = new Map<string, CacheEntry>()
  private readonly listeners = new Set<StoreListener>()
  private entriesSnapshot: CacheEntry[] = []

  /**订阅整个缓存集合的增删变化。 */
  subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**返回当前缓存实体列表快照，供 CacheRenderer 渲染所有缓存。 */
  getEntriesSnapshot = (): CacheEntry[] => {
    return this.entriesSnapshot
  }

  /**按 name 查询单个缓存实体。 */
  get(name: string): CacheEntry | undefined {
    return this.entries.get(name)
  }

  /**按需创建缓存实体，并让新实体继承当前停车场节点。 */
  getOrCreate(name: string): CacheEntry {
    const existing = this.entries.get(name)
    if (existing && !existing.isPendingDestroy()) {
      return existing
    }
    if (existing) {
      this.disposeEntry(existing)
    }
    const entry = new CacheEntry(name)
    entry.setParkingRoot(this.parkingRoot)
    this.entries.set(name, entry)
    this.emit()
    return entry
  }

  /**更新全局停车场根节点，并同步给所有已存在的缓存实体。 */
  setParkingRoot(node: HTMLDivElement | null): void {
    this.parkingRoot = node
    this.entries.forEach(entry => entry.setParkingRoot(node))
  }

  /**销毁指定 name 的缓存，可批量传入多个 name。 */
  destroy(name: string | string[]): void {
    const names = typeof name === 'string' ? [name] : name
    let changed = false
    names.forEach(cacheName => {
      const entry = this.entries.get(cacheName)
      // 只有非活跃缓存才能销毁，避免页面显示的DOM节点被移除。
      if (!entry || entry.getActive() || entry.isPendingDestroy()) {
        return
      }
      entry.destroy()
      changed = true
    })
    if (changed) {
      this.emit()
    }
  }

  /**销毁当前 store 中的全部非活跃缓存实体。 */
  destroyAll(): void {
    if (this.entries.size === 0) {
      return
    }

    let changed = false
    this.entries.forEach(entry => {
      if (!entry.getActive() && !entry.isPendingDestroy()) {
        entry.destroy()
        changed = true
      }
    })

    if (changed) {
      this.emit()
    }
  }

  /**在销毁回调跑完后，把实体真正从 store 中摘掉。 */
  finalizeDestroy(entry: CacheEntry): void {
    const current = this.entries.get(entry.name)
    if (current !== entry || !entry.isPendingDestroy()) {
      return
    }

    this.disposeEntry(entry)
    this.emit()
  }

  /**刷新缓存集合快照，并通知依赖整个 store 的订阅方。 */
  private emit(): void {
    this.entriesSnapshot = Array.from(this.entries.values())
    this.listeners.forEach(listener => listener())
  }

  /**无副作用地释放某个缓存实体。 */
  private disposeEntry(entry: CacheEntry): void {
    entry.finalizeDestroy()
    this.entries.delete(entry.name)
  }
}

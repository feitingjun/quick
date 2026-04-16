import type { ReactNode } from 'react'
import type { CacheProps } from './types'

export class CacheNode {
  cacheId: string
  private outlet: ReactNode = null
  private cacheProps: CacheProps = undefined
  private active: boolean
  /** 状态变更监听器 */
  private readonly listeners = new Set<() => void>()
  /**销毁监听器 */
  private readonly destroyListeners = new Set<() => void>()
  constructor(cacheId: string) {
    this.cacheId = cacheId
    this.active = false
  }
  // 添加监听器
  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
  // 添加销毁监听器
  subscribeDestroy(listener: () => void) {
    this.destroyListeners.add(listener)
    return () => {
      this.destroyListeners.delete(listener)
    }
  }
  // 触发销毁监听器
  emitDestroy() {
    this.destroyListeners.forEach(listener => listener())
  }
  // 设置激活状态
  setActive(active: boolean) {
    if (active === this.active) return
    this.active = active
    this.emit()
  }
  // 获取激活状态
  getActive() {
    return this.active
  }
  // 设置缓存节点
  setOutlet(outlet: ReactNode) {
    this.outlet = outlet
  }
  // 获取outlet
  getOutlet() {
    return this.outlet
  }
  // 设置cacheProps
  setCacheProps(cacheProps: CacheProps) {
    this.cacheProps = cacheProps
  }
  // 获取cacheProps
  getCacheProps() {
    return this.cacheProps
  }
  // 触发更新，通知所有监听器缓存节点发生了变化。
  emit() {
    this.listeners.forEach(listener => listener())
  }
}

export class CacheStore {
  private entries = new Map<string, CacheNode>()
  /**列表变更监听器 */
  private readonly listeners = new Set<() => void>()
  private entriesSnapshot: CacheNode[] = []

  // 添加监听器，当缓存节点发生变化时调用。
  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
  // 获取缓存节点
  getCacheNodes() {
    return this.entriesSnapshot
  }
  // 创建一个新的缓存节点，返回该节点的引用。
  getOrCreate(cacheId: string, outlet: ReactNode, cacheProps?: CacheProps) {
    let cacheNode = this.entries.get(cacheId)
    let changed = false
    if (!cacheNode) {
      cacheNode = new CacheNode(cacheId)
      this.entries.set(cacheId, cacheNode)
      changed = true
    }
    if (!Object.is(outlet, cacheNode.getOutlet())) {
      cacheNode.setOutlet(outlet)
    }
    if (!Object.is(cacheProps, cacheNode.getCacheProps())) {
      cacheNode.setCacheProps(cacheProps)
    }
    if (changed) this.emit()
    return cacheNode
  }
  // 激活缓存节点，将其他设置为未激活状态
  activate(cacheId: string) {
    const cacheNode = this.entries.get(cacheId)
    if (cacheNode) {
      cacheNode.setActive(true)
      this.entries.forEach(node => {
        if (node !== cacheNode) {
          node.setActive(false)
        }
      })
      this.emit()
    }
  }
  // 销毁缓存节点
  destroy(cacheId: string) {
    const cacheNode = this.entries.get(cacheId)
    if (cacheNode && !cacheNode.getActive()) {
      this.entries.delete(cacheId)
      this.emit()
    }
  }
  // 销毁所有节点
  destroyAll() {
    const unActiveCacheIds: string[] = []
    this.entries.forEach(node => {
      if (!node.getActive()) {
        unActiveCacheIds.push(node.cacheId)
      }
    })
    unActiveCacheIds.forEach(cacheId => this.entries.delete(cacheId))
    this.emit()
  }

  // 触发更新，通知所有监听器缓存节点发生了变化。
  private emit(): void {
    this.entriesSnapshot = Array.from(this.entries.values())
    this.listeners.forEach(listener => listener())
  }
}

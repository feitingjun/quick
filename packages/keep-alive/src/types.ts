import type { Context, ReactNode } from 'react'

/**单个缓存节点的信息（通过 cachingNodes 获取） */
export interface CacheNode<Props extends Record<string, unknown> = Record<string, unknown>> {
  /**唯一标识 */
  name: string
  /**是否处于激活（可见）状态 */
  active: boolean
  /**KeepAlive 接收的 props（不含 name、children） */
  props: Props
}

export type KeepAliveProps = {
  /**唯一标识 */
  name: string
  /**子组件 */
  children: ReactNode
} & Record<string, unknown>

export interface BridgeProvider {
  context: Context<unknown>
  value: unknown
}

export interface KeepAliveLifecycleContextValue {
  getActive: () => boolean
  addActiveListener: (listener: (active: boolean) => void) => () => void
  addActivateHook: (listener: () => void) => () => void
  addUnactivateHook: (listener: () => void) => () => void
}

import type { Context } from 'react'
import type { BridgeProvider } from './types'

interface FiberNode {
  tag: number
  type: unknown
  return: FiberNode | null
  memoizedProps?: {
    value?: unknown
  }
}

const CONTEXT_PROVIDER_TAG = 10
const REACT_FIBER_PREFIX = '__reactFiber$'
const REACT_CONTAINER_PREFIX = '__reactContainer$'

/**判断某个值是否为 React context 对象。 */
function isContext(value: unknown): value is Context<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    '$$typeof' in value &&
    (value as { $$typeof: symbol }).$$typeof === Symbol.for('react.context')
  )
}

/**判断某个值是否满足当前 bridge 读取所需的最小 fiber 结构。 */
function isFiberNode(value: unknown): value is FiberNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    'tag' in value &&
    'type' in value &&
    'return' in value
  )
}

/**从真实 DOM 节点上读取 React 挂载的内部 fiber 引用。 */
function readFiber(node: Node): FiberNode | null {
  const reactInternals = node as unknown as Record<string, unknown>
  for (const key of Object.getOwnPropertyNames(node)) {
    if (key.startsWith(REACT_FIBER_PREFIX) || key.startsWith(REACT_CONTAINER_PREFIX)) {
      const fiber = reactInternals[key]
      return isFiberNode(fiber) ? fiber : null
    }
  }

  return null
}

/**从当前节点开始向上查找，拿到离它最近的 fiber。 */
function getClosestFiber(node: Node | null): FiberNode | null {
  let current = node

  while (current) {
    const fiber = readFiber(current)
    if (fiber) {
      return fiber
    }
    current = current.parentNode
  }

  return null
}

/**收集占位点上方所有 context provider，用于在缓存树中重建 provider 链。 */
export function collectBridgeProviders(anchor: Node | null): BridgeProvider[] {
  const providers: BridgeProvider[] = []
  let current = getClosestFiber(anchor)
  while (current) {
    if (current.tag === CONTEXT_PROVIDER_TAG && isContext(current.type)) {
      providers.push({
        context: current.type,
        value: current.memoizedProps?.value
      })
    }
    current = current.return
  }

  providers.reverse()
  return providers
}

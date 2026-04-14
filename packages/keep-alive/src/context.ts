import { createContext } from 'react'
import type { CacheStore } from './cacheStore'
import type { KeepAliveLifecycleContextValue } from './types'

/**ScopeContext：AliveScope 向下传递缓存管理 API */
export const ScopeContext = createContext<CacheStore | null>(null)

/**KeepAliveContext：向被缓存的组件提供生命周期钩子注册 API */
export const KeepAliveContext = createContext<KeepAliveLifecycleContextValue | null>(null)

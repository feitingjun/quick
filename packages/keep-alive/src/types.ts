export interface ScopeProviderContextValue {}

export type CacheProps = Record<string, any> | undefined

export interface KeepAliveOutletProps {
  cacheId?: string
  cacheProps?: CacheProps
}

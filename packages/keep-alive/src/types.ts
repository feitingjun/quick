export interface CacheNode<Props extends Record<string, unknown> = Record<string, unknown>> {
  name: string
  active: boolean
  props: Props
}

export interface KeepAliveOutletProps<
  Props extends Record<string, unknown> = Record<string, unknown>
> {
  context?: unknown
  name?: string
  cacheProps?: Props
}

export interface KeepAliveContextValue {
  active: boolean
  name: string
}

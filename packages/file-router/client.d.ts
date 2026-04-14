declare module 'virtual:file-router' {
  import type { ComponentType, JSX, ReactNode } from 'react'
  import type { RouterProviderProps } from 'react-router'

  export type FileRouterHistory = 'hash' | 'browser' | 'memory'
  export type RouteMetadata = Record<string, unknown>

  export interface RouteWrapperProps {
    pathname: string
    children: ReactNode
    isLayout: boolean
    metadata?: RouteMetadata
  }

  export interface FileRouterProviderProps extends Omit<RouterProviderProps, 'router'> {
    history?: FileRouterHistory
    wrappers?: Array<(props: RouteWrapperProps) => ReactNode>
    hydrateFallback?: ComponentType
  }

  export function useMetadata<T extends RouteMetadata = RouteMetadata>(): T | undefined
  export function RouterProvider(props: FileRouterProviderProps): JSX.Element

  export default RouterProvider
}

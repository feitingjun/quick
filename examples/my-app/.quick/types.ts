import type {
  AppConfig as AppConfigType,
  PageConfig as PageRouteConfig,
  DataLoader,
  DataLoadeContext
} from '@quick/app'

export type ExtendPageConfig = {}

export type ExtendAppConfig = {}

export type PageConfig<P extends {}> = PageRouteConfig<P & ExtendPageConfig, unknown>

export type AppConfig<T={}, D extends Record<string, unknown>={}> = AppConfigType<T & ExtendAppConfig, D>

export type {
  DataLoader,
  DataLoadeContext
}

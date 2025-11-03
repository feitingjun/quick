import { useConfig as usePageConfig, useAppContext } from '@quick/app'
import type { PageConfig, AppConfig, DataLoader } from './types'
import app from '/Users/feitingjun/Documents/文档/study/quick/examples/my-app/src/app'

export const defineConfig = <P extends {}>(pageConfig: PageConfig<P>) => pageConfig

export const defineApp = <T, D extends Record<string, unknown>>(config: AppConfig<T, D>) => config

export const defineLoader = <T>(dataLoader: DataLoader<T>) => dataLoader

export const useConfig = <T>() => usePageConfig<T>()

export const useAppData = <T extends Record<string, unknown>>() => {
  const ctx = useAppContext<T & typeof app['appData']>()
  return ctx.appData
}
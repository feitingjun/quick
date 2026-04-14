export * from './hooks'
export * from './types'
import type { Dicts } from './types'

export const defineDicts = <T extends Dicts>(dicts: T) => dicts

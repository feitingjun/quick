export type DeepRequired<T> = {
  [K in keyof T]-?: DeepRequired<T[K]>
}

export type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>
}

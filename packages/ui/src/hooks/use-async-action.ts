import { useActionState, startTransition } from 'react'

/**
 * 为异步函数添加 loading，不接收函数返回值
 * @param dispatch 异步函数
 * @returns [action, loading]
 ** action 触发异步函数
 ** loading 异步函数是否执行中
 */
export default function useAsyncAction<T extends any = any>(
  dispatch: (payload: T) => void | Promise<void>
) {
  const [_, action, loading] = useActionState<void, T>(
    (_: void, payload: T) => dispatch(payload),
    void 0
  )
  return [(values: T) => startTransition(() => action(values)), loading] as const
}

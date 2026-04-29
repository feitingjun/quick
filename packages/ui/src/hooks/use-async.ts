import { useState, useRef, useCallback, useEffectEvent, useLayoutEffect } from 'react'

/**
 * 触发异步请求 hook，多个请求同时触发时，全部完成后更新请求状态
 * @param action 实际请求函数
 * @param action.payload 本次请求的参数，存在时如果不需要立即触发，请不要传入 immediate 参数，如果传入 immediate 参数（true 或 条件判断，条件判断说明可能为 true，必为 false 则没必要传），initialPayload 必传
 * @param immediate 是否立即触发请求
 * @param initialPayload 初始请求参数
 * @returns [dispatch, isPending]
 * - dispatch: 触发函数
 * - isPending: 请求状态
 */
function useAsync(action: () => Promise<void>, immediate?: boolean): [() => Promise<void>, boolean]

function useAsync<Payload>(
  action: (payload: Payload) => Promise<void>
): [(payload: Payload) => Promise<void>, boolean]

function useAsync<Payload>(
  action: (payload: Payload) => Promise<void>,
  immediate: boolean,
  initialPayload: Payload
): [(payload: Payload) => Promise<void>, boolean]

function useAsync<Payload>(
  action: (payload: Payload) => Promise<void>,
  immediate?: boolean,
  initialPayload?: Payload
) {
  const [isPending, setIsPending] = useState(false)
  const tasks = useRef<number>(0)
  const dispatch = useCallback(
    async (payload: Payload) => {
      setIsPending(true)
      const task = action(payload)
      tasks.current++
      task.finally(() => {
        tasks.current--
        if (tasks.current <= 0) {
          setIsPending(false)
        }
      })
      return task
    },
    [action, setIsPending]
  )
  const immediateFn = useEffectEvent(() => {
    if (immediate) {
      dispatch(initialPayload as Payload)
    }
  })

  useLayoutEffect(immediateFn, [])

  return [dispatch, isPending]
}

export default useAsync

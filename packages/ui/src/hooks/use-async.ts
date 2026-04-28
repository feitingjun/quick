import { useState, useRef, useCallback, useEffectEvent, useLayoutEffect } from 'react'

/**
 * 触发异步请求 hook，多个请求同时触发时，全部完成后更新请求状态
 * @param action 实际请求函数
 * @param action.payload 请求参数
 * @param initialPayload 初始请求参数
 * @returns [dispatch, isPending]
 * - dispatch: 触发函数
 * - isPending: 请求状态
 */
function useAsync(action: () => Promise<void>, initialPayload?: true): [() => Promise<void>, boolean]

function useAsync<Payload>(
  action: (payload: Payload) => Promise<void>,
  initialPayload?: Payload
): [(payload: Payload) => Promise<void>, boolean]

function useAsync<Payload>(action: (payload: Payload) => Promise<void>, initialPayload?: Payload) {
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
  const immediate = useEffectEvent(() => {
    if (arguments.length >= 2) {
      dispatch(initialPayload as Payload)
    }
  })

  useLayoutEffect(immediate, [])

  return [dispatch, isPending]
}

export default useAsync

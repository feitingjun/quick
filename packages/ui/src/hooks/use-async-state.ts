import { useState, useLayoutEffect, useRef, useCallback, useEffectEvent } from 'react'

/**
 * 带请求状态的异步数据请求 hook
 *
 * 多个调用将按照触发顺序返回最后一次请求成功的状态和结果
 ** 若最后一次请求成功，直接返回完成状态和其结果，不会等待前面的请求完成
 ** 若最后一次请求失败，将依次查询并等待上一次调用，直到找到调用成功的，返回其完成状态和结果
 * @param action 请求函数
 * @param action.payload 本次请求的参数
 * @param initialState 初始数据
 * @param initialPayload 初始请求参数(可选)，存在时会在初始化时立即发送一次请求(即使传入undefined)
 * @returns [state, dispatch, isPending]
 * - state: 当前状态
 * - dispatch: 触发函数
 * - isPending: 请求状态
 */
function useAsyncState<State>(
  action: () => Promise<State>,
  initialState: State,
  initialPayload?: true
): [State, () => Promise<State>, boolean]

function useAsyncState<State, Payload>(
  action: (payload: Payload) => Promise<State>,
  initialState: State,
  initialPayload?: Payload
): [State, (payload: Payload) => Promise<State>, boolean]

function useAsyncState<State, Payload>(
  action: (payload: Payload) => Promise<State>,
  initialState: State,
  initialPayload?: Payload
) {
  const [state, setState] = useState(initialState)
  const [isPending, setIsPending] = useState(false)
  const callId = useRef(0)
  const tasks = useRef(new Map<number, Promise<State>>())

  const reset = useCallback(() => {
    setIsPending(false)
    callId.current = 0
    tasks.current.clear()
  }, [setIsPending])

  // 查询最后一个成功的
  const lastSuccess = useCallback(
    (taskId: number): Promise<State> => {
      const task = tasks.current.get(taskId)!
      return task?.catch(() => lastSuccess(taskId - 1))
    },
    [setState, reset]
  )

  const dispatch = useCallback(
    async (payload: Payload) => {
      setIsPending(true)
      const taskId = ++callId.current
      const task = action(payload)
      tasks.current.set(taskId, task)
      task.finally(() => {
        if (taskId === callId.current) {
          const success = lastSuccess(taskId)
          success
            .then(s => {
              // 再次判断是否是最后一个任务，避免lastSuccess执行中途插入任务
              if (taskId === callId.current) {
                setState(s)
              }
            })
            .finally(() => {
              if (taskId === callId.current) {
                reset()
              }
            })
        }
      })
      return task
    },
    [action, setState, reset, lastSuccess]
  )
  const immediate = useEffectEvent(() => {
    if (arguments.length >= 3) {
      dispatch(initialPayload as Payload)
    }
  })

  useLayoutEffect(immediate, [])

  return [state, dispatch, isPending]
}

export default useAsyncState

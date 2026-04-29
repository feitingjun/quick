import { useLayoutEffect, useCallback, useState, useRef, useEffectEvent } from 'react'

/**
 * 带请求状态的异步 Reducer hook，多个调用将排队并按顺序触发，每个调用都将接受前一次调用的结果
 *
 * 如果请求 Rejected，队列后续 action 将不会触发，且 dispatch 触发 Rejected，state 将保持最后一次成功的 action 的结果
 * @param action 实际请求函数
 * @param action.state 最新的state
 * @param action.payload 本次请求的参数，存在时如果不需要立即触发，请不要传入 immediate 参数，如果传入 immediate 参数（true 或 条件判断，条件判断说明可能为 true，必为 false 则没必要传），initialPayload 必传
 * @param initialState 初始数据
 * @param immediate 是否立即触发请求
 * @param initialPayload 初始请求参数
 * @returns [state, dispatch, isPending]
 * - state: 当前状态
 * - dispatch: 触发函数
 * - isPending: 请求状态
 */
function useAsyncReducer<State>(
  action: (state: Readonly<State>) => Promise<State>,
  initialState: State,
  immediate?: boolean
): [State, () => Promise<State>, boolean]

function useAsyncReducer<State, Payload>(
  action: (state: Readonly<State>, payload: Payload) => Promise<State>,
  initialState: State
): [State, (payload: Payload) => Promise<State>, boolean]

function useAsyncReducer<State, Payload>(
  action: (state: Readonly<State>, payload: Payload) => Promise<State>,
  initialState: State,
  immediate: boolean,
  initialPayload: Payload
): [State, (payload: Payload) => Promise<State>, boolean]

function useAsyncReducer<State, Payload>(
  action: (state: Readonly<State>, payload: Payload) => Promise<State>,
  initialState: State,
  immediate?: boolean,
  initialPayload?: Payload
) {
  const [state, setState] = useState(initialState)
  const [isPending, setIsPending] = useState(false)
  const lastPromise = useRef<Promise<State>>(null)

  const createSerialTask = useCallback(
    (payload: Payload) => {
      if (!lastPromise.current) {
        lastPromise.current = action(state, payload)
        return lastPromise.current
      }
      lastPromise.current = lastPromise.current.then(prev => {
        return action(prev, payload).catch(e => {
          setState(prev)
          return Promise.reject(e)
        })
      })
      return lastPromise.current
    },
    [state, setState, action]
  )

  const dispatch = useCallback(
    async (payload: Payload) => {
      setIsPending(true)
      const task = createSerialTask(payload)
      task
        .then(s => {
          if (task === lastPromise.current) {
            setState(s)
          }
        })
        .finally(() => {
          if (task === lastPromise.current) {
            lastPromise.current = null
            setIsPending(false)
          }
        })
      return task
    },
    [createSerialTask, setState, setIsPending]
  )

  const immediateFn = useEffectEvent(() => {
    if (immediate) {
      dispatch(initialPayload as Payload)
    }
  })

  useLayoutEffect(immediateFn, [])

  return [state, dispatch, isPending]
}

export default useAsyncReducer

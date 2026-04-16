import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type EffectCallback
} from 'react'
import { ScopeContext, CacheNodeContext } from './context'

/**获取缓存列表和销毁缓存方法 */
export const useAliveController = () => {
  const store = useContext(ScopeContext)
  const cachingNodes = useSyncExternalStore(
    listener => store?.subscribe(listener) ?? (() => {}),
    () => store?.getCacheNodes() ?? [],
    () => store?.getCacheNodes() ?? []
  )
  const destroy = (cacheId: string) => {
    store?.destroy(cacheId)
  }
  const destroyAll = () => {
    store?.destroyAll()
  }
  return {
    cachingNodes: cachingNodes.map(node => ({
      cacheId: node.cacheId,
      active: node.getActive(),
      cacheProps: node.getCacheProps()
    })),
    destroy,
    destroyAll
  }
}

/**
 * 组件首次挂载和完全销毁时执行的useEffect
 *
 * react19 Activity 每次显示状态变更都会执行useEffect，此hook提供了仅在组件首次挂载和完全销毁时执行监听的能力
 * @param {EffectCallback} callback 首次挂载时执行的函数，返回销毁时执行的函数
 *  */
export const useMountEffect = (callback: EffectCallback) => {
  const isMomunt = useRef(false)
  const cacheNode = useContext(CacheNodeContext)
  useEffect(() => {
    if (!isMomunt.current) {
      isMomunt.current = true
      const result = callback()
      if (result) cacheNode?.subscribeDestroy(result)
    }
  }, [])
}

/**
 * 组件首次挂载和依赖变更时执行的useEffect(排除激活触发)
 *
 * deps = [] 时等同于 useMountEffect
 * @param {EffectCallback} callback 首次挂载和依赖变更时执行的函数
 * @param {any[]} deps 依赖列表
 * */
export const useDepsEffect = (callback: EffectCallback, deps: any[]) => {
  // 是否是首次挂载
  const isMomunt = useRef(false)
  // 下次useEffect是否是激活触发
  const isActive = useRef(false)
  // 下次useEffect返回函数是否是失活触发
  const isDeactive = useRef(false)
  // 缓存callback执行结果
  const resultRef = useRef<ReturnType<EffectCallback>>(null)
  const cacheNode = useContext(CacheNodeContext)

  useLayoutEffect(() => {
    // 每次激活时标记下次useEffect为激活触发
    isActive.current = true
    // 每次激活时将isDeactive复位
    isDeactive.current = false
    return () => {
      // 失活时将下次useEffect返回函数标记为失活触发
      isDeactive.current = true
    }
  }, [])

  useEffect(() => {
    // 首次挂载时注册销毁监听
    if (!isMomunt.current) {
      // 注册销毁时触发
      cacheNode?.subscribeDestroy(() => {
        resultRef.current?.()
      })
    }
    // 首次挂载和非激活时执行
    if (!isMomunt.current || !isActive.current) {
      isMomunt.current = true
      resultRef.current = callback()
    }
    // 如果是激活时触发的，下次useEffect标记为非激活
    if (isActive.current) isActive.current = false

    return () => {
      // 如果不是失活时触发的(依赖变更触发)，执行上次callback执行时的返回函数
      if (!isDeactive.current) {
        resultRef.current?.()
        resultRef.current = null
      }
    }
  }, deps)
}

import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { ReactNode, EffectCallback } from 'react';

declare function ScopeProvider({ children }: {
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;

type CacheProps = Record<string, any> | undefined;
interface KeepAliveOutletProps {
    cacheId?: string;
    cacheProps?: CacheProps;
}

declare function KeepAliveOutlet({ cacheId, cacheProps }: KeepAliveOutletProps): react.ReactElement<unknown, string | react.JSXElementConstructor<any>> | react_jsx_runtime.JSX.Element[] | null;

/**获取缓存列表和销毁缓存方法 */
declare const useAliveController: () => {
    cachingNodes: {
        cacheId: string;
        active: boolean;
        cacheProps: CacheProps;
    }[];
    destroy: (cacheId: string) => void;
    destroyAll: () => void;
};
/**
 * 组件首次挂载和完全销毁时执行的useEffect
 *
 * react19 Activity 每次显示状态变更都会执行useEffect，此hook提供了仅在组件首次挂载和完全销毁时执行监听的能力
 * @param {EffectCallback} callback 首次挂载时执行的函数，返回销毁时执行的函数
 *  */
declare const useMountEffect: (callback: EffectCallback) => void;
/**组件首次挂载和依赖变更时执行的useEffect(排除激活触发) */
declare const useDepsEffect: (callback: EffectCallback, deps?: any[]) => void;

export { KeepAliveOutlet, ScopeProvider, useAliveController, useDepsEffect, useMountEffect };

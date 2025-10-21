import Activation from './activation.js';
import 'react';

type NoParamsFn = () => void;
declare function useGetActivation(name: string): Activation;
/**获取操作缓存的api */
declare function useAliveController(): {
    destroy: () => void;
    destroyAll: () => void;
    cachingNodes: never[];
    getCachingNodes?: undefined;
} | {
    destroy: (name: string | string[]) => void;
    destroyAll: () => void;
    getCachingNodes: () => {
        name: string;
        active: boolean;
        props: {
            [key: string]: any;
        };
    }[];
    cachingNodes?: undefined;
};
/**激活时执行的hooks */
declare function useActivate(fn: NoParamsFn): void;
/**失活时执行的hooks(缓存完全卸载时不触发)
 * 缓存完全卸载时没有办法触发，因为如果卸载时处于失活状态时，没办法触发KeepAlive组件的useEffect
 */
declare function useUnactivate(fn: NoParamsFn): void;
declare function useLoadedEffect(fn: NoParamsFn, deps: any[]): void;
declare function useLoadedLayoutEffect(fn: NoParamsFn, deps: any[]): void;

export { useActivate, useAliveController, useGetActivation, useLoadedEffect, useLoadedLayoutEffect, useUnactivate };

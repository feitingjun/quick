import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { ReactNode } from 'react';

/**
 * AliveScope：缓存容器，必须包裹在应用顶层
 * 所有 KeepAlive 组件必须在其内部才能生效
 */
declare function ScopeProvider({ children }: {
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;

/**单个缓存节点的信息（通过 cachingNodes 获取） */
interface CacheNode<Props extends Record<string, unknown> = Record<string, unknown>> {
    /**唯一标识 */
    name: string;
    /**是否处于激活（可见）状态 */
    active: boolean;
    /**KeepAlive 接收的 props（不含 name、children） */
    props: Props;
}
type KeepAliveProps = {
    /**唯一标识 */
    name: string;
    /**子组件 */
    children: ReactNode;
} & Record<string, unknown>;

/**
 * KeepAlive：将其 children 缓存起来
 *
 * 用法：
 * <KeepAlive name={`user-${userId}`} title="用户详情">
 *   <UserDetail id={userId} />
 * </KeepAlive>
 *
 * 通过 useAliveController().cachingNodes 可获取所有缓存节点信息，
 * 包括 name、active、props（含 title 等自定义属性）。
 */
declare function KeepAlive({ name, children, ...restProps }: KeepAliveProps): string | number | bigint | boolean | Iterable<react.ReactNode> | Promise<string | number | bigint | boolean | react.ReactPortal | react.ReactElement<unknown, string | react.JSXElementConstructor<any>> | Iterable<react.ReactNode> | null | undefined> | react_jsx_runtime.JSX.Element | null | undefined;

/**
 * 获取缓存控制器
 *
 * 返回：
 * - destroy(name) - 销毁指定缓存
 * - destroyAll() - 销毁所有缓存
 * - cachingNodes() - 获取缓存列表
 */
declare function useAliveController(): {
    destroy: (name: string | string[]) => void | undefined;
    destroyAll: () => void | undefined;
    cachingNodes: CacheNode<Record<string, unknown>>[];
};
/**
 * 缓存组件激活时执行
 */
declare function useActivate(fn: () => void): void;
/**
 * 缓存组件失活时执行
 * destroy 也会触发一次失活回调
 */
declare function useUnactivate(fn: () => void): void;

export { type CacheNode, KeepAlive, ScopeProvider, useActivate, useAliveController, useUnactivate };

import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { ReactNode } from 'react';

interface CacheNode<Props extends Record<string, unknown> = Record<string, unknown>> {
    name: string;
    active: boolean;
    props: Props;
}
interface KeepAliveOutletProps<Props extends Record<string, unknown> = Record<string, unknown>> {
    context?: unknown;
    name?: string;
    cacheProps?: Props;
}

declare function KeepAliveOutlet({ context, name, cacheProps }?: KeepAliveOutletProps): react.ReactElement<unknown, string | react.JSXElementConstructor<any>> | react_jsx_runtime.JSX.Element[] | null;

declare function ScopeProvider({ children }: {
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;

declare function useAliveController(): {
    destroy: (name: string | string[]) => void | undefined;
    destroyAll: () => void | undefined;
    cachingNodes: CacheNode<Record<string, unknown>>[];
};
declare function useActivate(fn: () => void): void;
declare function useUnactivate(fn: () => void): void;

export { type CacheNode, KeepAliveOutlet, type KeepAliveOutletProps, ScopeProvider, useActivate, useAliveController, useUnactivate };

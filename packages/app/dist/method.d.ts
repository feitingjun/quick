import { AppContextType, PageConfig, DataLoadeContext, LoaderData, ManifestClient, AppConfig } from './types.js';
import { Runtime } from '@quick/core';
import 'react-router';
import 'react';

declare const useAppContext: <T extends Record<string, unknown>>() => AppContextType<T>;
declare const useConfig: <T>() => T extends PageConfig<{}, unknown> ? T extends ({ ctx, data }: {
    ctx: DataLoadeContext;
    data: unknown;
}) => infer T_1 ? T_1 extends Promise<infer T_1_1> ? T_1_1 : T_1 : T : T;
declare const useLoaderData: <T = unknown>() => LoaderData<T>;
declare const createApp: ({ manifest, app: appConfig, runtimes }: {
    manifest: ManifestClient;
    app: AppConfig;
    runtimes: Runtime[];
}) => void;

export { createApp, useAppContext, useConfig, useLoaderData };

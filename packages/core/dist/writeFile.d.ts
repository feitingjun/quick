import { AddFileOptions, MakePropertyOptional, RouteManifest } from './types.js';
import 'vite';
import 'fs';
import 'react';

/**创建.quick/index.ts文件 */
declare function writeIndexts(outDir: string, exports?: AddFileOptions[]): void;
/**创建.quick/entry.tsx文件 */
declare function writeEntryTsx(outDir: string, srcDir: string, data: {
    imports: MakePropertyOptional<AddFileOptions, 'specifier'>[];
    aheadCodes: string[];
    tailCodes: string[];
}): void;
/**写入.quick/types.ts */
declare function writeTypesTs(outDir: string, pageConfigTypes?: AddFileOptions[], appConfigTypes?: AddFileOptions[]): void;
/**写入.quick/define.ts */
declare function writeDefineTs(outDir: string, srcDir: string): void;
/**写入.quick/manifest.ts */
declare function writeRoutesTs(outDir: string, manifest: RouteManifest): void;
/**写入.quick/runtimes.ts */
declare function wirteRuntime(outDir: string, runtimes?: string[]): void;
/**写入.quick/typings.d.ts */
declare function wirteTypings(outDir: string): void;
/**创建临时文件夹 */
declare function createTmpDir({ root, srcDir, options }: {
    root: string;
    srcDir: string;
    options: {
        manifest?: RouteManifest;
        pageConfigTypes: AddFileOptions[];
        appConfigTypes: AddFileOptions[];
        exports: AddFileOptions[];
        imports: MakePropertyOptional<AddFileOptions, 'specifier'>[];
        aheadCodes: string[];
        tailCodes: string[];
        runtimes: string[];
    };
}): void;

export { createTmpDir, wirteRuntime, wirteTypings, writeDefineTs, writeEntryTsx, writeIndexts, writeRoutesTs, writeTypesTs };

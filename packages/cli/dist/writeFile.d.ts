/**写入package.json文件 */
declare function writePackageJson(root: string, description: string): void;
/**写入tsconfig.json文件 */
declare function writeTsConfigJson(root: string, srcDir: string): void;
/**写入app.ts文件 */
declare function writeAppTs(root: string, srcDir: string): void;
/**写入page.tsx文件 */
declare function writeIndexPageTsx(root: string, srcDir: string): void;
/**写入vite.config.ts文件 */
declare function writeViteConfigTs(root: string): void;
/**写入index.html */
declare function writeIndexHtml(root: string): void;

export { writeAppTs, writeIndexHtml, writeIndexPageTsx, writePackageJson, writeTsConfigJson, writeViteConfigTs };

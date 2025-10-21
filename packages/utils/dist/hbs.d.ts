/**根据handlebars模板写入文件 */
declare const renderHbsTpl: ({ sourcePath, outPath, data }: {
    sourcePath: string;
    outPath: string;
    data?: object;
}) => void;

export { renderHbsTpl };

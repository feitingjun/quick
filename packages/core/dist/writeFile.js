// src/writeFile.ts
import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { renderHbsTpl } from "@quick/cli";
var __dirname = import.meta.dirname;
var TML_DIR = resolve(__dirname, "template");
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function writeIndexts(outDir, exports) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "index.ts.hbs"),
    outPath: resolve(outDir, "index.ts"),
    data: { exports }
  });
}
function writeEntryTsx(outDir, srcDir, data) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "entry.tsx.hbs"),
    outPath: resolve(outDir, "entry.tsx"),
    data: {
      ...data,
      srcDir: resolve(outDir, "..", srcDir)
    }
  });
}
function writeTypesTs(outDir, pageConfigTypes = [], appConfigTypes = []) {
  const all = deepClone([...pageConfigTypes, ...appConfigTypes]).reduce((acc, item) => {
    const index = acc.findIndex((v) => v.source === item.source);
    if (index > -1 && Array.isArray(item.specifier) && Array.isArray(acc[index].specifier)) {
      acc[index].specifier = [...acc[index].specifier, ...item.specifier];
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "types.ts.hbs"),
    outPath: resolve(outDir, "types.ts"),
    data: { all, pageConfigTypes, appConfigTypes }
  });
}
function writeDefineTs(outDir, srcDir) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "define.ts.hbs"),
    outPath: `${outDir}/define.ts`,
    data: {
      srcDir: resolve(outDir, "..", srcDir)
    }
  });
}
function writeRoutesTs(outDir, manifest) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "manifest.ts.hbs"),
    outPath: resolve(outDir, "manifest.ts"),
    data: {
      manifest: Object.values(manifest).sort((a, b) => {
        const nA = a.id.replace(/\/?layout/, ""), nB = b.id.replace(/\/?layout/, "");
        return nA.length === nB.length ? b.id.indexOf("layout") : nA.length - nB.length;
      })
    }
  });
}
function wirteRuntime(outDir, runtimes) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "runtime.ts.hbs"),
    outPath: resolve(outDir, "runtime.ts"),
    data: { runtimes }
  });
}
function wirteTypings(outDir) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "typings.d.ts.hbs"),
    outPath: resolve(outDir, "typings.d.ts")
  });
}
function createTmpDir({
  root,
  srcDir,
  options
}) {
  const {
    manifest = {},
    pageConfigTypes,
    appConfigTypes,
    exports,
    imports,
    aheadCodes,
    tailCodes,
    runtimes
  } = options;
  const outDir = resolve(root, ".quick");
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  writeIndexts(outDir, exports);
  writeEntryTsx(outDir, srcDir, {
    imports,
    aheadCodes,
    tailCodes
  });
  writeTypesTs(outDir, pageConfigTypes, appConfigTypes);
  writeDefineTs(outDir, srcDir);
  writeRoutesTs(outDir, manifest);
  wirteRuntime(outDir, runtimes);
  wirteTypings(outDir);
}
export {
  createTmpDir,
  wirteRuntime,
  wirteTypings,
  writeDefineTs,
  writeEntryTsx,
  writeIndexts,
  writeRoutesTs,
  writeTypesTs
};

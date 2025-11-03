// src/vite-plugin.ts
import { mergeConfig } from "vite";
import { readFileSync, writeFileSync, existsSync as existsSync2 } from "fs";
import { resolve as resolve2, relative } from "path";
import { globSync } from "glob";
import { renderHbsTpl as renderHbsTpl2 } from "@quick/cli";

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

// src/vite-plugin.ts
var debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(void 0, args);
    }, delay);
  };
};
function needGenerateRoutes(path, srcDir = "src") {
  const regex = new RegExp(`^${srcDir}/(layout|layouts)(?:/index)?.tsx$`);
  const isRootLayout = regex.test(path);
  const isPageOrLayout = /^(?:(?!.*(layout|layouts)\/.*page\.tsx).)*\/((\S+\.)?page\.tsx|(\S+\.)?layout\.tsx|layout\/index\.tsx)$/.test(
    path
  );
  const inPagesDir = existsSync2(resolve2(process.cwd(), srcDir, "pages")) ? path.startsWith(`${srcDir}/pages`) : path.startsWith(srcDir);
  return isRootLayout || isPageOrLayout && inPagesDir || path === srcDir || path === `${srcDir}/pages`;
}
function generateRouteManifest(src = "src") {
  const srcDir = resolve2(process.cwd(), src);
  const pageDir = existsSync2(srcDir + "/pages") ? "pages" : "";
  const rootLayout = globSync("layout{s,}{/index,}.tsx", { cwd: srcDir });
  const include = [
    "**/{*.,}page.tsx",
    "**/{*.,}layout.tsx",
    "**/layout/index.tsx",
    "**/404{/index,}.tsx"
  ];
  const ignore = ["**/layout/**/*{[^/],}page.tsx", "**/layout/**/layout.tsx"];
  const pages = globSync(include, { cwd: resolve2(srcDir, pageDir), ignore });
  const idpaths = pages.reduce((prev, file) => {
    const id = file.replace(/index\//, "").replace(/\/?((index)|((((\/|^)index)?\.)?page))?\.tsx$/, "").replace(".", "/").replace(/\$(\w+)/, ":$1").replace(/\$$/, "*").replace(/404$/, "*");
    prev[id || "/"] = file;
    return prev;
  }, {});
  const ids = Object.keys(idpaths).sort((a, b) => {
    const nA = a.replace(/\/?layout/, ""), nB = b.replace(/\/?layout/, "");
    return nA.length === nB.length ? a.indexOf("layout") : nB.length - nA.length;
  });
  const routesManifest = ids.reduce((prev, id, index) => {
    const parentId = ids.slice(index + 1).find((v) => {
      return v.endsWith("layout") && id.startsWith(v.replace(/\/?layout/, ""));
    });
    const regex = new RegExp(`^${parentId?.replace(/\/?layout$/, "")}/?|/?layout$`, "g");
    return {
      ...prev,
      [id]: {
        id,
        parentId,
        path: id === "/" ? "" : id.replace(regex, ""),
        pathname: id.replace(/\/?layout?$/, ""),
        file: resolve2(srcDir, pageDir, idpaths[id]),
        layout: id.endsWith("layout")
      }
    };
  }, {});
  if (rootLayout.length > 0 && pageDir) {
    Object.values(routesManifest).forEach((v) => {
      if (!v.parentId) v.parentId = "rootLayout";
    });
    routesManifest["rootLayout"] = {
      id: "rootLayout",
      path: "",
      pathname: "",
      file: resolve2(srcDir, rootLayout[0]),
      layout: true
    };
  }
  return routesManifest;
}
async function watchRoutes(event, path, srcDir = "src") {
  path = relative(process.cwd(), path);
  if (event !== "change" && needGenerateRoutes(path)) {
    writeRoutesTs(resolve2(process.cwd(), ".quick"), generateRouteManifest(srcDir));
  }
}
async function loadPlugins(plugins, config) {
  const runtimes = [];
  const pageConfigTypes = [];
  const appConfigTypes = [];
  const exports = [];
  const imports = [];
  const aheadCodes = [];
  const tailCodes = [];
  const watchers = [];
  let viteConfig = {};
  const modifyUserConfig = (fn) => {
    config = fn(config);
  };
  const addFile = ({ content, outPath }) => {
    writeFileSync(outPath, content);
  };
  const addFileTemplate = (options) => {
    renderHbsTpl2(options);
  };
  const addPageConfigType = (options) => {
    pageConfigTypes.push(options);
  };
  const addAppConfigType = (options) => {
    appConfigTypes.push(options);
  };
  const addExport = (options) => {
    exports.push(options);
  };
  const addEntryImport = (options) => {
    imports.push(options);
  };
  const addEntryCodeAhead = (code) => {
    aheadCodes.push(code);
  };
  const addEntryCodeTail = (code) => {
    tailCodes.push(code);
  };
  const addWatch = (fn) => {
    watchers.push(fn);
  };
  const mergeViteConfig = (config2) => {
    viteConfig = mergeConfig(viteConfig, config2);
  };
  if (plugins && plugins.length > 0) {
    const pkgText = readFileSync(`${process.cwd()}/package.json`, "utf-8");
    const pkg = JSON.parse(pkgText);
    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];
      const { setup, runtime } = plugin;
      const context = {
        mode: process.env.NODE_ENV,
        root: process.cwd(),
        srcDir: config.srcDir ?? "src",
        userConfig: config,
        pkg
      };
      if (runtime) runtimes.push(runtime);
      await setup?.({
        context,
        modifyUserConfig,
        addFile,
        addFileTemplate,
        addPageConfigType,
        addAppConfigType,
        addExport,
        addEntryImport,
        addEntryCodeAhead,
        addEntryCodeTail,
        addWatch,
        mergeViteConfig
      });
    }
  }
  return {
    pageConfigTypes,
    appConfigTypes,
    exports,
    imports,
    aheadCodes,
    tailCodes,
    runtimes,
    watchers,
    viteConfig
  };
}
function loadGlobalStyle(srcDir, {
  imports,
  aheadCodes,
  tailCodes,
  watchers
}) {
  const globalStyle = globSync(`${srcDir}/global.{less,scss,css}`, {
    cwd: process.cwd()
  });
  if (globalStyle && globalStyle.length > 0) {
    imports.push({ source: `${process.cwd()}/${globalStyle[0]}` });
  }
  watchers.push((event, path) => {
    const reg = new RegExp(`^${process.cwd()}/${srcDir}/global.(less|scss|css)$`);
    if (!reg.test(path)) return;
    if (event === "add") {
      imports.push({ source: path });
      writeEntryTsx(resolve2(process.cwd(), ".quick"), srcDir, {
        imports,
        aheadCodes,
        tailCodes
      });
    } else if (event === "unlink") {
      imports.splice(
        imports.findIndex((v) => v.source === path),
        1
      );
      writeEntryTsx(resolve2(process.cwd(), ".quick"), srcDir, {
        imports,
        aheadCodes,
        tailCodes
      });
    }
  });
}
function QucikCore(quickonfig = {}) {
  const { srcDir = "src", plugins = [] } = quickonfig;
  let watchers = [];
  return {
    name: "quick-core",
    enforce: "pre",
    config: async () => {
      watchers = [];
      const {
        pageConfigTypes,
        appConfigTypes,
        exports,
        imports,
        aheadCodes,
        tailCodes,
        runtimes,
        watchers: pluginWatchers,
        viteConfig
      } = await loadPlugins(plugins, quickonfig);
      watchers = pluginWatchers;
      loadGlobalStyle(srcDir, { imports, aheadCodes, tailCodes, watchers });
      createTmpDir({
        root: process.cwd(),
        srcDir,
        options: {
          manifest: generateRouteManifest(srcDir),
          pageConfigTypes,
          appConfigTypes,
          exports,
          imports,
          aheadCodes,
          tailCodes,
          runtimes
        }
      });
      return mergeConfig(
        {
          resolve: {
            alias: {
              "@": resolve2(process.cwd(), srcDir.split("/")[0]),
              quick: resolve2(process.cwd(), ".quick"),
              "/quick.tsx": resolve2(process.cwd(), ".quick", "entry.tsx")
            }
          },
          build: {
            rollupOptions: {
              input: {
                quick: resolve2(process.cwd(), ".quick", "entry.tsx"),
                main: "index.html"
              }
            }
          }
        },
        viteConfig
      );
    },
    configureServer: (server) => {
      server.watcher.on("all", (event, path, stats) => {
        debounce(() => watchRoutes(event, path, srcDir), 150)();
        watchers.forEach((fn) => fn(event, path, stats));
      });
    }
  };
}
export {
  debounce,
  QucikCore as default
};

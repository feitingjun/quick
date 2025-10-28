import {
  createTmpDir,
  writeEntryTsx,
  writeRoutesTs
} from "./chunk-7CC5FX6A.js";

// src/vite-plugin.ts
import { mergeConfig } from "vite";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, relative } from "path";
import { globSync } from "glob";
import { renderHbsTpl } from "@quick/cli";
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
  const inPagesDir = existsSync(resolve(process.cwd(), srcDir, "pages")) ? path.startsWith(`${srcDir}/pages`) : path.startsWith(srcDir);
  return isRootLayout || isPageOrLayout && inPagesDir || path === srcDir || path === `${srcDir}/pages`;
}
function generateRouteManifest(src = "src") {
  const srcDir = resolve(process.cwd(), src);
  const pageDir = existsSync(srcDir + "/pages") ? "pages" : "";
  const rootLayout = globSync("layout{s,}{/index,}.tsx", { cwd: srcDir });
  const include = [
    "**/{*.,}page.tsx",
    "**/{*.,}layout.tsx",
    "**/layout/index.tsx",
    "**/404{/index,}.tsx"
  ];
  const ignore = ["**/layout/**/*{[^/],}page.tsx", "**/layout/**/layout.tsx"];
  const pages = globSync(include, { cwd: resolve(srcDir, pageDir), ignore });
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
        file: resolve(srcDir, pageDir, idpaths[id]),
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
      file: resolve(srcDir, rootLayout[0]),
      layout: true
    };
  }
  return routesManifest;
}
async function watchRoutes(event, path, srcDir = "src") {
  path = relative(process.cwd(), path);
  if (event !== "change" && needGenerateRoutes(path)) {
    writeRoutesTs(resolve(process.cwd(), ".quick"), generateRouteManifest(srcDir));
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
    renderHbsTpl(options);
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
      writeEntryTsx(resolve(process.cwd(), ".quick"), srcDir, {
        imports,
        aheadCodes,
        tailCodes
      });
    } else if (event === "unlink") {
      imports.splice(
        imports.findIndex((v) => v.source === path),
        1
      );
      writeEntryTsx(resolve(process.cwd(), ".quick"), srcDir, {
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
              "@": resolve(process.cwd(), srcDir.split("/")[0]),
              quick: resolve(process.cwd(), ".quick"),
              "/quick.tsx": resolve(process.cwd(), ".quick", "entry.tsx")
            }
          },
          build: {
            rollupOptions: {
              input: {
                quick: resolve(process.cwd(), ".quick", "entry.tsx"),
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
  QucikCore
};
//# sourceMappingURL=chunk-WDD7UPWD.js.map
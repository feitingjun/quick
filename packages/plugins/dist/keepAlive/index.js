// src/keepAlive/index.ts
import { definePlugin } from "@quick/core";
import { resolve } from "path";
var __dirname = import.meta.dirname;
var keepAlive_default = definePlugin({
  setup({ addEntryImport, addExport, addAppConfigType, addPageConfigType }) {
    addEntryImport({ source: resolve(__dirname, "fixContext") });
    addExport({
      specifier: "AliveScope",
      source: resolve(__dirname, "aliveScope")
    });
    addExport({
      specifier: "KeepAlive",
      source: resolve(__dirname, "keepAlive")
    });
    addExport({
      specifier: ["useAliveController", "useActivate", "useUnactivate"],
      source: resolve(__dirname, "hooks")
    });
    addAppConfigType({
      specifier: ["KeepAliveAppTypes"],
      source: resolve(__dirname, "runtime")
    });
    addPageConfigType({
      specifier: ["KeepAlivePageConfig"],
      source: resolve(__dirname, "runtime")
    });
  },
  runtime: resolve(__dirname, "runtime")
});
export {
  keepAlive_default as default
};
//# sourceMappingURL=index.js.map
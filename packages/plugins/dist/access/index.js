// src/access/index.ts
import { definePlugin } from "@quick/core";
import { resolve } from "path";
var access_default = definePlugin({
  setup: ({ addPageConfigType, addExport, addAppConfigType }) => {
    addPageConfigType({
      specifier: ["AccessPageConfig"],
      source: resolve(import.meta.dirname, "runtime")
    });
    addExport({
      specifier: ["useAuth", "Access", "AccessHC", "useAccess"],
      source: resolve(import.meta.dirname, "runtime")
    });
    addAppConfigType({
      specifier: ["AccessAppConfig"],
      source: resolve(import.meta.dirname, "runtime")
    });
  },
  runtime: resolve(import.meta.dirname, "runtime")
});
export {
  access_default as default
};

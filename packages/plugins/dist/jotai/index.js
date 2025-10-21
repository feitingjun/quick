// src/jotai/index.ts
import { resolve } from "path";
import { definePlugin } from "@quick/core";
var jotai_default = definePlugin({
  setup: ({ addExport }) => {
    addExport({
      specifier: ["atom", "useAtom"],
      source: resolve(import.meta.dirname, "jotai")
    });
  }
});
export {
  jotai_default as default
};
//# sourceMappingURL=index.js.map
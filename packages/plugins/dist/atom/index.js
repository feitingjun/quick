// src/atom/index.ts
import { resolve } from "path";
import { definePlugin } from "@quick/core";
var atom_default = definePlugin({
  setup: ({ addExport }) => {
    addExport({
      specifier: ["atom", "useAtom"],
      source: resolve(import.meta.dirname, "atom")
    });
  }
});
export {
  atom_default as default
};
//# sourceMappingURL=index.js.map
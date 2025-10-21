// src/pandacss/index.ts
import { resolve } from "path";
import { existsSync } from "fs";
import { loadConfigAndCreateContext, codegen } from "@pandacss/node";
import { definePlugin } from "@quick/core";
var configTml = (srcDir, outPath) => `
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: ['./${srcDir}/**/*.{js,jsx,ts,tsx}'],
  exclude: ['.quick/**/*', 'node_modules'],
  jsxFramework: 'react',
  outdir: '${outPath}'
})
`.trim();
var postcssTml = `
module.exports = {
  plugins: {
    '@pandacss/dev/postcss': {}
  }
}
`.trim();
var generate = async (configPath) => {
  const ctx = await loadConfigAndCreateContext({
    configPath,
    cwd: process.cwd()
  });
  await codegen(ctx);
};
var pandacss_default = definePlugin({
  setup: async ({ context: { srcDir }, addWatch, addFile }) => {
    const pandacss = "panda.config.ts";
    const configPath = resolve(process.cwd(), pandacss);
    const postcssPath = resolve(process.cwd(), "postcss.config.cjs");
    const outPath = ".quick/pandacss";
    if (!existsSync(configPath)) {
      addFile({
        content: configTml(srcDir, outPath),
        outPath: resolve(process.cwd(), configPath)
      });
    }
    if (!existsSync(postcssPath)) {
      addFile({
        content: postcssTml,
        outPath: resolve(process.cwd(), postcssPath)
      });
    }
    await generate(configPath);
    addWatch((event, path) => {
      if (path === configPath && (event === "add" || event === "change")) {
        generate(configPath);
      }
    });
  }
});
export {
  pandacss_default as default
};
//# sourceMappingURL=index.js.map
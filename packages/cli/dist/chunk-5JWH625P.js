// src/writeFile.ts
import { readFileSync } from "fs";
import { resolve } from "path";
import { renderHbsTpl } from "@quick/utils";
var __dirname = import.meta.dirname;
var TML_DIR = resolve(__dirname, "template");
function writePackageJson(root, description) {
  const isDev = process.argv.includes("--development");
  const appPackageJson = readFileSync(
    resolve(__dirname, "../../app", "package.json"),
    "utf-8"
  );
  const corePackageJson = readFileSync(
    resolve(__dirname, "../../core", "package.json"),
    "utf-8"
  );
  const appVersion = JSON.parse(appPackageJson).version;
  const coreVersion = JSON.parse(corePackageJson).version;
  const path = root.split("/");
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "package.json.hbs"),
    outPath: resolve(root, "package.json"),
    data: {
      projectName: path[path.length - 1],
      description,
      appVersion: isDev ? "workspace:*" : appVersion,
      coreVersion: isDev ? "workspace:*" : coreVersion
    }
  });
}
function writeTsConfigJson(root, srcDir) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "tsconfig.json.hbs"),
    outPath: resolve(root, "tsconfig.json"),
    data: { srcDir, srcDirRoot: srcDir.split("/")[0] }
  });
}
function writeAppTs(root, srcDir) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "app.tsx.hbs"),
    outPath: resolve(root, srcDir, "app.tsx")
  });
}
function writeIndexPageTsx(root, srcDir) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "page.tsx.hbs"),
    outPath: resolve(root, srcDir, "page.tsx")
  });
}
function writeViteConfigTs(root) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "vite.config.ts.hbs"),
    outPath: resolve(root, "vite.config.ts")
  });
}
function writeIndexHtml(root) {
  renderHbsTpl({
    sourcePath: resolve(TML_DIR, "index.html.hbs"),
    outPath: resolve(root, "index.html")
  });
}

export {
  writePackageJson,
  writeTsConfigJson,
  writeAppTs,
  writeIndexPageTsx,
  writeViteConfigTs,
  writeIndexHtml
};
//# sourceMappingURL=chunk-5JWH625P.js.map
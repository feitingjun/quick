#!/usr/bin/env node

// src/bin.ts
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { input } from "@inquirer/prompts";

// src/chalk.ts
var chalk = {
  blue: (text) => {
    return `\x1B[34m${text}\x1B[0m`;
  },
  green: (text) => {
    return `\x1B[32m${text}\x1B[0m`;
  },
  red: (text) => {
    return `\x1B[31m${text}\x1B[0m`;
  }
};

// src/writeFile.ts
import { readFileSync as readFileSync2 } from "fs";
import { resolve } from "path";

// src/hbs.ts
import { readFileSync, writeFileSync } from "fs";
import hbs from "handlebars";
hbs.registerHelper("isArray", function(value, options) {
  return hbs.Utils.isArray(value) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("isString", function(value, options) {
  return typeof value === "string" ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("isEqual", function(value1, value2) {
  return value1 === value2;
});
hbs.registerHelper("and", function(value1, value2) {
  return value1 && value2;
});
hbs.registerHelper("or", function(value1, value2) {
  return value1 || value2;
});
hbs.registerHelper("rmTsx", function(value) {
  return value.replace(/\.tsx$/, "");
});
hbs.registerHelper("boolean", function(value) {
  return !!value;
});
hbs.registerHelper("repeat", function(num, str) {
  return str.repeat(num);
});
hbs.registerHelper("space", function(value) {
  if (typeof value !== "number") {
    value = 1;
  }
  return " ".repeat(value);
});
var renderHbsTpl = ({
  sourcePath,
  outPath,
  data = {}
}) => {
  const rendered = hbs.compile(readFileSync(sourcePath, "utf-8"))(data);
  if (rendered) {
    writeFileSync(outPath, rendered);
  } else {
    console.log(chalk.red(`\u52A0\u8F7D\u6A21\u677F\u6587\u4EF6\u5931\u8D25: ${sourcePath}`));
  }
};

// src/writeFile.ts
var __dirname = import.meta.dirname;
var TML_DIR = resolve(__dirname, "template");
function writePackageJson(root, description) {
  const isDev = process.argv.includes("--development");
  const appPackageJson = readFileSync2(resolve(__dirname, "../../app", "package.json"), "utf-8");
  const corePackageJson = readFileSync2(resolve(__dirname, "../../core", "package.json"), "utf-8");
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

// src/bin.ts
async function createApp() {
  const projectName = await input({
    message: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0",
    default: "my-app"
  });
  const srcDir = await input({ message: "\u8BF7\u8F93\u5165src\u6587\u4EF6\u5939\u540D\u79F0", default: "src" });
  const description = await input({ message: "\u8BF7\u8F93\u5165\u9879\u76EE\u63CF\u8FF0" });
  if (existsSync(projectName)) {
    console.log(chalk.red(`${projectName}\u6587\u4EF6\u5939\u5DF2\u5B58\u5728`));
    return;
  }
  const root = join(process.cwd(), projectName);
  mkdirSync(join(process.cwd(), projectName, srcDir), { recursive: true });
  writePackageJson(root, description);
  writeTsConfigJson(root, srcDir);
  writeViteConfigTs(root);
  writeIndexHtml(root);
  writeAppTs(root, srcDir);
  writeIndexPageTsx(root, srcDir);
  console.log(chalk.green(`\u9879\u76EE${projectName}\u521B\u5EFA\u6210\u529F`));
}
createApp();

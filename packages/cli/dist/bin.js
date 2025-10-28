#!/usr/bin/env node
import {
  writeAppTs,
  writeIndexHtml,
  writeIndexPageTsx,
  writePackageJson,
  writeTsConfigJson,
  writeViteConfigTs
} from "./chunk-HS5K6NEY.js";
import "./chunk-I7OM4NWV.js";
import {
  chalk
} from "./chunk-CNA7HHJW.js";

// src/bin.ts
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { input } from "@inquirer/prompts";
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
//# sourceMappingURL=bin.js.map
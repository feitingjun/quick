#!/usr/bin/env node

// src/index.ts
import { existsSync, cpSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { text, confirm, isCancel, intro, outro, select, log } from "@clack/prompts";
import { cwd } from "process";
import { execSync } from "child_process";
var __dirname = import.meta.dirname;
var IGNORE_FILES = ["node_modules", "package.json", "index.html"];
var TEMPLATE_LIST = [
  { name: "\u7A7A\u767D\u6A21\u7248", template: "template-blank" },
  { name: "antd \u6A21\u7248", template: "template-antd" },
  { name: "antd + tailwindcss \u6A21\u7248", template: "template-antd-tailwindcss" },
  { name: "@quick/ui \u6A21\u7248", template: "template-quick-ui" }
];
var copyTemplate = ({ projectName, template }) => {
  const templatePath = resolve(__dirname, `../${template}`);
  const targetPath = resolve(cwd(), projectName);
  cpSync(templatePath, targetPath, {
    recursive: true,
    filter: (path) => IGNORE_FILES.every((ignore) => !path.includes(ignore))
  });
  const pkgContent = readFileSync(resolve(templatePath, "package.json"), "utf-8");
  const htmlContent = readFileSync(resolve(templatePath, "index.html"), "utf-8");
  writeFileSync(
    resolve(targetPath, "package.json"),
    pkgContent.replaceAll("vite-file-router-template", projectName)
  );
  writeFileSync(
    resolve(targetPath, "index.html"),
    htmlContent.replaceAll("vite-file-router-template", projectName)
  );
  log.success(`\u9879\u76EE ${projectName} \u521B\u5EFA\u5B8C\u6210`);
};
async function createApp() {
  intro(`\u521B\u5EFA\u9879\u76EE`);
  const projectName = await text({
    message: "\u9879\u76EE\u540D\u79F0",
    initialValue: "my-app",
    placeholder: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0"
  });
  if (isCancel(projectName)) return;
  const template = await select({
    message: "\u9009\u62E9\u6A21\u7248",
    options: TEMPLATE_LIST.map((item) => ({ label: item.name, value: item.template })),
    initialValue: TEMPLATE_LIST[0].template
  });
  if (isCancel(template)) return;
  if (existsSync(projectName)) {
    log.error(`\u6587\u4EF6\u5939 ${projectName} \u5DF2\u5B58\u5728`);
    return;
  }
  mkdirSync(resolve(cwd(), projectName));
  copyTemplate({ projectName, template });
  const isRun = await confirm({
    message: "\u662F\u5426\u5B89\u88C5\u4F9D\u8D56\u5E76\u542F\u52A8\u9879\u76EE",
    active: "\u662F",
    inactive: "\u5426",
    initialValue: true
  });
  if (isCancel(isRun)) return;
  if (!isRun) {
    outro(`\u521B\u5EFA\u5B8C\u6210\uFF0C\u8FD0\u884C\u547D\u4EE4:
      
    cd ${projectName}
    npm install
    npm start  
    `);
    return;
  }
  const pkgManager = await select({
    message: "\u9009\u62E9\u5305\u7BA1\u7406\u5668",
    options: [
      { label: "npm", value: "npm" },
      { label: "pnpm", value: "pnpm" },
      { label: "yarn", value: "yarn" }
    ],
    initialValue: "npm"
  });
  if (isCancel(pkgManager)) return;
  outro(`\u521B\u5EFA\u5B8C\u6210\uFF0C\u542F\u52A8\u9879\u76EE\uFF1A`);
  execSync(`cd ${projectName} && ${pkgManager} install && ${pkgManager} start`);
}
createApp();
//# sourceMappingURL=index.js.map
// src/index.ts
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { dirname, relative, resolve } from "path";
import { fileURLToPath } from "url";
var VIRTUAL_MODULE_ID = "virtual:file-router";
var RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;
var PAGE_FILE_RE = /(?:^|\.)page\.(?:[cm]?[jt]sx?)$/;
var LAYOUT_FILE_RE = /(?:^|\.)layout\.(?:[cm]?[jt]sx?)$/;
var INDEX_FILE_RE = /^index\.(?:[cm]?[jt]sx?)$/;
var NESTED_LAYOUT_INDEX_RE = /(?:^|\/)layout\/index\.(?:[cm]?[jt]sx?)$/;
var FILE_EXTENSION_RE = /\.(?:[cm]?[jt]sx?)$/;
var DYNAMIC_SEGMENT_RE = /^\[(.+)\]$/;
var STRUCTURE_CHANGE_EVENTS = ["add", "unlink", "addDir", "unlinkDir"];
var TEMPLATE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "template");
var VIRTUAL_MODULE_TEMPLATE_FILE = "virtual-module.js.template";
var TEMPLATE_CONTENT_CACHE = /* @__PURE__ */ new Map();
function fileRouterPlugin() {
  let config;
  let knownRouteFiles = /* @__PURE__ */ new Set();
  return {
    name: "vite-plugin-file-router",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configureServer(server) {
      const createStructureChangeHandler = (event) => (file) => {
        if (!config || !isInsideSrc(config.root, file)) {
          return;
        }
        if (!shouldRefreshVirtualRoutes(config.root, file, event, knownRouteFiles)) {
          return;
        }
        refreshVirtualRoutes(server);
      };
      for (const event of STRUCTURE_CHANGE_EVENTS) {
        server.watcher.on(event, createStructureChangeHandler(event));
      }
    },
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID || !config) {
        return null;
      }
      const routeFiles = scanRouteFiles(config.root);
      knownRouteFiles = new Set(routeFiles.map((routeFile) => normalizeSlashes(routeFile.file)));
      return generateVirtualModule(routeFiles, this);
    }
  };
}
function generateVirtualModule(routeFiles, ctx) {
  const routeCode = renderRoutes(buildRouteTree(routeFiles, ctx));
  return renderTemplate(VIRTUAL_MODULE_TEMPLATE_FILE, { ROUTES: routeCode });
}
function resolveRouteRoots(root) {
  const srcDir = resolve(root, "src");
  const pagesDir = resolve(srcDir, "pages");
  const layoutsDir = resolve(srcDir, "layouts");
  const routeRoot = existsSync(pagesDir) ? pagesDir : srcDir;
  return {
    routeRoot,
    layoutsDir,
    routeRootIgnoredDirs: routeRoot === srcDir ? [layoutsDir] : []
  };
}
function scanRouteFiles(root) {
  return getRouteScanTargets(root).flatMap(
    (target) => collectRouteFiles(target.rootDir, target.kind, target.options)
  );
}
function getRouteScanTargets(root) {
  const { routeRoot, layoutsDir, routeRootIgnoredDirs } = resolveRouteRoots(root);
  return [
    { rootDir: routeRoot, kind: "page", options: { ignoredDirs: routeRootIgnoredDirs } },
    { rootDir: routeRoot, kind: "layout", options: { ignoredDirs: routeRootIgnoredDirs } },
    { rootDir: layoutsDir, kind: "layout", options: { allowRootIndexAsLayout: true } }
  ];
}
function collectRouteFiles(rootDir, kind, options = {}) {
  if (!existsSync(rootDir)) {
    return [];
  }
  const { ignoredDirs = [], allowRootIndexAsLayout = false } = options;
  const ignoredDirSet = new Set(ignoredDirs.map((dir) => normalizeSlashes(resolve(dir))));
  const routeFiles = [];
  walkFiles(
    rootDir,
    (file) => {
      const routeFile = toRouteFile(file, rootDir, kind, allowRootIndexAsLayout);
      if (routeFile) {
        routeFiles.push(routeFile);
      }
    },
    ignoredDirSet
  );
  return routeFiles.sort((left, right) => left.file.localeCompare(right.file));
}
function walkFiles(dir, onFile, ignoredDirs = /* @__PURE__ */ new Set()) {
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    const normalizedPath = normalizeSlashes(fullPath);
    if (ignoredDirs.has(normalizedPath)) {
      continue;
    }
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walkFiles(fullPath, onFile, ignoredDirs);
      continue;
    }
    if (stats.isFile()) {
      onFile(fullPath);
    }
  }
}
function toRouteFile(file, rootDir, kind, allowRootIndexAsLayout) {
  const relativeFile = normalizeSlashes(relative(rootDir, file));
  if (!isRouteFile(relativeFile, kind, allowRootIndexAsLayout)) {
    return null;
  }
  return {
    file,
    importPath: normalizeImportPath(file),
    kind,
    routeSegments: parseRouteSegments(relativeFile, kind)
  };
}
function isRouteFile(relativeFile, kind, allowRootIndexAsLayout = false) {
  const fileName = getFileName(relativeFile);
  if (isInsideLayoutDir(relativeFile) && !isNestedLayoutIndexFile(relativeFile)) {
    return false;
  }
  if (kind === "page") {
    return isPageFile(fileName);
  }
  return isLayoutFile(fileName) || isNestedLayoutIndexFile(relativeFile) || isRootIndexLayoutFile(relativeFile, fileName, allowRootIndexAsLayout);
}
function isPageFile(fileName) {
  return PAGE_FILE_RE.test(fileName) && !LAYOUT_FILE_RE.test(fileName);
}
function isLayoutFile(fileName) {
  return LAYOUT_FILE_RE.test(fileName);
}
function isIndexFile(fileName) {
  return INDEX_FILE_RE.test(fileName);
}
function isRootIndexLayoutFile(relativeFile, fileName, allowRootIndexAsLayout) {
  return allowRootIndexAsLayout && relativeFile === fileName && isIndexFile(fileName);
}
function parseRouteSegments(relativeFile, kind) {
  const pathWithoutExtension = relativeFile.replace(FILE_EXTENSION_RE, "");
  const pathParts = pathWithoutExtension.split("/");
  const fileName = pathParts.pop() ?? "";
  const directoryParts = kind === "layout" && fileName === "index" && pathParts.at(-1) === "layout" ? pathParts.slice(0, -1) : pathParts;
  return [
    ...directoryParts.flatMap(splitRouteToken),
    ...parseFileNameSegments(fileName, kind)
  ].filter(isRouteSegment);
}
function parseFileNameSegments(fileName, kind) {
  const suffix = kind === "layout" ? ".layout" : ".page";
  const bareName = kind === "layout" ? "layout" : "page";
  if (fileName === bareName) {
    return [];
  }
  if (fileName.endsWith(suffix)) {
    return splitRouteToken(fileName.slice(0, -suffix.length));
  }
  return splitRouteToken(fileName);
}
function isRouteSegment(segment) {
  return segment.length > 0 && segment !== "index";
}
function splitRouteToken(token) {
  return token.split(".").filter(Boolean).map(normalizeRouteSegment);
}
function normalizeRouteSegment(segment) {
  if (segment === "404") {
    return "*";
  }
  const dynamicMatch = DYNAMIC_SEGMENT_RE.exec(segment);
  return dynamicMatch ? `:${dynamicMatch[1]}` : segment;
}
function isNestedLayoutIndexFile(relativeFile) {
  return NESTED_LAYOUT_INDEX_RE.test(relativeFile);
}
function isInsideLayoutDir(relativeFile) {
  return relativeFile.split("/").slice(0, -1).includes("layout");
}
function getFileName(relativeFile) {
  return relativeFile.split("/").at(-1) ?? relativeFile;
}
function shouldRefreshVirtualRoutes(root, file, event, knownRouteFiles) {
  const normalizedFile = normalizeSlashes(file);
  if (event === "add" || event === "unlink") {
    return isRoutableFilePath(root, normalizedFile);
  }
  if (isPagesDir(root, normalizedFile)) {
    return true;
  }
  return event === "unlinkDir" && containsKnownRouteFile(knownRouteFiles, normalizedFile);
}
function isRoutableFilePath(root, file) {
  return getRouteScanTargets(root).some((target) => matchesRouteScanTarget(file, target));
}
function matchesRouteScanTarget(file, target) {
  const relativeFile = getRelativeFileIfInsideTarget(file, target);
  if (!relativeFile) {
    return false;
  }
  return isRouteFile(relativeFile, target.kind, target.options?.allowRootIndexAsLayout);
}
function getRelativeFileIfInsideTarget(file, target) {
  const normalizedRootDir = normalizeSlashes(resolve(target.rootDir));
  if (file === normalizedRootDir || !file.startsWith(`${normalizedRootDir}/`)) {
    return null;
  }
  if (isInsideIgnoredDir(file, target.options?.ignoredDirs ?? [])) {
    return null;
  }
  return normalizeSlashes(relative(normalizedRootDir, file));
}
function isInsideIgnoredDir(file, ignoredDirs) {
  return ignoredDirs.some((dir) => {
    const normalizedDir = normalizeSlashes(resolve(dir));
    return file === normalizedDir || file.startsWith(`${normalizedDir}/`);
  });
}
function isPagesDir(root, file) {
  return normalizeSlashes(resolve(root, "src/pages")) === file;
}
function containsKnownRouteFile(knownRouteFiles, dir) {
  const normalizedDir = normalizeSlashes(dir);
  for (const routeFile of knownRouteFiles) {
    if (routeFile.startsWith(`${normalizedDir}/`)) {
      return true;
    }
  }
  return false;
}
function renderTemplate(templateFile, replacements) {
  let content = readTemplateFile(templateFile);
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(`__${key}__`, value);
  }
  return content;
}
function readTemplateFile(templateFile) {
  let content = TEMPLATE_CONTENT_CACHE.get(templateFile);
  if (!content) {
    content = readFileSync(resolve(TEMPLATE_DIR, templateFile), "utf8");
    TEMPLATE_CONTENT_CACHE.set(templateFile, content);
  }
  return content;
}
function buildRouteTree(files, ctx) {
  const root = createNode(null);
  for (const routeFile of files) {
    const node = ensureRouteNode(root, routeFile.routeSegments);
    attachRouteFile(node, routeFile, ctx);
  }
  return root;
}
function ensureRouteNode(root, segments) {
  let current = root;
  for (const segment of segments) {
    let child = current.children.get(segment);
    if (!child) {
      child = createNode(segment);
      current.children.set(segment, child);
    }
    current = child;
  }
  return current;
}
function attachRouteFile(node, routeFile, ctx) {
  const previous = routeFile.kind === "page" ? node.page : node.layout;
  if (previous) {
    ctx.warn(createDuplicateRouteWarning(previous, routeFile));
  }
  if (routeFile.kind === "page") {
    node.page = routeFile;
  } else {
    node.layout = routeFile;
  }
}
function createDuplicateRouteWarning(previous, next) {
  return `[vite-plugin-file-router] Duplicate ${next.kind} route "${toRoutePath(next.routeSegments)}": "${previous.file}" will be replaced by "${next.file}".`;
}
function createNode(segment) {
  return {
    segment,
    children: /* @__PURE__ */ new Map()
  };
}
function renderRoutes(root) {
  return renderArray(renderRouteEntries(root, [], true));
}
function renderRouteEntries(node, parentSegments = [], isRoot = false) {
  const currentSegments = node.segment ? [...parentSegments, node.segment] : [...parentSegments];
  const childSegments = node.page || node.layout ? [] : currentSegments;
  const renderedChildren = getSortedChildren(node).flatMap(
    (child) => renderRouteEntries(child, childSegments)
  );
  if (!node.page && !node.layout) {
    return renderedChildren;
  }
  return [renderRouteObject(buildRouteProps(node, currentSegments, renderedChildren, isRoot))];
}
function buildRouteProps(node, segments, renderedChildren, isRoot) {
  if (isRoot && node.page && !node.layout && renderedChildren.length === 0) {
    return [renderPathProperty([]), renderRouteMetaProperty(false), renderLazyProperty(node.page)];
  }
  const props = isRoot ? [] : [renderPathProperty(segments)];
  const children = [...renderedChildren];
  if (node.page && (node.layout || children.length > 0)) {
    children.unshift(renderIndexRoute(node.page));
  } else if (node.page) {
    props.push(renderRouteMetaProperty(false), renderLazyProperty(node.page));
  }
  if (node.layout) {
    props.push(renderRouteMetaProperty(true), renderLazyProperty(node.layout));
  }
  if (children.length > 0) {
    props.push(renderChildrenProperty(children));
  }
  return props;
}
function getSortedChildren(node) {
  return Array.from(node.children.values()).sort(compareNodes);
}
function renderRouteObject(props) {
  return `{
${indent(props.join(",\n"))}
}`;
}
function renderArray(routes) {
  return routes.length > 0 ? `[
${indent(routes.join(",\n"))}
]` : "[]";
}
function renderPathProperty(segments) {
  return `path: ${JSON.stringify(joinRoutePath(segments))}`;
}
function renderLazyProperty(routeFile) {
  return `lazy: ${renderLazyLoader(routeFile.importPath)}`;
}
function renderRouteMetaProperty(isLayout) {
  return `__fileRouter: { isLayout: ${JSON.stringify(isLayout)} }`;
}
function renderIndexRoute(routeFile) {
  return `{ index: true, ${renderRouteMetaProperty(false)}, lazy: ${renderLazyLoader(routeFile.importPath)} }`;
}
function renderChildrenProperty(routes) {
  return `children: ${renderArray(routes)}`;
}
function renderLazyLoader(importPath) {
  return `() => import(${JSON.stringify(importPath)})`;
}
function compareNodes(left, right) {
  if (left.segment === "*" && right.segment !== "*") {
    return 1;
  }
  if (left.segment !== "*" && right.segment === "*") {
    return -1;
  }
  return (left.segment ?? "").localeCompare(right.segment ?? "");
}
function toRoutePath(segments) {
  return segments.length > 0 ? `/${segments.join("/")}` : "/";
}
function joinRoutePath(segments) {
  return segments.length > 0 ? segments.join("/") : "/";
}
function normalizeImportPath(file) {
  const normalized = normalizeSlashes(file);
  return normalized.startsWith("/") ? `/@fs${normalized}` : `/@fs/${normalized}`;
}
function normalizeSlashes(value) {
  return value.replaceAll("\\", "/");
}
function indent(value) {
  return value.split("\n").map((line) => `  ${line}`).join("\n");
}
function isInsideSrc(root, file) {
  const srcDir = normalizeSlashes(resolve(root, "src"));
  const normalizedFile = normalizeSlashes(file);
  return normalizedFile === srcDir || normalizedFile.startsWith(`${srcDir}/`);
}
function refreshVirtualRoutes(server) {
  invalidateVirtualModule(server);
  server.ws.send({ type: "full-reload" });
}
function invalidateVirtualModule(server) {
  const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
  if (module) {
    server.moduleGraph.invalidateModule(module);
  }
}
export {
  fileRouterPlugin as default
};

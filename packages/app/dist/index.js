// src/method.ts
import { createRoot } from "react-dom/client";
import { createElement, StrictMode, createContext, useContext } from "react";
import {
  useLoaderData as useRouteLoaderData,
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
  RouterProvider
} from "react-router";
var AppContext = createContext({
  manifest: {},
  routes: [],
  appData: {}
});
var useAppContext = () => {
  return useContext(AppContext);
};
var useConfig = () => {
  return useRouteLoaderData().config;
};
var useLoaderData = () => {
  return useRouteLoaderData().data;
};
var loader = (module) => {
  const { loader: dataLoader, config: pageConfig = {} } = module;
  return async ({ request }) => {
    const { pathname, search, searchParams } = new URL(request.url);
    const ctx = {
      pathname,
      search,
      query: Object.fromEntries(searchParams.entries())
    };
    const data = dataLoader && typeof dataLoader === "function" ? await dataLoader({ ctx }) : dataLoader;
    return {
      data,
      config: typeof pageConfig === "function" ? await pageConfig({
        ctx,
        data
      }) : pageConfig
    };
  };
};
var generateRoutes = (manifest, wrappers, parentId) => {
  return Object.values(manifest).filter((v) => v.parentId == parentId).map((v) => {
    return {
      id: v.id,
      path: v.path,
      pathname: v.pathname,
      parendId: v.parentId,
      layout: v.layout,
      HydrateFallback: () => createElement("div", null, "loading..."),
      async lazy() {
        const module = await v.component();
        return {
          loader: loader(module),
          Component: () => wrappers.reduce((acc, fn) => {
            return createElement(
              fn,
              {
                routeId: v.id,
                layout: v.layout,
                path: v.path,
                pathname: v.pathname,
                parentId: v.parentId
              },
              acc
            );
          }, createElement(module.default, null))
        };
      },
      children: generateRoutes(manifest, wrappers, v.id)
    };
  });
};
var createApp = ({
  manifest,
  app: appConfig,
  runtimes
}) => {
  const {
    root = "app",
    strict,
    router: mode,
    patchManifest,
    patchRoutes,
    appData,
    rootContainer
  } = appConfig ?? {};
  const providers = [];
  const wrappers = [];
  const addProvider = (fn) => {
    providers.push(fn);
  };
  const addWrapper = (fn) => {
    wrappers.push(fn);
  };
  runtimes?.forEach((runtime) => {
    runtime({
      appContext: {
        manifest,
        appConfig
      },
      addProvider,
      addWrapper
    });
  });
  let createRouter = createBrowserRouter;
  if (mode === "hash") {
    createRouter = createHashRouter;
  }
  if (mode === "memory") {
    createRouter = createMemoryRouter;
  }
  if (patchManifest && typeof patchManifest === "function") {
    manifest = patchManifest(manifest);
  }
  let routes = generateRoutes(manifest, wrappers);
  if (patchRoutes && typeof patchRoutes === "function") {
    routes = patchRoutes(routes);
  }
  const router = createRouter(routes, { basename: "/" });
  let app = createElement(RouterProvider, { router });
  app = providers.reduce((acc, fn) => {
    return createElement(fn, null, acc);
  }, app);
  app = createElement(
    AppContext.Provider,
    {
      value: {
        manifest,
        routes,
        appData
      }
    },
    app
  );
  if (rootContainer && typeof rootContainer === "function") {
    app = rootContainer(app);
  }
  if (strict) {
    app = createElement(StrictMode, null, app);
  }
  let rootEle = document.getElementById(root);
  if (!rootEle) {
    rootEle = document.createElement("div");
    rootEle.id = root;
    document.body.appendChild(rootEle);
  }
  createRoot(rootEle).render(app);
};
export {
  createApp,
  useAppContext,
  useConfig,
  useLoaderData
};

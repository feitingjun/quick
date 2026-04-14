# @quick/vite-plugin-file-router

一个基于 Vite 的 React 约定式文件路由插件。

它会扫描 `src` 下的页面和 layout 文件，生成 `virtual:file-router` 虚拟模块，并导出可直接使用的 `RouterProvider` 组件。

## 特性

- 支持 `src/pages` 作为页面根目录；如果不存在，则回退到 `src`
- 支持独立的 `src/layouts` 根 layout 目录
- 支持 `page.tsx` / `*.page.tsx` 页面约定
- 支持 `layout.tsx` / `*.layout.tsx` / `layout/index.tsx` 以及 `src/layouts/index.tsx` layout 约定
- 支持目录层级和 `.` 分段两种写法混用
- 支持 `[id] -> :id` 动态路由
- 支持 `404 -> *` 通配路由
- 支持路由文件导出 `metadata`
- 提供 `useMetadata()` 读取当前匹配路由的 metadata
- 提供 `wrappers` 和 `hydrateFallback` 统一增强路由渲染

## 安装

```bash
pnpm add @quick/vite-plugin-file-router react-router
```

## 接入

`vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fileRouter from '@quick/vite-plugin-file-router'

export default defineConfig({
  plugins: [fileRouter(), react()]
})
```

`tsconfig.json`

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": [
      "vite/client",
      "@quick/vite-plugin-file-router/client" // 为virtual:file-router虚拟模块提供类型声明
    ]
  }
}
```

`src/main.tsx`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RouterProvider from 'virtual:file-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider history='browser' />
  </StrictMode>
)
```

## 虚拟模块导出

`virtual:file-router` 导出：

- 默认导出：`RouterProvider`
- 命名导出：`RouterProvider`
- 命名导出：`useMetadata`

## 路由约定

### 根目录

- 如果存在 `src/pages`，页面根目录为 `src/pages`
- 否则页面根目录为 `src`
- `src/layouts` 始终作为独立的根 layout 目录参与解析
- 只有 `src/layouts/index.tsx` 会被解析为根 layout；如果该文件不存在，则没有这层根 layout

### 页面文件

以下文件会被解析为页面路由：

- `page.tsx`
- `*.page.tsx`

例如：

- `src/pages/page.tsx` -> `/`
- `src/pages/about.page.tsx` -> `/about`
- `src/pages/user/details.page.tsx` -> `/user/details`
- `src/pages/user.details.page.tsx` -> `/user/details`

### Layout 文件

以下文件会被解析为 layout：

- `layout.tsx`
- `*.layout.tsx`
- `layout/index.tsx`
- `src/layouts/index.tsx`

例如：

- `src/layouts/index.tsx` -> `/` 的 layout
- `src/layouts/user.layout.tsx` -> `/user` 的 layout
- `src/pages/dashboard/layout/index.tsx` -> `/dashboard` 的 layout

### 动态路由

`[]` 包裹的路径段会被转换成动态参数：

- `src/pages/users/[id].page.tsx` -> `/users/:id`
- `src/pages/users.[id].page.tsx` -> `/users/:id`

### 404 路由

路径段 `404` 会被转换成 `*`：

- `src/pages/404.page.tsx` -> `*`
- `src/pages/blog/404.page.tsx` -> `blog/*`

### index 片段

任一级精确等于 `index` 的路径段都会被忽略(用以将某一级 "/" 路由对应的文件收敛到index目录内)：

- `src/pages/user/index.page.tsx` -> `/user`
- `src/pages/user/index/page.tsx` -> `/user`

## 特殊约定

### layout 目录内的文件

位于任意 `layout` 目录及其子级目录中的以下文件，不会再被解析为页面或 layout：

- `page.tsx`
- `*.page.tsx`
- `layout.tsx`
- `*.layout.tsx`

只有目录式 layout 入口仍然保留：

- `.../layout/index.tsx`

### src/layouts

`src/layouts/index.tsx` 目录用于定义独立的根 layout 树，不会被当作普通页面目录扫描。

其中 `src/layouts/index.tsx` 会被解析为根 layout。

## metadata

页面或 layout 文件可以导出 `metadata`：

```tsx
export const metadata = {
  title: 'Users',
  auth: 'user.read'
}

export default function UsersPage() {
  return <div>Users</div>
}
```

然后通过 `useMetadata()` 获取当前匹配路由自己的 metadata：

```tsx
import { useMetadata } from 'virtual:file-router'

function Debug() {
  const metadata = useMetadata()
  return <pre>{JSON.stringify(metadata)}</pre>
}
```

返回值类型：

- 当前路由导出了 `metadata` 时，返回该对象
- 当前路由没有导出 `metadata` 时，返回 `undefined`

## RouterProvider

`RouterProvider` 是对 `react-router` `RouterProvider` 的封装。

除了 `router` 以外，它透传 `react-router` `RouterProvider` 自身接受的其他参数，并额外支持：

- `history: 'browser' | 'hash' | 'memory'`
- `wrappers: Array<(props) => ReactNode>`
- `hydrateFallback: React.ComponentType`

### history

用于决定内部创建哪种 router：

- `browser` -> `createBrowserRouter`
- `hash` -> `createHashRouter`
- `memory` -> `createMemoryRouter`

### wrappers

`wrappers` 会按数组顺序包裹每个页面或 layout 组件。

`wrappers[0]` 是最外层。

每个 wrapper 会收到：

- `pathname`: 当前路由路径
- `children`: 当前路由组件
- `isLayout`: 当前是否为 layout
- `metadata`: 当前路由自己的 metadata，不包含上级

示例：

```tsx
<RouterProvider
  wrappers={[
    ({ children, pathname, isLayout, metadata }) => (
      <React.Suspense fallback={<div>loading...</div>}>
        {children}
      </React.Suspense>
    )
  ]}
/>
```

### hydrateFallback

用于为首屏 hydration 阶段提供统一 fallback 组件。

```tsx
function RouteHydrateFallback() {
  return <div>loading...</div>
}

<RouterProvider hydrateFallback={RouteHydrateFallback} />
```

注意：

- `hydrateFallback` 是一个无参组件
- 它只用于 hydration fallback，不等同于每次路由 lazy 切换时的 loading

## 类型提示

如果已经在 `tsconfig.json` 中加入：

```json
{
  "compilerOptions": {
    "types": [
      "vite/client",
      "@quick/vite-plugin-file-router/client"
    ]
  }
}
```

那么可以直接获得：

- `RouterProvider`
- `useMetadata(): T | undefined`
- `wrappers` 的参数类型提示

## 注意事项

- 当前插件默认会把页面和 layout 都生成为 `lazy` 路由
- 路由结构变化时会刷新虚拟模块并触发整页 reload
- 普通文件内容修改不会重建 routes

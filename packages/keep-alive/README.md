# @quick/keep-alive

基于 React 19 `Activity` 和 `react-router` `Outlet` 的keep-alive。

## 依赖要求

- `react >= 19`
- `react-dom >= 19`
- `react-router >= 7`

包本身只导出 5 个能力：

- `ScopeProvider`
- `KeepAliveOutlet`
- `useAliveController`
- `useMountEffect`
- `useDepsEffect`

## 快速开始

先在需要共享缓存的路由树外层放一个 `ScopeProvider`：

```tsx
import { createRoot } from 'react-dom/client'
import { ScopeProvider } from '@quick/keep-alive'

createRoot(document.getElementById('root')!).render(
  <ScopeProvider>
    <App />
  </ScopeProvider>
)
```

然后在将`react-router`的`Outlet`出口换成 `KeepAliveOutlet`：

```tsx
import { KeepAliveOutlet } from '@quick/keep-alive'

export default function Layout() {
  return (
    <div>
      <nav>
        <Link to='/'>首页</Link>
        <Link to='/user'>用户</Link>
        <Link to='/about'>关于</Link>
      </nav>
      <main>
        <KeepAliveOutlet />
      </main>
    </div>
  )
}
```

现在页面会根据`react-router`的`pathname`作为`唯一标识`缓存页面

## 它是怎么工作的
劫持`react-router`的`Outlet`实例并缓存，然后将所有缓存的`Outlet`实例渲染为`Activity`列表，`Activity`列表内仅当前命中的实例`mode`设置为`visible`，其余`mode`设置为`hidden`

## API 说明

### `ScopeProvider`

```tsx
function ScopeProvider(props: { children: ReactNode }): JSX.Element
```

作用：

- 创建一份缓存仓库。
- 为当前子树开启 keep-alive 能力。
- 通常放在 Router 外层。
- 如果你只想让某一小段路由树具备缓存能力，可以只包那一段。
- 如果在`KeepAliveOutlet`内部使用`KeepAliveOutlet`，建议将内部`KeepAliveOutlet`使用`ScopeProvider`包裹

### `KeepAliveOutlet`

```tsx
function KeepAliveOutlet(props: {
  cacheId?: string
  cacheProps?: Record<string, any>
}): ReactNode
```

参数说明：

| 参数 | 说明 |
| --- | --- |
| `cacheId` | 可选，自定义缓存键；默认值是当前 `location.pathname` |
| `cacheProps` | 可选，挂在缓存节点上的附加信息，常用于标签名、菜单信息等 |

几个关键点：

- 不传 `cacheId` 时，默认按 `pathname` 缓存。
- 如果同一路径下需要按搜索参数、tab id、业务主键拆分缓存，必须传入自定义 `cacheId`。
- 如果当前树上没有 `ScopeProvider`，`KeepAliveOutlet` 会退化为普通 `Outlet` 渲染，不会报错。

自定义缓存键示例：

```tsx
import { useLocation } from 'react-router'
import { KeepAliveOutlet } from '@quick/keep-alive'

export default function Layout() {
  const { pathname, search } = useLocation()

  return <KeepAliveOutlet cacheId={`${pathname}${search}`} />
}
```

### `useAliveController`

```tsx
const { cachingNodes, destroy, destroyAll } = useAliveController()
```

返回值：

| 字段 | 说明 |
| --- | --- |
| `cachingNodes` | 当前缓存列表，每项包含 `cacheId`、`active`、`cacheProps` |
| `destroy(cacheId)` | 销毁指定缓存页，仅当页面处于未激活状态才能销毁 |
| `destroyAll()` | 销毁所有非激活缓存页 |

注意：

- 当前页无法直接被 `destroy` 删除；通常需要先切到别的页，再销毁它。
- `cacheProps` 用于给`cachingNodes`传递额外信息，比如使用`cachingNodes`渲染缓存列表时，传递页面名称。

### `useMountEffect`

```tsx
useMountEffect(() => {
  // 首次挂载执行
  return () => {
    // 缓存真正销毁时执行
  }
})
```

这个` hook` 的目的不是替代普通 `useEffect`，而是专门修正 `Activity` 下的生命周期语义。

在 React 19 `Activity` 场景里，页面在 `visible` `hidden` 状态间直接切换时，会触发`useEffect`，这个`hook`提供仅在页面`首次挂载`和`完全销毁时`触发的能力。

它的触发时机是：
- 首次创建缓存页时执行一次
- 缓存页在隐藏/重新显示时不会重复执行
- 只有缓存节点被真正移除时才执行清理函数

适合放：
- 长生命周期订阅
- 页面级初始化
- 只希望在最终销毁时断开的资源

### `useDepsEffect`

```tsx
useDepsEffect(() => {
  // 首次挂载执行
  // 依赖变化时再次执行
  return () => {
    // 依赖变化时清理，或缓存真正销毁时清理
  }
}, [id])
```

这个`hook`提供了页面`首次挂载`和`依赖变更`时触发的能力，它排除了`useEffect`在页面`显隐`状态变更时的触发

当 `deps = []` 时，它和`useMountEffect`的功能相同，但它更偏向“带依赖管理的 effect”。

## 生命周期对比

以“页面 A 已经缓存，然后切到页面 B，再切回 A”为例：

| 场景 | `useEffect` | `useMountEffect` | `useDepsEffect` |
| --- | --- | --- | --- |
| A 第一次进入 | 执行 | 执行 | 执行 |
| A 被隐藏 | 清理 | 不清理 | 不清理 |
| A 再次显示 | 执行 | 不执行 | 不执行 |
| A 依赖变更 | 执行 | - | 执行 |
| A 被彻底销毁 | 清理 | 清理 | 清理 |

这两个自定义 hook 的目标，就是把“缓存页的隐藏”和“组件的最终销毁”区分开。

## 适用边界与注意事项

### 1. `cacheId` 默认只看 `pathname`

默认逻辑是：

```ts
const currentId = cacheId ?? pathname
```

所以这些地址会命中同一份缓存：

- `/user?id=1`
- `/user?id=2`

如果你的业务需要把它们视为两个独立页面，请自己传 `cacheId`。

### 2. `cacheProps` 不是缓存键

下面这两次渲染，如果 `cacheId` 相同，仍然是同一个缓存页：

```tsx
<KeepAliveOutlet cacheId='/user' cacheProps={{ title: '用户 A' }} />
<KeepAliveOutlet cacheId='/user' cacheProps={{ title: '用户 B' }} />
```

`cacheProps` 更像标签页的展示信息，不负责分片缓存。

### 3. 当前激活页不能直接销毁

`destroy(cacheId)` 和 `destroyAll()` 只会删除非激活节点。

这是当前实现的有意约束，因为激活页此时仍在被 `KeepAliveOutlet` 渲染。常见做法是：

- 先导航到别的页
- 再调用 `destroy`

### 4. 自定义生命周期 hook 只应在缓存页内部使用

`useMountEffect` 和 `useDepsEffect` 的设计前提是：组件位于 `KeepAliveOutlet` 管理的缓存页面内部，并且能够拿到 `CacheNodeContext`。

不建议在这些位置使用：

- `ScopeProvider` 外部
- 普通非缓存组件

更准确地说：

- 页面/子组件如果最终是被 `KeepAliveOutlet` 缓存的，使用它们是合理的
- 普通组件依然优先使用 React 原生 `useEffect`

### 5. 缓存是用内存换切换体验

只要节点还在 `CacheStore` 里，它就不会真正释放。

这意味着：

- 访问过的页面越多，占用的内存越多
- 页面内部的本地状态也会一直保留
- 需要结合 `destroy` / `destroyAll` 做缓存治理

### 6. 滚动位置缓存
- `KeepAliveOutlet` 只会缓存其内部的滚动位置，外部的滚动位置不会缓存。
- 实际上`Activity`隐藏原理是`display=none`，`display=none`后页面高度不足自动重置外部滚动是浏览器默认行为。
- 通常将`KeepAliveOutlet`外部的区域设置为不可滚动。

## 一句话总结

`@quick/keep-alive` 不是简单地“把页面藏起来”，而是围绕 React 19 `Activity` 做了一层面向路由缓存的封装：

- `ScopeProvider` 负责定义缓存域
- `KeepAliveOutlet` 负责把当前路由注册进缓存
- `useAliveController` 负责管理缓存页
- `useMountEffect` / `useDepsEffect` 负责把“隐藏”和“真正销毁”区分开

如果你要做的是“带标签页管理的后台类应用”，这套实现已经具备比较完整的基础能力。

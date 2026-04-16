import { Button } from 'antd'
import { createContext, useState } from 'react'
import { Link } from 'react-router'
import { KeepAliveOutlet, useAliveController } from '@quick/keep-alive'
import { useMetadata } from 'virtual:file-router'

export const Test = createContext<number | null>(null)

export default function Layout() {
  const [count, setCount] = useState(0)
  const { cachingNodes, destroy, destroyAll } = useAliveController()
  const metadata = useMetadata()

  return (
    <div className='flex flex-col h-full'>
      <ul className='flex gap-1 mb-4 underline text-blue-500 '>
        <li>
          <Link to='/'>首页</Link>
        </li>
        <li>
          <Link to='/user'>用户</Link>
        </li>
        <li>
          <Link to='/about'>关于</Link>
        </li>
      </ul>
      <div className='flex items-center gap-2'>
        {Object.values(cachingNodes).map(node => (
          <div key={node.cacheId}>
            <span>{node.cacheProps?.['pagename']}</span>{' '}
            <span className='underline text-blue-500' onClick={() => destroy(node.cacheId)}>
              销毁
            </span>
          </div>
        ))}
        <button onClick={destroyAll}>全部销毁</button>
      </div>
      <div className='overflow-auto'>
        <Button onClick={() => setCount(count + 1)}>count: {count}</Button>
        <div>
          <Test.Provider value={count}>
            <KeepAliveOutlet cacheProps={metadata} />
          </Test.Provider>
        </div>
      </div>
    </div>
  )
}

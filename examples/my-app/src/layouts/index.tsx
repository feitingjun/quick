import { Button } from 'antd'
import { createContext, useState } from 'react'
import { Outlet, Link } from 'react-router'

export const Test = createContext<number | null>(null)

export default function Layout() {
  const [count, setCount] = useState(0)

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
      <div className='overflow-auto'>
        <Button onClick={() => setCount(count + 1)}>count: {count}</Button>
        <Test.Provider value={count}>
          <Outlet />
        </Test.Provider>
      </div>
    </div>
  )
}

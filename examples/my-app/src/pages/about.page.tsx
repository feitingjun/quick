import { Button } from 'antd'
import { useState } from 'react'

export default function About() {
  const [count, setCount] = useState(0)
  return (
    <div className='flex flex-col overflow-hidden h-full'>
      <Button type='primary' onClick={() => setCount(count + 1)}>
        关于页 {count}
      </Button>
      <div className='h-75 overflow-auto'>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i}>{i}</div>
        ))}
      </div>
      <div>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i}>关于页 {i}</div>
        ))}
      </div>
    </div>
  )
}

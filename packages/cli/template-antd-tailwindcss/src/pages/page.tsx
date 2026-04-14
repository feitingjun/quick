import { useState } from 'react'
import { Button } from 'antd'

export default function Index() {
  const [count, setCount] = useState(0)
  return (
    <Button className='bg-amber-400' type='primary' onClick={() => setCount(count + 1)}>
      点击 {count}
    </Button>
  )
}

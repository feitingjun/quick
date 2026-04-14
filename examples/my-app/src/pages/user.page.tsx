import { useState } from 'react'
import { Button } from 'antd'

export default function User() {
  const [count, setCount] = useState(0)
  return (
    <Button type='primary' onClick={() => setCount(count + 1)}>
      用户 {count}
    </Button>
  )
}

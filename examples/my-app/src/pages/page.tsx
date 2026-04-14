import { useState, useContext } from 'react'
import { Button } from 'antd'
import { Test } from '../layouts'

export default function Index() {
  const [count, setCount] = useState(0)
  const test = useContext(Test)
  console.log(test)
  return (
    <Button type='primary' onClick={() => setCount(count + 1)}>
      test: {test}
    </Button>
  )
}

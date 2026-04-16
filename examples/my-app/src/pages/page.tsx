import { useState, useContext } from 'react'
import { Button } from 'antd'
import { useMountEffect, useDepsEffect } from '@quick/keep-alive'
import { Test } from '../layouts'

export const metadata = {
  pagename: '首页'
}

export default function Index() {
  const [count, setCount] = useState(0)
  const test = useContext(Test)

  useDepsEffect(() => {
    debugger
    return () => {
      const b = test
      const a = count
      debugger
    }
  }, [])

  return (
    <Button type='primary' onClick={() => setCount(count + 1)}>
      count: {count}
    </Button>
  )
}

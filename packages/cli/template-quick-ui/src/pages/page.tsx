import { useState } from 'react'
import { Button, Page, defineColumns, Search, Input } from '@quick/ui'

const columns = defineColumns([
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age'
  },
  {
    title: '地址',
    dataIndex: 'address'
  },
  {
    title: '金额',
    dataIndex: 'amount',
    status: amount => {
      if (amount > 1000) return 'success'
      if (amount < 500) return 'waiting'
      return 'error'
    },
    thousand: true,
    render: value => value
  }
])

const dataSource = [
  {
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
    amount: 120
  },
  {
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
    amount: 1280
  }
]

export default function Index() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <Page
        rowKey='name'
        columns={columns}
        dataSource={dataSource}
        actions={[
          {
            title: '删除',
            display: 'table',
            onClick: e => {
              debugger
            }
          }
        ]}
      >
        <Search.Item name='name' label='姓名'>
          <Input />
        </Search.Item>
        <Search.Item name='name' label='姓名'>
          <Input />
        </Search.Item>
        <Search.Item name='name' label='姓名'>
          <Input />
        </Search.Item>
        <Search.Item name='name' label='姓名'>
          <Input />
        </Search.Item>
      </Page>
    </div>
  )
}

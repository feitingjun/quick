import {
  Button,
  Box,
  Input,
  InputNumber,
  Table,
  type ColumnProps,
  Search,
  Page,
  DatePicker,
  RangePicker
} from '@quick/ui'
import { useState } from 'react'
import dayjs from 'dayjs'

const data = [
  {
    name: 'John Brown',
    age: 1,
    address: 'New York No. 1 Lake Park'
  },
  {
    name: 'Jim Green',
    age: 2,
    address: 'London No. 1 Lake Park'
  }
]

const columns: ColumnProps<(typeof data)[number]>[] = [
  {
    title: 'name',
    dataIndex: 'name',
    status: 'success',
    width: 300,
    render: (text, record) => <span>{record.name}</span>
    // children: [
    //   {
    //     title: 'name',
    //     dataIndex: 'name'
    //   },
    //   {
    //     title: 'age',
    //     dataIndex: 'age'
    //   }
    // ]
  },
  {
    title: 'age',
    dataIndex: 'age',
    thousand: true,
    width: 300,
    precision: 2,
    // percent: true,
    tooltip: '123',
    dictCode: 'sys',
    total: true,
    totalField: 'age1',
    hidden: true
  }
]

const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time))

export default function Home() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <Page
        onSearch={async values => {
          await sleep(1000)
        }}
        rowKey={row => row.name}
        dataSource={data}
        columns={columns}
        summaryMap={{
          age1: 10000.32323
        }}
        bordered
        actions={[
          {
            title: '操作1',
            onClick: (e, record) => {
              console.log(e, record)
            }
          },
          {
            title: '操作2',
            onClick: (e, record) => {
              console.log(e, record)
            }
          }
        ]}
      >
        <Search.Item label='姓名' name='name'>
          <Input />
        </Search.Item>
        <Search.Item label='年龄' name='id'>
          <InputNumber />
        </Search.Item>
        <Search.Item label='日期' name='date'>
          <DatePicker />
        </Search.Item>
        <Search.Item label='时间' names={['beginTime', 'endTime']} span={2}>
          <RangePicker />
        </Search.Item>
      </Page>
    </div>
  )
}

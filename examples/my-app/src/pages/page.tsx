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
  RangePicker,
  request
} from '@quick/ui'
import { useState } from 'react'
import dayjs from 'dayjs'

const columns: ColumnProps<{ label: string; value: string }>[] = [
  {
    title: 'Label',
    dataIndex: 'label',
    status: 'success',
    width: 300,
    render: (text, record) => <span>{record.label}</span>
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
    title: 'Value',
    dataIndex: 'value',
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
  const onSearch = async (values: Record<string, any>) => {
    // await sleep(1000)
    return values
  }
  return (
    <div>
      <Page
        url='/'
        method='post'
        onSearch={onSearch}
        rowKey={row => row.label}
        columns={columns}
        summaryMap={{
          age1: 10000.32323
        }}
        bordered
        actions={[
          {
            title: '操作1',
            display: 'table',
            onClick: (e, record) => {
              console.log(e, record)
            }
          },
          {
            title: '操作2',
            type: 'primary',
            onClick: () => {}
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

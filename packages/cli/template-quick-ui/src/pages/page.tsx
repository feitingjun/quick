import { Page, Button, useAsyncState, defineColumns, Search, Input } from '@quick/ui'

const columns = defineColumns([
  {
    title: 'name',
    dataIndex: 'name'
  },
  {
    title: 'age',
    dataIndex: 'age'
  },
  {
    title: '金额',
    dataIndex: 'amount',
    thousand: true
  }
])

export default function Index() {
  return (
    <Page url='/api' columns={columns}>
      <Search.Item name='name' label='姓名'>
        <Input />
      </Search.Item>
      <div className='text-base'>111</div>
    </Page>
  )
}

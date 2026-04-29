import { Page, Button, defineColumns, Search, Input } from '@quick/ui'

const columns = defineColumns([
  {
    title: 'name',
    dataIndex: 'name'
  },
  {
    title: 'age',
    dataIndex: 'age',
    sorter: true
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
    </Page>
  )
}

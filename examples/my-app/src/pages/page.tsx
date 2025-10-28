import { Button, Box, Input, InputNumber, Table, defineColumns, ColumnProps } from '@quick/ui'

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
    totalField: 'age1'
  }
]

export default function Home() {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridAutoColumns: 200,
          gridAutoFlow: 'column'
        }}
      >
        <Button type='primary'>按钮</Button>
        <Input placeholder='请输入' />
        <InputNumber placeholder='请输入' w={1} />
      </Box>
      <Table
        rowKey={row => row.name}
        dataSource={data}
        columns={columns}
        rowSelection={{}}
        summaryMap={{
          age1: 10000.32323
        }}
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
      />
    </>
  )
}

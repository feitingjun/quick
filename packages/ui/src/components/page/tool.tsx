import { useMemo, useCallback } from 'react'
import type { ComponentCssStyles } from '@quick/cssinjs'
import { ColumnHeightOutlined, SettingOutlined } from '@ant-design/icons'
import type { ColumnProps, AnyObject } from '@/components/table'
import Box from '@/components/box'
import Space from '@/components/space'
import Tooltip from '@/components/tooltip'
import Dropdown from '@/components/dropdown'
import Popover from '@/components/popover'
import Checkbox, { type CheckboxChangeEvent } from '@/components/checkbox'

const CheckboxGroup = Checkbox.Group

const sizeItem = [
  { key: 'large', label: '宽松' },
  { key: 'middle', label: '中等' },
  { key: 'small', label: '紧凑' }
] satisfies { key: string; label: string }[]

type Size = 'large' | 'middle' | 'small'

interface ContentProps<RecordType extends AnyObject = AnyObject> {
  columns?: ColumnProps<RecordType>[]
  visibleKeys: string[]
  defaultVisibleKeys: string[]
  setVisibleKeys: (keys: string[]) => void
}

interface ToolProps<RecordType extends AnyObject = AnyObject>
  extends ContentProps<RecordType>,
    ComponentCssStyles {
  size?: Size
  setSize?: (size: Size) => void
}

const Content = <RecordType extends AnyObject>({
  columns,
  visibleKeys,
  defaultVisibleKeys,
  setVisibleKeys
}: ContentProps<RecordType>) => {
  const options = useMemo(() => {
    return columns?.map(col => col.title as string) ?? []
  }, [columns])
  // 全选
  const checkAll = useCallback(
    (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
        setVisibleKeys(options)
      } else {
        setVisibleKeys([])
      }
    },
    [options]
  )

  return (
    <Box>
      <Box
        sx={{
          pb: 2,
          mb: 2,
          minW: 120,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Checkbox
          onChange={checkAll}
          checked={visibleKeys.length === options.length}
          indeterminate={visibleKeys.length > 0 && visibleKeys.length < options.length}
        >
          全选
        </Checkbox>
        <Box
          as='span'
          color='primary'
          cursor='pointer'
          onClick={() => setVisibleKeys(defaultVisibleKeys)}
        >
          重置
        </Box>
      </Box>
      <CheckboxGroup
        options={options}
        value={visibleKeys}
        onChange={e => setVisibleKeys(e)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      />
    </Box>
  )
}

export default function Tool<RecordType extends AnyObject = AnyObject>({
  size = 'middle',
  visibleKeys,
  defaultVisibleKeys,
  setVisibleKeys,
  setSize,
  columns,
  ...props
}: ToolProps<RecordType>) {
  return (
    <Space size={size} {...props}>
      <Tooltip title='密度'>
        <Dropdown
          trigger={['click']}
          placement='bottomRight'
          menu={{
            items: sizeItem,
            selectedKeys: [size],
            onClick: ({ key }) => setSize?.(key as Size)
          }}
        >
          <ColumnHeightOutlined />
        </Dropdown>
      </Tooltip>
      <Tooltip title='展示列'>
        <Popover
          arrow={false}
          trigger='click'
          placement='bottomRight'
          content={
            <Content
              columns={columns}
              visibleKeys={visibleKeys}
              defaultVisibleKeys={defaultVisibleKeys}
              setVisibleKeys={setVisibleKeys}
            />
          }
        >
          <SettingOutlined />
        </Popover>
      </Tooltip>
    </Space>
  )
}

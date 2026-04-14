import { useMemo, useCallback } from 'react'
import type { CheckboxChangeEvent } from 'antd'
import { createStyles } from 'antd-style'
import { ColumnHeightOutlined, SettingOutlined } from '@ant-design/icons'
import type { ColumnProps, AnyObject } from '@/components/table'
import { Space, Tooltip, Dropdown, Popover, Checkbox } from '@/components'

const CheckboxGroup = Checkbox.Group

const sizeItem = [
  { key: 'large', label: '宽松' },
  { key: 'medium', label: '中等' },
  { key: 'small', label: '紧凑' }
] satisfies { key: string; label: string }[]

type Size = 'large' | 'medium' | 'small'

interface ContentProps<RecordType extends AnyObject = AnyObject> {
  columns?: ColumnProps<RecordType>[]
  hiddenKeys: string[]
  defaultHiddenKeys: string[]
  setHiddenKeys: (keys: string[]) => void
}

interface ToolProps<RecordType extends AnyObject = AnyObject> extends ContentProps<RecordType> {
  size?: Size
  setSize?: (size: Size) => void
}

const useStyles = createStyles(({ token }) => ({
  all: {
    paddingBottom: token.sizeUnit * 2,
    marginBottom: token.sizeUnit * 2,
    minWidth: 100,
    display: 'flex',
    justifyContent: 'space-between'
  },
  reset: {
    color: token.colorPrimary,
    cursor: 'pointer'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: token.sizeUnit
  }
}))

const Content = <RecordType extends AnyObject>({
  columns,
  hiddenKeys,
  defaultHiddenKeys,
  setHiddenKeys
}: ContentProps<RecordType>) => {
  const { styles } = useStyles()
  const options = useMemo(() => {
    return columns?.map(col => col.title as string) ?? []
  }, [columns])
  // 全选
  const checkAll = useCallback(
    (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
        setHiddenKeys([])
      } else {
        setHiddenKeys(options)
      }
    },
    [options]
  )

  return (
    <div>
      <div className={styles.all}>
        <Checkbox
          onChange={checkAll}
          checked={hiddenKeys.length === 0}
          indeterminate={hiddenKeys.length > 0 && hiddenKeys.length < options.length}
        >
          全选
        </Checkbox>
        <span className={styles.reset} onClick={() => setHiddenKeys(defaultHiddenKeys)}>
          重置
        </span>
      </div>
      <CheckboxGroup
        options={options}
        value={options.filter(option => !hiddenKeys.includes(option))}
        onChange={e => setHiddenKeys(options.filter(option => !e.includes(option)))}
        className={styles.checkboxGroup}
      />
    </div>
  )
}

export default function Tool<RecordType extends AnyObject = AnyObject>({
  size = 'medium',
  hiddenKeys,
  defaultHiddenKeys,
  setHiddenKeys,
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
              hiddenKeys={hiddenKeys}
              defaultHiddenKeys={defaultHiddenKeys}
              setHiddenKeys={setHiddenKeys}
            />
          }
        >
          <SettingOutlined />
        </Popover>
      </Tooltip>
    </Space>
  )
}

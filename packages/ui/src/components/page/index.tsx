import { useCallback, useState, useMemo } from 'react'
import type { ComponentCssStyles } from '@quick/cssinjs'
import Table, {
  type TableProps,
  type AnyObject,
  type Action as TableAction
} from '@/components/table'
import Search, { type SearchProps } from '@/components/search'
import Box from '@/components/box'
import useAsyncAction from '@/hooks/use-async-action'
import Tool from './tool'

export interface Action<RecordType extends AnyObject = AnyObject> extends TableAction<RecordType> {
  display?: 'table' | 'search' | undefined
}

export type PageProps<RecordType extends AnyObject = AnyObject> = ComponentCssStyles &
  TableProps<RecordType> &
  SearchProps & {
    actions?: Action<RecordType>[]
    showTool?: boolean
  }

export default function Page<RecordType extends AnyObject = AnyObject>({
  okText,
  resetText,
  initLoad,
  onSearch: onSearchPage,
  onReset: onResetPage,
  colWidth,
  children,
  initialValues,
  form,
  size: defaultSize,
  actions,
  showTool = true,
  columns,
  ...props
}: PageProps<RecordType>) {
  const defaultVisibleKeys = useMemo(() => {
    return columns?.filter(col => !col.hidden).map(col => col.title as string) ?? []
  }, [columns])
  const [size, setSize] = useState(defaultSize)
  const [visibleKeys, setVisibleKeys] = useState<string[]>(defaultVisibleKeys)

  const [onSearch, loading] = useAsyncAction<Record<string, any>>(async values => {
    await onSearchPage?.(values)
  })

  const onReset = useCallback(async () => {}, [onResetPage])

  const tableColumns = useMemo(() => {
    return columns
      ?.filter(col => visibleKeys.includes(col.title as string))
      ?.map(col => ({ ...col, hidden: false }))
  }, [columns, visibleKeys])

  return (
    <Box
      sx={{
        w: 1
      }}
    >
      {children && (
        <Search
          form={form}
          initLoad={initLoad}
          initialValues={initialValues}
          okText={okText}
          resetText={resetText}
          colWidth={colWidth}
          size={size}
          onSearch={onSearch}
          onReset={onReset}
        >
          {children}
        </Search>
      )}
      <Box bg='bg'>
        <Box px={4} py={2} fontSize='subtitle'>
          {showTool && (
            <Tool
              size={size}
              columns={columns}
              setSize={setSize}
              visibleKeys={visibleKeys}
              defaultVisibleKeys={defaultVisibleKeys}
              setVisibleKeys={setVisibleKeys}
            />
          )}
        </Box>
        <Table columns={tableColumns} loading={loading} size={size} {...props} />
      </Box>
    </Box>
  )
}

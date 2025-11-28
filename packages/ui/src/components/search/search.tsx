import { isDayjs } from 'dayjs'
import { useCallback, useEffect, useMemo } from 'react'
import { SearchOutlined, RedoOutlined } from '@ant-design/icons'
import Form, { type FormProps } from '@/components/form'
import Button from '@/components/button'
import Box from '@/components/box'
import useQuery from '@/hooks/use-query'
import useAsyncAction from '@/hooks/use-async-action'
import { useTheme } from '@/theme'

export interface SearchProps extends FormProps {
  okText?: React.ReactNode
  resetText?: React.ReactNode
  initLoad?: boolean
  onSearch?: (values: Record<string, any>) => void | Promise<void>
  onReset?: () => Promise<void> | void
  colWidth?: number
}

export default function Search({
  children,
  okText = '查询',
  resetText = '重置',
  initLoad,
  onSearch,
  onReset,
  colWidth = 280,
  size = 'middle',
  form: externalForm,
  initialValues,
  ...props
}: SearchProps) {
  if (
    Object.values(initialValues ?? {}).some(item =>
      Array.isArray(item) ? item.some(i => isDayjs(i)) : isDayjs(item)
    )
  ) {
    throw new Error('Search 不接收 dayjs 类型的初始值，请使用字符串格式化日期')
  }
  const [form] = Form.useForm(externalForm)
  // 获取url参数
  const query = useQuery()
  const theme = useTheme()
  // 控件高度
  const height = useMemo(() => {
    if (size === 'small') {
      return theme.sizes.controlHeightSm
    }
    if (size === 'large') {
      return theme.sizes.controlHeightLg
    }
    return theme.sizes.controlHeight
  }, [theme, size])

  const [onFinish, loading] = useAsyncAction<Record<string, any>>(async values => {
    if (typeof onSearch === 'function') {
      onSearch(values)
    }
  })

  const onClear = useCallback(async () => {
    form.resetFields()
    if (typeof onReset === 'function') {
      await onReset()
    }
    form.submit()
  }, [form, onReset])

  useEffect(() => {
    form.setFieldsValue(query)
    if (initLoad) {
      form.submit()
    }
  }, [query, form, initLoad])

  const btns = useMemo(() => {
    return (
      <Box
        sx={{
          position: 'absolute',
          right: 4 * theme.space,
          bottom: 4 * theme.space,
          w: colWidth / 2,
          display: 'flex',
          justifyContent: 'space-between',
          '.ant-btn': {
            px: 2.5,
            gap: 1
          }
        }}
      >
        <Button mr={2} onClick={onClear} icon={<RedoOutlined />}>
          {resetText}
        </Button>
        <Button type='primary' htmlType='submit' loading={loading} icon={<SearchOutlined />}>
          {okText}
        </Button>
      </Box>
    )
  }, [loading, onClear, okText, resetText, theme, colWidth])

  return (
    <Form
      layout='inline'
      size={size}
      form={form}
      onFinish={onFinish}
      initialValues={initialValues}
      preserve
      sx={{
        bg: 'bg',
        mb: 2,
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${colWidth / 2}px, 1fr))`,
        p: 4,
        gap: 2.5,
        position: 'relative',
        _after: {
          content: '""',
          height,
          gridColumn: 'span 1'
        },
        '& > *': {
          gridColumn: 'span 2',
          mr: 0
        },
        '.ant-row': {
          flexWrap: 'nowrap'
        },
        '.ant-input-number, .ant-input-select, .ant-picker': {
          w: 1
        }
      }}
      {...props}
    >
      {typeof children === 'function' ? (
        (values, form) => {
          return (
            <>
              {children(values, form)}
              {btns}
            </>
          )
        }
      ) : (
        <>
          {children}
          {btns}
        </>
      )}
    </Form>
  )
}

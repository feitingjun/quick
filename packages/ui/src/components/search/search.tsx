import { isDayjs } from 'dayjs'
import { useCallback, useEffect, useMemo } from 'react'
import { createStyles } from 'antd-style'
import { SearchOutlined, RedoOutlined } from '@ant-design/icons'
import { Form, type FormProps, Button } from '@/components'
import useQuery from '@/hooks/use-query'
import { useAsync } from '@/hooks'

export interface SearchProps extends FormProps {
  okText?: React.ReactNode
  resetText?: React.ReactNode
  initLoad?: boolean
  onSearch?: (values: Record<string, any>) => void | Promise<void>
  onReset?: () => Promise<void> | void
  colWidth?: number
  loading?: boolean
}

const useStyles = createStyles(
  ({ token }, { colWidth, size }: { colWidth: number; size: SearchProps['size'] }) => {
    let controlHeight = token.controlHeight
    if (size === 'small') controlHeight = token.controlHeightSM
    if (size === 'large') controlHeight = token.controlHeightLG
    return {
      btns: {
        position: 'absolute',
        right: token.sizeUnit * 4,
        bottom: token.sizeUnit * 4,
        display: 'flex',
        justifyContent: 'space-between',
        '& .ant-btn': {
          paddingInline: token.sizeUnit * 2,
          gap: token.sizeUnit,
          '&:first-of-type': {
            marginRight: token.sizeUnit * 2
          }
        }
      },
      form: {
        backgroundColor: token.colorBgContainer,
        marginBottom: token.sizeUnit * 2,
        padding: token.sizeUnit * 4,
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${colWidth}px, 1fr))`,
        gap: token.sizeUnit * 2.5,
        position: 'relative',
        '&:after': {
          width: colWidth,
          content: '""',
          height: controlHeight
        },
        '&>*': {
          marginRight: 0
        },
        '& .ant-row': {
          flexWrap: 'nowrap'
        },
        '& .ant-form-item-label': {
          flexShrink: 0
        },
        '& .ant-input-number, & .ant-input-select, & .ant-picker': {
          width: '100%'
        }
      }
    }
  }
)

export default function Search({
  children,
  okText = '查询',
  resetText = '重置',
  initLoad,
  onSearch,
  onReset,
  colWidth = 240,
  size = 'middle',
  form: externalForm,
  initialValues,
  loading: propLoading,
  ...props
}: SearchProps) {
  if (
    Object.values(initialValues ?? {}).some(item =>
      Array.isArray(item) ? item.some(i => isDayjs(i)) : isDayjs(item)
    )
  ) {
    throw new Error('Search 不接收 dayjs 类型的初始值，请使用字符串格式化日期')
  }
  const { styles } = useStyles({ colWidth, size })
  const [form] = Form.useForm(externalForm)
  // 获取url参数
  const query = useQuery()

  const [onFinish, loading] = useAsync(async (values: Record<string, any>) => {
    if (typeof onSearch === 'function') {
      await onSearch(values)
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
      <div className={styles.btns}>
        <Button onClick={onClear} icon={<RedoOutlined />}>
          {resetText}
        </Button>
        <Button
          type='primary'
          htmlType='submit'
          loading={typeof propLoading !== 'undefined' ? propLoading : loading}
          icon={<SearchOutlined />}
        >
          {okText}
        </Button>
      </div>
    )
  }, [propLoading, loading, onClear, okText, resetText, colWidth])

  return (
    <Form
      layout='inline'
      size={size}
      form={form}
      onFinish={onFinish}
      initialValues={initialValues}
      preserve
      className={styles.form}
      {...props}
    >
      <>
        {children}
        {btns}
      </>
    </Form>
  )
}

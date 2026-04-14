import { useMemo } from 'react'
import { DatePicker } from 'antd'
import { createStyles } from 'antd-style'
import type { RangePickerProps } from 'antd/es/date-picker'
import dayjs, { Dayjs } from 'dayjs'

const { RangePicker: AntdRangePicker } = DatePicker

type Preset = {
  label: React.ReactNode
  value: [Dayjs | null, Dayjs | null]
}

const usePresets = (
  showTime?: RangePickerProps['showTime'],
  allowEmpty?: RangePickerProps['allowEmpty']
): Preset[] => {
  const presets = useMemo(() => {
    const arr: Preset[] = showTime
      ? [
          { label: '今日', value: [dayjs().startOf('day'), dayjs().add(1, 'day').startOf('day')] },
          {
            label: '昨日',
            value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().startOf('day')]
          },
          {
            label: '本周',
            value: [dayjs().startOf('week'), dayjs().add(1, 'week').startOf('week')]
          },
          {
            label: '上周',
            value: [dayjs().subtract(1, 'week').startOf('week'), dayjs().startOf('week')]
          },
          {
            label: '本月',
            value: [dayjs().startOf('month'), dayjs().add(1, 'month').startOf('month')]
          },
          {
            label: '上月',
            value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().startOf('month')]
          },
          {
            label: '近45天',
            value: [dayjs().subtract(45, 'day'), dayjs().add(1, 'day').startOf('day')]
          },
          {
            label: '今年',
            value: [dayjs().startOf('year'), dayjs().add(1, 'year').startOf('year')]
          },
          {
            label: '近5年',
            value: [dayjs().subtract(5, 'year'), dayjs().add(1, 'year').startOf('year')]
          }
        ]
      : [
          { label: '今日', value: [dayjs(), dayjs()] },
          { label: '昨日', value: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')] },
          { label: '本周', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
          {
            label: '上周',
            value: [
              dayjs().subtract(1, 'week').startOf('week'),
              dayjs().subtract(1, 'week').endOf('week')
            ]
          },
          { label: '本月', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
          {
            label: '上月',
            value: [
              dayjs().subtract(1, 'month').startOf('month'),
              dayjs().subtract(1, 'month').endOf('month')
            ]
          },
          { label: '近45天', value: [dayjs().subtract(45, 'day'), dayjs()] },
          { label: '今年', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
          { label: '近5年', value: [dayjs().subtract(5, 'year'), dayjs()] }
        ]
    if (allowEmpty === true || (Array.isArray(allowEmpty) && allowEmpty[0])) {
      arr.push({
        label: '截止昨日',
        value: [null, showTime ? dayjs().startOf('day') : dayjs().subtract(1, 'day')]
      })
    }
    return arr
  }, [showTime, allowEmpty])

  return presets as Preset[]
}

const useStyles = createStyles({
  container: {
    [`& .ant-picker-presets`]: {
      minHeight: '330px'
    }
  }
})

export default function RangePicker({
  showTime,
  allowEmpty = [true, true],
  ...props
}: RangePickerProps) {
  const presets = usePresets(showTime, allowEmpty)
  const { styles } = useStyles()
  return (
    <AntdRangePicker
      presets={presets}
      showTime={showTime}
      allowEmpty={allowEmpty}
      classNames={{
        popup: {
          container: styles.container
        }
      }}
      {...props}
    />
  )
}

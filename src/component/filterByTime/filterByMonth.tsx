import type { DatePickerProps } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import { toTimestampMilliseconds } from '../../utils/convertTimestamp'
import { DatePickerLocale } from '../datePicker'

interface FilterByMonthProps {
  onChangeTime: (from: number, to: number) => void
}

const FilterByMonth: React.FC<FilterByMonthProps> = ({ onChangeTime }) => {
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    let d = date
    if (d) {
      let firstDayOfMonth = dayjs()
        .year(d.year())
        .month(d.month())
        .date(1)
        .startOf('day')
      let lastDayOfMonth = dayjs()
        .year(d.year())
        .month(d.month())
        .endOf('month')
        .endOf('day')

      let timestampStart = toTimestampMilliseconds(firstDayOfMonth.toString())
      let timestampEnd = toTimestampMilliseconds(lastDayOfMonth.toString())

      onChangeTime(timestampStart, timestampEnd)
    }
  }

  return (
    <DatePickerLocale
      defaultValue={dayjs()}
      onChange={onChange}
      picker='month'
      className='filter-month-activity'
      format='MM/YYYY'
      allowClear={false}
    />
  )
}

export { FilterByMonth }

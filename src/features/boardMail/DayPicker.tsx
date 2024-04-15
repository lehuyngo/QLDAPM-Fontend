import { useMutation } from '@tanstack/react-query'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { useEffect } from 'react'
import { usePostMailTimeRange } from '../../api/reactQuery/BoardMail'
import { TimeRange } from './types'
import styled from 'styled-components'

dayjs.extend(isSameOrBefore)

const { RangePicker } = DatePicker

const MailDayPicker = ({
  changeDate,
  setLoading
}: {
  changeDate: any
  setLoading: (loading: boolean) => void
}) => {
  const { mutate: mutateUpdateNote } = useMutation({
    mutationFn: usePostMailTimeRange
  })

  useEffect(() => {
    // Run mutation with default date when component first loads

    const defaultTimeRanges: [string, string] = [
      dayjs().subtract(6, 'day').startOf('day').format('YYYY-MM-DD'),
      dayjs().endOf('day').format('YYYY-MM-DD')
    ]
    const timeRanges = convertDateArrayToTimeRanges(defaultTimeRanges)

    const dataSend = { time_ranges: timeRanges }
    setLoading(true)
    mutateUpdateNote(dataSend, {
      onSuccess(data) {
        setLoading(false)

        changeDate(data.data)
      },
      onError() {
        setLoading(false)
      }
    })
  }, [])

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    const timeRanges = convertDateArrayToTimeRanges(dateStrings)
    const dataSend = { time_ranges: timeRanges }
    setLoading(true)

    if (timeRanges.length > 0) {
      mutateUpdateNote(dataSend, {
        onSuccess(data) {
          setLoading(false)

          changeDate(data.data)
        },

        onError() {
          setLoading(false)
        }
      })
    } else {
      changeDate([])
      setLoading(false)
    }
  }

  function convertDateArrayToTimeRanges(
    dateStrings: [string, string] | null
  ): TimeRange[] {
    if (!dateStrings) {
      return []
    }

    const [startDay, endDay] = dateStrings
    let currentDay = dayjs(startDay)
    const timeRanges: TimeRange[] = []

    while (currentDay.isSameOrBefore(dayjs(endDay), 'day')) {
      const startOfDay = currentDay.startOf('day')
      const endOfDay = currentDay.endOf('day')

      timeRanges.push({
        start_time: startOfDay.valueOf(),
        end_time: endOfDay.valueOf()
      })

      currentDay = currentDay.add(1, 'day')
    }

    return timeRanges
  }

  const disabledEndDate = (current: any) => {
    return current && current > dayjs().endOf('day')
  }

  return (
    <MailDayPickerWrapper
      onChange={handleDateChange}
      disabledDate={disabledEndDate}
      defaultValue={[dayjs().subtract(6, 'day'), dayjs()]}
    />
  )
}

export default MailDayPicker

const MailDayPickerWrapper = styled(RangePicker)`
  height: 40px;
  &.ant-picker .ant-picker-suffix {
    color: black !important;
  }
  &.ant-picker .ant-picker-clear {
    color: black !important;
  }
`

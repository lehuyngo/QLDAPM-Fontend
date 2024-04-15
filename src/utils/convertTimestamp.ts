import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/ja'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { COOKIES_ITEM } from '../constants/common'
import { getCookieItem } from './handleCookie'

dayjs.extend(utc)
dayjs.extend(timezone)

let cookiesTimezone = getCookieItem(COOKIES_ITEM.TIMEZONE)

export const timezoneOffset = parseInt(
  getCookieItem(COOKIES_ITEM.TIMEZONE) || '0',
  10
)

export const toTimestamp = (dateString: string | Dayjs): number => {
  return dayjs(dateString).utcOffset(timezoneOffset).unix()
}

export const toTimestampFromDateAndMinute = (
  meeting_date: Dayjs,
  meeting_time: Dayjs
): number => {
  let value = dayjs()
    .utcOffset(timezoneOffset)
    .year(meeting_date.year())
    .month(meeting_date.month())
    .date(meeting_date.date())
    .hour(meeting_time.hour())
    .minute(meeting_time.minute())
    .second(0)
    .millisecond(0)
  return value.unix()
}

export const toTimestampMilliseconds = (dateString: string): number => {
  return dayjs(dateString).utcOffset(timezoneOffset).valueOf()
}

//convert with format
export const timestampToDate = (timestamp: number): string => {
  const convertFormat = dayjs.unix(timestamp)
  return dayjs(convertFormat)
    .utcOffset(timezoneOffset)
    .format(cookiesTimezone === '7' ? 'DD/MM/YYYY' : 'YYYY/MM/DD')
}

export const timestampToDateTime = (timestamp: number): string => {
  if (timestamp?.toString()?.length === 10) {
    timestamp = timestamp * 1000
  }
  const convertFormat = dayjs(timestamp).valueOf()

  return cookiesTimezone === '7'
    ? dayjs(convertFormat)
        .utcOffset(timezoneOffset)
        .locale('en')
        .format('DD/MM/YYYY h:mm A')
    : dayjs(convertFormat)
        .utcOffset(timezoneOffset)
        .locale('ja')
        .format('YYYY/MM/DD h:mm A')
}

//convert without format, use for set value datepicker
export const convertTimestamp = (timestamp: string | number) => {
  const convertFormat = dayjs.unix(+timestamp)
  return dayjs(convertFormat).utcOffset(timezoneOffset)
}

//time to now
export const calculateTimeDifference = (givenTimestamp: string | number) => {
  // Get current timestamp
  const currentTimestamp = new Date().getTime()
  // Calculate the difference in milliseconds
  const timeDifference = currentTimestamp - +givenTimestamp

  const seconds = Math.floor(timeDifference / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) {
    return `${years} years ago`
  } else if (months > 0) {
    return `${months} months ago`
  } else if (days > 0) {
    return `${days} days ago`
  } else if (hours > 0) {
    return `${hours} hours ago`
  } else if (minutes > 0) {
    return `${minutes} minutes ago`
  } else {
    return `Just now`
  }
}

export const timestampToObjectDate = (timestamp: number): any => {
  if (timestamp?.toString()?.length === 10) {
    timestamp = timestamp * 1000
  }
  const convertFormat = dayjs(timestamp).valueOf()

  return cookiesTimezone === '7'
    ? dayjs(convertFormat).utcOffset(timezoneOffset).locale('en')
    : dayjs(convertFormat).utcOffset(timezoneOffset).locale('ja')
}

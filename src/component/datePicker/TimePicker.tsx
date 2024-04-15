import { TimePicker } from 'antd'
import enUS from 'antd/es/date-picker/locale/en_US'
import jaJP from 'antd/es/date-picker/locale/ja_JP'
import styled from 'styled-components'
import { COOKIES_ITEM } from '../../constants/common'
import { getCookieItem } from '../../utils/handleCookie'

const getLocaleByTimezone = () => {
  let timezone = getCookieItem(COOKIES_ITEM.TIMEZONE)

  let locale

  switch (timezone) {
    case '7':
      locale = enUS
      break
    case '9':
      locale = jaJP
      break
    default:
      locale = enUS
  }

  return locale
}

export const TimePickerLocale = ({ ...otherProps }) => {
  const locale = getLocaleByTimezone()

  return <StyledTimePicker locale={locale} {...otherProps} />
}

const StyledTimePicker = styled(TimePicker)`
  width: 100%;
  height: 44px;
  background-color: #f5f5f5 !important;
  border: none;

  &.ant-picker-focused {
    box-shadow: 0 0 0 2px inset rgba(252, 118, 52, 0.3) !important;
  }
  &.ant-picker .ant-picker-suffix {
    color: black !important;
  }
  &.ant-picker .ant-picker-clear {
    color: black !important;
  }
  &.ant-picker .ant-picker-input input {
    font-size: 14px !important;
  }
`

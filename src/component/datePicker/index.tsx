import { DatePicker } from 'antd'
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

export const DatePickerLocale = ({ ...otherProps }) => {
  const locale = getLocaleByTimezone()

  return (
    <DatePickerWrapper
      locale={locale}
      format={locale === enUS ? 'DD/MM/YYYY' : undefined}
      {...otherProps}
    />
  )
}

const DatePickerWrapper = styled(DatePicker)`
  &.filter-month-activity {
    background-color: #fcfcfc !important;
  }
  height: 44px;
  width: 100%;
  background-color: #f5f5f5 !important;
  border: none;

  &.ant-picker-focused {
    box-shadow: 0 0 0 2px inset #fc76344c !important;
  }

  &.ant-picker .ant-picker-input input {
    font-size: 14px !important;
  }

  &.filter-month-activity {
    width: 106px;
    height: 32px;
  }

  &.ant-picker .ant-picker-suffix {
    color: #000 !important;
  }
  &.ant-picker .ant-picker-clear {
    color: #000 !important;
  }
`

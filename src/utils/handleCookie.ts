import dayjs from 'dayjs'
import { COOKIES_ITEM, LOCAL_STORAGE_ITEM } from '../constants/common'
const SHARE_DOMAIN = process.env.REACT_APP_DOMAIN

export const getCookieItem = (name: string) => {
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1)
    }
  }
  return null
}

const setCookie = (
  name: string,
  value: string | number,
  expiresInDays = 30
) => {
  const expires = dayjs().add(expiresInDays, 'day').toDate()
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; domain=${SHARE_DOMAIN}; path=/;`
}

export const setCookieTimezone = (timezone: number) =>
  setCookie(COOKIES_ITEM.TIMEZONE, timezone, 30)

export const setCookieToken = (token: string) => {
  setCookie(COOKIES_ITEM.TOKEN, token)
}

export const getToken = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_ITEM.TOKEN)
  if (!token) {
    return getCookieItem(COOKIES_ITEM.TOKEN)
  }
  return token
}

export const checkTokenAndRedirect = () => {
  const LOGIN_PAGE = process.env.REACT_APP_LOGIN_PAGE
  const token = getToken()

  if (token) {
    localStorage.setItem(LOCAL_STORAGE_ITEM.TOKEN, token)
  } else {
    window.location.replace(LOGIN_PAGE + '/login')
  }

  return token
}

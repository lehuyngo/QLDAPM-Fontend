import { useNavigate } from 'react-router-dom'
import {
  COOKIES_ITEM,
  LOCAL_STORAGE_ITEM,
  PATH,
  SESSION_STORAGE_ITEM
} from '../constants/common'

const useLogout = () => {
  const navigate = useNavigate()
  const SHARE_DOMAIN = process.env.REACT_APP_DOMAIN

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_ITEM.TOKEN)
    sessionStorage.removeItem(SESSION_STORAGE_ITEM.MODE_VIEW_TASK)
    sessionStorage.removeItem(SESSION_STORAGE_ITEM.CONTACT_DETAIL_TAG)
    sessionStorage.removeItem(SESSION_STORAGE_ITEM.CLIENT_DETAIL_TAG)
    document.cookie = `${COOKIES_ITEM.TOKEN}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${SHARE_DOMAIN}; path=/`
    navigate(PATH.LOGIN)
  }

  return { logout }
}

export default useLogout

import { useQuery } from '@tanstack/react-query'
import { NotificationCustom } from '../../component/notification/Notification'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'
import useLogout from '../../hooks/useLogout'

export const fetchDataGetMe = async () => {
  try {
    const response = await api.get(`${BASE_URL}/me`)
    return response.data
  } catch (error: any) {
    console.log('error', error)
    if (error.response.status === 401) {
      NotificationCustom({
        type: 'error',
        message: 'Sorry, something went wrong. Please log in again.'
      })
    }
  }
}

export const useGetMe = () => {
  const { logout } = useLogout()

  const fetchData = async () => {
    try {
      const response = await api.get(`${BASE_URL}/me`)
      return response.data
    } catch (error: any) {
      console.log('error', error)
      if (error.response.status === 401) {
        NotificationCustom({
          type: 'error',
          message: 'Sorry, something went wrong. Please log in again.'
        })
        logout()
      }
    }
  }
  return useQuery({
    queryKey: ['UserMe'],
    queryFn: () => fetchData(),
    staleTime: 2 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  })
}

export const useGetUserList = () => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/users`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetUserList'],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  })
}

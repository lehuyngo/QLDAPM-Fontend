import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

interface DataSetPoint {
  name: string
  point: number
}

export const useCreatePointActivity = async (data: DataSetPoint) => {
  try {
    const response = await api.post(`${BASE_URL}/point-configs`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetPointActivity = () => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/point-configs`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetPointActivity'],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  })
}

export const useUpdatePointActivity = async (
  data: DataSetPoint,
  uuid: string
) => {
  try {
    const response = await api.put(`${BASE_URL}/point-configs/${uuid}`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useDeletePointActivity = async (uuid: string) => {
  try {
    const response = await api.delete(`${BASE_URL}/point-configs/${uuid}`)
    return response.data
  } catch (error) {
    throw error
  }
}
// {"start_date": 1675353600,"end_date": 1707876576}

export const useGetPointReport = async (data: any) => {
  try {
    const response = await api.post(`/point-reports`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

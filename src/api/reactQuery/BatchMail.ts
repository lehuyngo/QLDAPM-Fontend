import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'

const useGetBatchMailList = (isOk: boolean) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/batch-mails`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  return useQuery({
    queryKey: ['GetBatchMailList'],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: isOk ? 0 : 3 * 1000,
    retry: 2
  })
}

const useGetBatchMailDetail = (
  uuid: string | null,
  isOk: boolean,
  isCall?: boolean
) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/batch-mails/${uuid}`)
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  return useQuery({
    queryKey: ['GetBatchMailDetail', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: isOk ? 0 : 3 * 1000,
    retry: 2,
    enabled: !!uuid && isCall
  })
}

export { useGetBatchMailList, useGetBatchMailDetail }

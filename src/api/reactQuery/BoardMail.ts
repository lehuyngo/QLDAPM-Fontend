import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

type TimeRange = {
  start_time: number
  end_time: number
}

type TimeRangesData = {
  time_ranges: TimeRange[]
}

export const usePostMailTimeRange = async (timeRanges: TimeRangesData) => {
  try {
    const response = await api.post(
      `${BASE_URL}/reports/read-mail-timeline`,
      timeRanges
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetMailDetail = ({
  mailId,
  isCall = true
}: {
  mailId: string | null
  isCall: boolean
}) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/mails/${mailId}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetMailDetail', mailId],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!mailId && isCall
  })
}

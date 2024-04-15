import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

export const useCreateMeeting = async (data: {
  projectID: string
  bodyRequest: any
}) => {
  const { projectID, bodyRequest } = data
  try {
    const response = await api.post(
      `${BASE_URL}/projects/${projectID}/meetings`,
      bodyRequest
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetMeetingList = (projectID: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(
        `${BASE_URL}/projects/${projectID}/meetings`
      )
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetMeetingList', projectID],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!projectID
  })
}

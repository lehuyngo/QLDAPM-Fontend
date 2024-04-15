import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

export const useBatchCreateHighlight = async (data: {
  meetingNoteID: string
  bodyRequest: any
}) => {
  const { meetingNoteID, bodyRequest } = data
  try {
    const response = await api.post(
      `${BASE_URL}/meeting-notes/${meetingNoteID}/highlights`,
      bodyRequest
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetHighlightList = (projectID: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(
        `${BASE_URL}/projects/${projectID}/highlights`
      )
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetHighlightList', projectID],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!projectID
  })
}

export const useDeleteHighlight = async (data: {
  meetingNoteID: string
  highLightID: string
}) => {
  const { meetingNoteID, highLightID } = data
  try {
    const response = await api.delete(
      `${BASE_URL}/meeting-notes/${meetingNoteID}/highlights/${highLightID}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useBatchDeleteHighlight = async (data: {
  meetingNoteID: string
  bodyRequest: any
}) => {
  const { meetingNoteID, bodyRequest } = data
  try {
    const response = await api.delete(
      `${BASE_URL}/meeting-notes/${meetingNoteID}/batch-highlights`,
      {
        data: bodyRequest
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

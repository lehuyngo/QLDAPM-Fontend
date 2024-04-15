import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

export const useCreateMeetingNote = async (data: {
  projectID: string
  meetingDateID: string
  bodyRequest: any
}) => {
  const { projectID, meetingDateID, bodyRequest } = data
  try {
    const response = await api.post(
      `${BASE_URL}/projects/${projectID}/meetings/${meetingDateID}/meeting-notes`,
      bodyRequest
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useUpdateMeetingNote = async (data: {
  projectID: string
  meetingNoteID: string
  bodyRequest: any
}) => {
  const { projectID, meetingNoteID, bodyRequest } = data

  try {
    const response = await api.put(
      `${BASE_URL}/projects/${projectID}/meeting-notes/${meetingNoteID}`,
      bodyRequest
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useDeleteMeetingNote = async (data: {
  projectID: string
  meetingNoteID: string
}) => {
  const { projectID, meetingNoteID } = data
  try {
    const response = await api.delete(
      `${BASE_URL}/projects/${projectID}/meeting-notes/${meetingNoteID}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetMeetingNoteList = (projectID: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(
        `${BASE_URL}/projects/${projectID}/meeting-notes`
      )
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetMeetingNoteList', projectID],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!projectID
  })
}

export const useBatchCreateContributors = async (data: {
  meetingNoteID: string
  bodyRequest: any
}) => {
  const { meetingNoteID, bodyRequest } = data
  try {
    const response = await api.post(
      `${BASE_URL}/meeting-notes/${meetingNoteID}/batch-contributors`,
      bodyRequest
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useBatchDeleteContributors = async (data: {
  meetingNoteID: string
  bodyRequest: any
}) => {
  const { meetingNoteID, bodyRequest } = data
  try {
    const response = await api.delete(
      `${BASE_URL}/meeting-notes/${meetingNoteID}/batch-contributors`,
      { data: bodyRequest }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

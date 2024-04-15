import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

export const useCreateActivity = async ({
  data,
  contactId
}: {
  data: any
  contactId: string | null
}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/contacts/${contactId}/contact-interact-activities`,
      data
    )
    return response.data
  } catch (error) {
    throw error
  }
}

// export const useCreateActivityThread = async ({
//   data,
//   contactId
// }: {
//   data: any
//   contactId: string | null
// }) => {
//   try {
//     const response = await api.post(
//       `${BASE_URL}/contacts/${contactId}/contact-interact-activities`,
//       data
//     )
//     return response.data
//   } catch (error) {
//     throw error
//   }
// }

export const useGetThreadActivity = ({
  contactId
}: {
  contactId: string | null
}) => {
  const fetchData = async () => {
    try {
      const response = await api.get(
        `/contacts/${contactId}/contact-interact-activities`
      )
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetThreadActivity', contactId],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!contactId
  })
}

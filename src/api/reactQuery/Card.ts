import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

// export const useAcceptClient = async (formData: FormData) => {
//   try {
//     const response = await api.post(`${BASE_URL}/draft-contacts`, formData)
//     return response.data
//   } catch (error) {
//     throw error
//   }
// }

export const useGetCardList = () => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/draft-contacts`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  return useQuery({
    queryKey: ['GetCardList'],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
    // enabled: !!uuid
  })
}

export const useGetCardDetail = ({ uuid }: { uuid: string | null }) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/draft-contacts/${uuid}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  return useQuery({
    queryKey: ['GetCardDetail', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useAcceptCard = async ({
  formData,
  cardId
}: {
  formData: FormData
  cardId: string | null
}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/converted-draft-contacts/${cardId}`,
      formData
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useDeleteCard = async (cardId: string | null) => {
  try {
    const response = await api.delete(`${BASE_URL}/draft-contacts/${cardId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

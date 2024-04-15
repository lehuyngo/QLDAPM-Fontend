import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

export const useSendMail = async (data: FormData) => {
  try {
    const response = await api.post(`${BASE_URL}/mails`, data)
    return response.data
  } catch (error) {
    throw error
  }
}
export const useSendBatchMail = async (data: FormData) => {
  try {
    const response = await api.post(`${BASE_URL}/batch-mails`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

// export const useGetNoteDetailClient = (
//   ownerID: string | null,
//   id: string | null
// ) => {
//   const fetchData = async () => {
//     try {
//       const response = await api.get(`/clients/${ownerID}/notes/${id}`)
//       return response.data
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   return useQuery({
//     queryKey: ['GetNoteDetail', id, ownerID],
//     queryFn: () => fetchData(),
//     staleTime: 3 * 1000,
//     refetchOnWindowFocus: false,
//     retry: 2,
//     enabled: !!id && !!ownerID
//   })
// }

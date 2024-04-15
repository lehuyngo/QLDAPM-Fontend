import axios from 'axios'
import { LOCAL_STORAGE_ITEM } from '../../constants/common'
import { useQuery } from '@tanstack/react-query'

interface ConvertUrlToFileResult {
  file?: File
  error?: string
}

export const useConvertUrlToFile = (url: string) => {
  const fetchData = async (): Promise<ConvertUrlToFileResult> => {
    let token = localStorage.getItem(LOCAL_STORAGE_ITEM.TOKEN)
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const blob = new Blob([response.data], {
        type: response.headers['content-type']
      })

      const file = new File([blob], 'no_name', { type: blob.type })

      return { file }
    } catch (error) {
      return {
        error:
          'Error converting URL to file: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      }
    }
  }

  return useQuery({
    queryKey: ['convertUrlToFile', url],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!url
  })
}

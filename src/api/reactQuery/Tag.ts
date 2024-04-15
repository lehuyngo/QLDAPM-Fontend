import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { TAG_PAGE } from '../../constants/common'

export const useCreateClientTag = async ({
  clientID,
  data
}: {
  clientID: string
  data: {
    name: string
    color: string
  }
}) => {
  try {
    const response = await api.post(`/clients/${clientID}/tags`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetTags = (from: string) => {
  const fetchData = async () => {
    try {
      const response = await api.get(
        `/${TAG_PAGE[from as keyof typeof TAG_PAGE]}`
      )
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetClientTags', from],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!from
  })
}

export const useDeleteClientTag = async ({
  clientID,
  uuid
}: {
  clientID: string
  uuid: string
}) => {
  try {
    const response = await api.delete(`/clients/${clientID}/tags/${uuid}`, {
      data: { is_fully_deleted: 0 }
    })

    return response.data
  } catch (error) {
    throw error
  }
}

export const useCreateContactTag = async ({
  contactID,
  data
}: {
  contactID: string
  data: {
    name: string
    color: string
  }
}) => {
  try {
    const response = await api.post(`/contacts/${contactID}/tags`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useDeleteContactTag = async ({
  contactID,
  uuid
}: {
  contactID: string | null
  uuid: string | null
}) => {
  try {
    const response = await api.delete(`/contacts/${contactID}/tags/${uuid}`)
    return response.data
  } catch (error) {
    throw error
  }
}

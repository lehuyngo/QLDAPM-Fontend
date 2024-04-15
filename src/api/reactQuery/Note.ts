import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'
interface dataType {
  formData: any
  uuid: string | null
  ownerID: string | null
}
export const useCreateNoteClient = async (data: FormData) => {
  try {
    const response = await api.post(
      `${BASE_URL}/clients/${data.get('ownerID')}/notes`,
      {
        title: data.get('title'),
        content: data.get('content'),
        color: data.get('color')
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetNoteDetailClient = (
  ownerID: string | null,
  id: string | null
) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients/${ownerID}/notes/${id}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetNoteDetail', id, ownerID],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!id && !!ownerID
  })
}

export const useGetNoteListClient = (ownerID: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients/${ownerID}/notes`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetNoteList', ownerID],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!ownerID,
    retry: 2
  })
}

export const useUpdateNoteClient = async (data: dataType) => {
  const { formData, uuid, ownerID } = data

  try {
    const response = await api.put(
      `${BASE_URL}/clients/${ownerID}/notes/${uuid}`,
      formData
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useDeleteNoteClient = async (data: FormData) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/clients/${data.get('ownerID')}/notes/${data.get('uuid')}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useCreateNoteContact = async (data: FormData) => {
  try {
    const response = await api.post(
      `${BASE_URL}/contacts/${data.get('ownerID')}/notes`,
      {
        title: data.get('title'),
        content: data.get('content'),
        color: data.get('color')
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetNoteDetailContact = (
  ownerID: string | null,
  id: string | null
) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts/${ownerID}/notes/${id}`)

      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetNoteDetail', id, ownerID],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!id && !!ownerID
  })
}

export const useGetNoteListContact = (ownerID: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts/${ownerID}/notes`)

      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetNoteList', ownerID],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!ownerID,
    retry: 2
  })
}

export const useUpdateNoteContact = async (data: dataType) => {
  const { formData, uuid, ownerID } = data

  try {
    const response = await api.put(
      `${BASE_URL}/contacts/${ownerID}/notes/${uuid}`,
      formData
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useDeleteNoteContact = async (data: FormData) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/contacts/${data.get('ownerID')}/notes/${data.get('uuid')}`
    )

    return response.data
  } catch (error) {
    throw error
  }
}

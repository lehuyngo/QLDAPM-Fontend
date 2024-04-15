import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

export const useCreateContact = async (formData: any) => {
  try {
    const response = await api.post(`${BASE_URL}/contacts`, formData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetContactDetail = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts/${uuid}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetContactDetail', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useGetContactsList = () => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetContactsList'],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  })
}

interface dataType {
  formData: FormData
  uuid: string | null
}
export const useUpdateContact = async (data: dataType) => {
  const { formData, uuid } = data
  try {
    const response = await api.put(`${BASE_URL}/contacts/${uuid}`, formData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useDeleteContact = async (uuid: string | null) => {
  try {
    const response = await api.delete(`${BASE_URL}/contacts/${uuid}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// attach file

export const useAttachFileContact = async (Data: {
  formData: FormData
  uuid: string | null
}) => {
  const { formData, uuid } = Data
  try {
    const response = await api.post(
      `${BASE_URL}/contacts/${uuid}/files`,
      formData
    )
    return response
  } catch (error) {
    throw error
  }
}

export const useGetAttachFilesContact = (
  uuid: string | null,
  isCall: boolean
) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts/${uuid}/files`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetAttachFilesContact', uuid, isCall],
    queryFn: () => fetchData(),
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid && isCall
  })
}

export const useDeleteAttachFileContact = async (data: {
  uuid: string | null
  fileId: string | null
}) => {
  const { uuid, fileId } = data

  try {
    const response = await api.delete(
      `${BASE_URL}/contacts/${uuid}/files/${fileId}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetContactTagActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts/${uuid}/tag_activities`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetContactTagActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useGetContactNoteActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts/${uuid}/note_activities`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetContactNoteActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useGetContactMailActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts/${uuid}/mail_activities`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetContactMailActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useGetContactReport = () => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/draft-contact-report`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetContactReport'],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  })
}

export const useGetContactActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts/${uuid}/contact_activities`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetContactActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useGetContactClientActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts/${uuid}/client_activities`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetContactClientActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useCreateContactShortClick = async (data: {
  uuid: string
  body: any
}) => {
  const { uuid, body } = data
  try {
    const response = await api.post(
      `${BASE_URL}/contacts/${uuid}/mail-shortclicks`,
      body
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetContactShortClickActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(
        `${BASE_URL}/contacts/${uuid}/mail-shortclicks`
      )
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetContactShortClickActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useGetContactLeadActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(
        `${BASE_URL}/contacts/${uuid}/project_activities`
      )
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetContactLeadActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

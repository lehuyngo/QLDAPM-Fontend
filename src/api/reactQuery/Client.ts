import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

export const useCreateClient = async (formData: FormData) => {
  try {
    const response = await api.post(`${BASE_URL}/clients`, formData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetClientDetail = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients/${uuid}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetClientDetail', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useGetClientsList = () => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetClientsList'],
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
export const useUpdateClient = async (data: dataType) => {
  const { formData, uuid } = data
  try {
    const response = await api.put(`${BASE_URL}/clients/${uuid}`, formData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useDeleteClient = async (uuid: string | null) => {
  try {
    const response = await api.delete(`${BASE_URL}/clients/${uuid}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// attach file

export const useAttachFileClient = async (Data: {
  formData: FormData
  uuid: string | null
}) => {
  const { formData, uuid } = Data
  try {
    const response = await api.post(
      `${BASE_URL}/clients/${uuid}/files`,
      formData
    )
    return response
  } catch (error) {
    throw error
  }
}

export const useGetAttachFilesClient = (
  uuid: string | null,
  isCall: boolean
) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients/${uuid}/files`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetAttachFilesClient', uuid],
    queryFn: () => fetchData(),
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid && isCall
  })
}

export const useDeleteAttachFileClient = async (data: {
  uuid: string | null
  fileId: string | null
}) => {
  const { uuid, fileId } = data

  try {
    const response = await api.delete(
      `${BASE_URL}/clients/${uuid}/files/${fileId}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}
export const useCreateLeadClient = async (data: {
  clientID: string | null
  dataLead: {
    fullname: string | null
    shortname?: string | null
    code?: string | null
  }
}) => {
  const { clientID, dataLead } = data
  try {
    const response = await api.post(
      `${BASE_URL}/clients/${clientID}/projects`,
      { new_project: dataLead }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
export const useAddLeadClient = async (data: {
  clientID: string | null
  leadsID: string[]
}) => {
  const { clientID, leadsID } = data
  try {
    const response = await api.post(
      `${BASE_URL}/clients/${clientID}/projects`,
      { uuids: leadsID }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
export const useGetLeadsOfClient = (clientID: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients/${clientID}/projects`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetLeadsOfClient', clientID],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!clientID
  })
}

export const useDeleteLeadFromClient = async ({
  clientID,
  leadID
}: {
  clientID: string | null
  leadID: string | null
}) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/clients/${clientID}/projects/${leadID}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetClientTagActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients/${uuid}/tag_activities`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetClientTagActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useGetClientNoteActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients/${uuid}/note_activities`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetClientNoteActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useGetClientActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients/${uuid}/client_activities`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetClientActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useGetClientContactActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients/${uuid}/contact_activities`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetClientContactActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useGetClientLeadActivities = (uuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients/${uuid}/project_activities`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetClientLeadActivities', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

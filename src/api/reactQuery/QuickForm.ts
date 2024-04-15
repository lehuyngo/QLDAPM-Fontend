import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

//add Contact to client

export const useCreateQuickContact = async (data: {
  clientUuid: string | null
  contactInfo: any
}) => {
  const { clientUuid, contactInfo } = data
  try {
    const response = await api.post(
      `${BASE_URL}/clients/${clientUuid}/contacts`,
      contactInfo
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useAddContactsToClient = async (data: {
  clientUuid: string | null
  contactsList: any
}) => {
  const { clientUuid, contactsList } = data
  try {
    const response = await api.post(
      `${BASE_URL}/clients/${clientUuid}/contacts`,
      contactsList
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetContactsForClient = (clientID: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/clients/${clientID}/contacts`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetContactsForClient', clientID],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!clientID
  })
}

export const useDeleteClientLinkContact = async ({
  clientUuid,
  contactUuid
}: {
  clientUuid: string | null
  contactUuid: string | null
}) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/clients/${clientUuid}/contacts/${contactUuid}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

//add client to contact
export const useCreateQuickClient = async (data: {
  contactUuid: string | null
  clientInfo: any
}) => {
  const { contactUuid, clientInfo } = data
  try {
    const response = await api.post(
      `${BASE_URL}/contacts/${contactUuid}/clients`,
      clientInfo
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useAddClientsToContact = async (data: {
  contactUuid: string | null
  clientsList: any
}) => {
  const { contactUuid, clientsList } = data
  try {
    const response = await api.post(
      `${BASE_URL}/contacts/${contactUuid}/clients`,
      clientsList
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetClientsForContact = (contactId: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts/${contactId}/clients`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetClientsForContact', contactId],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!contactId
  })
}

export const useDeleteContactLinkClient = async ({
  clientUuid,
  contactUuid
}: {
  clientUuid: string | null
  contactUuid: string | null
}) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/contacts/${contactUuid}/clients/${clientUuid}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

// Add Lead to Contact
export const useCreateQuickLeadToContact = async (data: {
  contactUuid: string | null
  leadInfo: any
}) => {
  const { contactUuid, leadInfo } = data
  try {
    const response = await api.post(
      `${BASE_URL}/contacts/${contactUuid}/projects`,
      leadInfo
    )
    return response.data
  } catch (error) {
    throw error
  }
}
export const useGetLeadToContactList = (contactId: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/contacts/${contactId}/projects`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetLeadToContactList', contactId],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!contactId
  })
}
export const useAddLeadsToContact = async (data: {
  contactUuid: string | null
  leadsList: any
}) => {
  const { contactUuid, leadsList } = data
  try {
    const response = await api.post(
      `${BASE_URL}/contacts/${contactUuid}/projects`,
      leadsList
    )
    return response.data
  } catch (error) {
    throw error
  }
}
export const useDeleteContactLinkLead = async ({
  leadUuid,
  contactUuid
}: {
  leadUuid: string | null
  contactUuid: string | null
}) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/contacts/${contactUuid}/projects/${leadUuid}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

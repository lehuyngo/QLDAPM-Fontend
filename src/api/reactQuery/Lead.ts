import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

export const useCreateLead = async (data: any) => {
  try {
    const response = await api.post(`${BASE_URL}/projects`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useUpdateLead = async (data: any) => {
  const { dataUpdate, uuid } = data
  try {
    const response = await api.put(`${BASE_URL}/projects/${uuid}`, dataUpdate)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useUpdateStatusLead = async (data: any) => {
  const { dataUpdate, uuid } = data
  try {
    const response = await api.put(
      `${BASE_URL}/projects/${uuid}/status`,
      dataUpdate
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetLeadList = () => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/projects`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetLeadList'],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  })
}

export const useGetLeadDetail = (leadUuid: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/projects/${leadUuid}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetLeadDetail', leadUuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!leadUuid
  })
}

export const useGetLeadStatus = () => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/project-statuses`)
      return response.data?.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetLeadStatus'],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  })
}

export const useDeleteLead = async (uuid: string | null) => {
  try {
    const response = await api.delete(`${BASE_URL}/projects/${uuid}`)
    return response.data
  } catch (error) {
    throw error
  }
}

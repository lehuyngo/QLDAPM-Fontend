import { useQuery } from '@tanstack/react-query'
import { api } from '../../configs/AxiosConfigs'
import { BASE_URL } from '../../constants/endpoints'

export const useCreateTask = async (data: any) => {
  try {
    const response = await api.post(`${BASE_URL}/tasks`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useUpdateTask = async ({
  dataUpdate,
  uuid
}: {
  dataUpdate: any
  uuid: string | null
}) => {
  try {
    const response = await api.put(`${BASE_URL}/tasks/${uuid}`, dataUpdate)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useUpdateTaskStatus = async ({
  status,
  uuid
}: {
  status: {
    status: string | number
  }
  uuid: string | null
}) => {
  try {
    const response = await api.put(`${BASE_URL}/tasks/${uuid}/status`, status)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetTaskList = (refetch?: string) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/tasks`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetTaskList', refetch],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  })
}

export const useGetTaskDetail = (taskId: string | null) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/tasks/${taskId}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetTaskDetail', taskId],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!taskId
  })
}

export const useDeleteTask = async (uuid: string | null) => {
  try {
    const response = await api.delete(`${BASE_URL}/tasks/${uuid}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useTaskAssignee = async ({
  data,
  taskId
}: {
  data: any
  taskId: string | null
}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/tasks/${taskId}/assignees`,
      data
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useTaskDeleteAssignee = async ({
  userId,
  taskId
}: {
  userId: string | null | any
  taskId: string | null
}) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/tasks/${taskId}/assignees/${userId}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetTaskListOfLead = (uuid: string) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`${BASE_URL}/projects/${uuid}/tasks`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetTaskListOfLead', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useTaskDeleteFile = async ({
  fileId,
  taskId
}: {
  fileId: string | null
  taskId: string | null
}) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/tasks/${taskId}/files/${fileId}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const useTaskEditFile = async ({
  data,
  taskId
}: {
  data: FormData
  taskId: string | null
}) => {
  try {
    const response = await api.post(`${BASE_URL}/tasks/${taskId}/files`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useTaskChangeStatus = async ({
  status,
  taskId
}: {
  status: any
  taskId: string | null
}) => {
  try {
    const response = await api.put(`${BASE_URL}/tasks/${taskId}/status`, status)
    return response.data
  } catch (error) {
    throw error
  }
}

//task comment
export const useGetTaskComment = (uuid: string) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`${BASE_URL}/tasks/${uuid}/comments`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['GetTaskComment', uuid],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!uuid
  })
}

export const useAddTaskComment = async ({
  content,
  taskId
}: {
  content: {}
  taskId: string | null
}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/tasks/${taskId}/comments`,
      content
    )
    return response.data
  } catch (error) {
    throw error
  }
}

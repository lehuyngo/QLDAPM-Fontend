import { saveAs } from 'file-saver'
import axios from 'axios'

import { LOCAL_STORAGE_ITEM } from '../../constants/common'
import { BASE_URL } from '../../constants/endpoints'
import { api } from '../../configs/AxiosConfigs'
import { useQuery } from '@tanstack/react-query'

interface dataProps {
  url: string
  nameFile: string
  fileType: string
}

export const fetchDataAndSaveAs = async (data: dataProps) => {
  let token = localStorage.getItem(LOCAL_STORAGE_ITEM.TOKEN)

  const { url, nameFile, fileType } = data

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob'
    })

    const blob = new Blob([response.data], { type: fileType })

    if (fileType === 'application/pdf' || fileType === 'image/jpeg') {
      const urlFile = window.URL.createObjectURL(blob)
      window.open(urlFile, '_blank')
    } else {
      saveAs(blob, nameFile)
      return URL.createObjectURL(response.data)
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const useUploadStaticFile = async (data: { formData: FormData }) => {
  const { formData } = data
  try {
    const response = await api.post(`${BASE_URL}/static-files`, formData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useGetStaticFile = ({ fileID, fileName }: any) => {
  const fetchData = async () => {
    try {
      const response = await api.get(
        `${BASE_URL}/static-files/${fileID}/${fileName}`,
        { responseType: 'blob' }
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  return useQuery({
    queryKey: ['GetStaticFile', fileID, fileName],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!fileID && !!fileName
  })
}

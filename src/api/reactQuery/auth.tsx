import { BASE_URL } from '../../constants/endpoints'
import { api } from '../../configs/AxiosConfigs'
import { LoginData, RegisterData } from '../../features/interface'

const useLogin = async (data: LoginData | null) => {
  try {
    const response = await api.post(`${BASE_URL}/auth`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

const useRegister = async (data: RegisterData | null) => {
  try {
    const response = await api.post(`${BASE_URL}/register`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export { useLogin, useRegister }

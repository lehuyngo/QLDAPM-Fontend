import type { TablePaginationConfig } from 'antd/es/table'
import type { FilterValue } from 'antd/es/table/interface'

interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Record<string, FilterValue>
}

interface CrmHeaderProps {
  title: string
}

interface LoginData {
  username: string
  password: string
}

interface RegisterData {
  username: string
  password: string
  displayname: string
  email: string
  organization_name: string
}

interface UserMeData {
  uuid: string
  displayname: string
  email: string
  username: string,
  avatar: string,
}

export type { TableParams, CrmHeaderProps, RegisterData, LoginData, UserMeData }

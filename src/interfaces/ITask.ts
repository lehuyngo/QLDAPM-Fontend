import { IFileAuth } from './IFileAuth'
import { ILead } from './ILead'
import { IUser } from './IUser'

interface ITask {
  uuid: string
  title: string
  status: number
  priority: number
  label: number
  project: ILead
  deadline: number
  estimated_hours: number
  description: string
  assignees: IUser[]
  created_time: number
  creator: IUser
  attach_files: IFileAuth[]
}

export type { ITask }

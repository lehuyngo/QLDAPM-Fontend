import { IClient } from './IClient'
import { IFileAuth } from './IFileAuth'
import { ITag } from './ITag'

interface IContact {
  uuid: string
  fullname: string
  shortname: string
  email: string
  last_active_time: number
  created_time: number
  name_card: IFileAuth
  phone: string
  job_title: string
  gender: number
  birthday: string
  tags?: ITag[]
  clients?: IClient[]
}

export type { IContact }

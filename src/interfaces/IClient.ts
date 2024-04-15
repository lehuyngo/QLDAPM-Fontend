import { IContact } from './IContact'
import { IFileAuth } from './IFileAuth'
import { ITag } from './ITag'

interface IClient {
  uuid: string
  fullname: string
  shortname: string
  website: string
  address: string
  last_active_time: number
  created_time: number
  logo: IFileAuth
  tags?: ITag[]
  contacts?: IContact[]
}

export type { IClient }

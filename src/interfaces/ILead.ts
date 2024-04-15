import { IClient } from './IClient'
import { IContact } from './IContact'

interface ILead {
  uuid: string
  fullname: string
  shortname: string
  last_active_time: number
  created_time: number
  project_status: number
  client: IClient
  contacts: IContact[]
}

export type { ILead }

import { IContributor } from './IContributor'
import { IContact } from './IContact'
import { IUser } from './IUser'

interface IMeetingNote {
  uuid: string
  start_time: number
  location: string
  note: string
  contributors: IContributor[]
  editors: (IUser | IContact)[]
  creator: IUser
  created_time: number
}

interface IDraftMeetingNote {
  createdAt: number
  id: string
  content: string
  openForm?: boolean
  leadID: string
}

export type { IMeetingNote, IDraftMeetingNote }

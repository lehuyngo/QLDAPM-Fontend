import { IContributor } from './IContributor'
import { IContact } from './IContact'
import { IUser } from './IUser'

interface IMeeting {
  uuid: string
  start_time: number
  location: string
  link: string
  attendees: IContributor[]
  creator: IUser
  created_time: number
  last_active_time: number
}

export type { IMeeting }
